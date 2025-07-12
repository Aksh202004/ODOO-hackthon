const { validationResult } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Public
const getAnswers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const question = await Question.findById(req.params.questionId);
    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answers = await Answer.find({ 
      question: req.params.questionId, 
      isActive: true 
    })
      .populate('author', 'username avatar reputation')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Answer.countDocuments({ 
      question: req.params.questionId, 
      isActive: true 
    });

    res.json({
      success: true,
      answers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get answers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new answer
// @route   POST /api/answers
// @access  Private
const createAnswer = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { content, questionId } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = new Answer({
      content,
      author: req.user.id,
      question: questionId
    });

    await answer.save();

    // Update question's answers array
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id }
    });

    // Update user's answers given
    await User.findByIdAndUpdate(req.user.id, {
      $push: { answersGiven: answer._id }
    });

    // Create notification for question author
    if (question.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: question.author,
        sender: req.user.id,
        type: 'answer',
        message: `${req.user.username} answered your question "${question.title}"`,
        relatedQuestion: questionId,
        relatedAnswer: answer._id
      });
      await notification.save();
    }

    // Populate the created answer
    await answer.populate('author', 'username avatar reputation');

    res.status(201).json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private
const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer || !answer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user owns the answer or is admin
    if (answer.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { content } = req.body;
    
    const updatedAnswer = await Answer.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar reputation');

    res.json({
      success: true,
      answer: updatedAnswer
    });
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Accept answer
// @route   PUT /api/answers/:id/accept
// @access  Private (question owner only)
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate('question');
    
    if (!answer || !answer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user owns the question
    if (answer.question.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only question owner can accept answers'
      });
    }

    // Unaccept previously accepted answer if any
    await Answer.updateMany(
      { question: answer.question._id },
      { isAccepted: false }
    );

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    // Update question's accepted answer
    await Question.findByIdAndUpdate(answer.question._id, {
      acceptedAnswer: answer._id
    });

    // Create notification for answer author
    if (answer.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: answer.author,
        sender: req.user.id,
        type: 'accepted_answer',
        message: `Your answer was accepted for "${answer.question.title}"`,
        relatedQuestion: answer.question._id,
        relatedAnswer: answer._id
      });
      await notification.save();
    }

    // Update answer author's reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: 15 }
    });

    res.json({
      success: true,
      message: 'Answer accepted successfully'
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer || !answer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user owns the answer or is admin
    if (answer.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Soft delete the answer
    await Answer.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    // Remove from question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });

    // If this was the accepted answer, remove it from question
    await Question.findOneAndUpdate(
      { acceptedAnswer: answer._id },
      { $unset: { acceptedAnswer: "" } }
    );

    res.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAnswers,
  createAnswer,
  updateAnswer,
  acceptAnswer,
  deleteAnswer
};
