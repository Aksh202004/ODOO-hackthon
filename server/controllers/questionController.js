const { validationResult } = require('express-validator');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Tag = require('../models/Tag');
const User = require('../models/User');

// @desc    Get all questions with pagination and filtering
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt', 
      tags, 
      search 
    } = req.query;
    
    const skip = (page - 1) * limit;
    let query = { isActive: true };

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',');
      const tagIds = await Tag.find({ 
        name: { $in: tagArray } 
      }).select('_id');
      query.tags = { $in: tagIds.map(tag => tag._id) };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .populate('tags', 'name color')
      .populate('acceptedAnswer', 'author')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation')
      .populate('tags', 'name color')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar reputation'
        },
        options: { sort: { isAccepted: -1, createdAt: -1 } }
      });

    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Increment view count
    await Question.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });

    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, tags } = req.body;

    // Validate and get tag IDs
    const tagObjects = await Tag.find({ _id: { $in: tags } });
    if (tagObjects.length !== tags.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more tags are invalid'
      });
    }

    const question = new Question({
      title,
      description,
      author: req.user.id,
      tags
    });

    await question.save();

    // Update user's questions asked
    await User.findByIdAndUpdate(req.user.id, {
      $push: { questionsAsked: question._id }
    });

    // Update tag question counts
    await Tag.updateMany(
      { _id: { $in: tags } },
      { $inc: { questionCount: 1 } }
    );

    // Populate the created question
    await question.populate('author', 'username avatar reputation');
    await question.populate('tags', 'name color');

    res.status(201).json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user owns the question or is admin
    if (question.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, tags } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (tags) {
      // Validate tags
      const tagObjects = await Tag.find({ _id: { $in: tags } });
      if (tagObjects.length !== tags.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more tags are invalid'
        });
      }
      updateData.tags = tags;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('author', 'username avatar reputation')
      .populate('tags', 'name color');

    res.json({
      success: true,
      question: updatedQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user owns the question or is admin
    if (question.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Soft delete the question
    await Question.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    // Soft delete all answers to this question
    await Answer.updateMany(
      { question: req.params.id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
