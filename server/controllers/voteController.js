const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

// @desc    Vote on a question (upvote/downvote)
// @route   POST /api/votes/question/:id
// @access  Private
const voteQuestion = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const questionId = req.params.id;
    const userId = req.user.id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type'
      });
    }

    const question = await Question.findById(questionId);
    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is trying to vote on their own question
    if (question.author.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote on your own question'
      });
    }

    // Check if user has already upvoted
    const hasUpvoted = question.votes.upvotes.some(
      vote => vote.user.toString() === userId
    );

    // Check if user has already downvoted
    const hasDownvoted = question.votes.downvotes.some(
      vote => vote.user.toString() === userId
    );

    let updateOperation = {};
    let reputationChange = 0;

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        updateOperation = {
          $pull: { 'votes.upvotes': { user: userId } }
        };
        reputationChange = -5;
      } else {
        // Add upvote and remove downvote if exists
        updateOperation = {
          $pull: { 'votes.downvotes': { user: userId } },
          $push: { 'votes.upvotes': { user: userId } }
        };
        reputationChange = hasDownvoted ? 7 : 5; // +5 for upvote, +2 to cancel downvote
      }
    } else { // downvote
      if (hasDownvoted) {
        // Remove downvote
        updateOperation = {
          $pull: { 'votes.downvotes': { user: userId } }
        };
        reputationChange = 2;
      } else {
        // Add downvote and remove upvote if exists
        updateOperation = {
          $pull: { 'votes.upvotes': { user: userId } },
          $push: { 'votes.downvotes': { user: userId } }
        };
        reputationChange = hasUpvoted ? -7 : -2; // -2 for downvote, -5 to cancel upvote
      }
    }

    // Update question votes
    await Question.findByIdAndUpdate(questionId, updateOperation);

    // Update question author's reputation
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: reputationChange }
    });

    // Get updated question with vote counts
    const updatedQuestion = await Question.findById(questionId);

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      voteCount: updatedQuestion.voteCount,
      userVote: hasUpvoted && voteType === 'upvote' ? null : 
                hasDownvoted && voteType === 'downvote' ? null : voteType
    });
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Vote on an answer (upvote/downvote)
// @route   POST /api/votes/answer/:id
// @access  Private
const voteAnswer = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const answerId = req.params.id;
    const userId = req.user.id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type'
      });
    }

    const answer = await Answer.findById(answerId);
    if (!answer || !answer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user is trying to vote on their own answer
    if (answer.author.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote on your own answer'
      });
    }

    // Check if user has already upvoted
    const hasUpvoted = answer.votes.upvotes.some(
      vote => vote.user.toString() === userId
    );

    // Check if user has already downvoted
    const hasDownvoted = answer.votes.downvotes.some(
      vote => vote.user.toString() === userId
    );

    let updateOperation = {};
    let reputationChange = 0;

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        updateOperation = {
          $pull: { 'votes.upvotes': { user: userId } }
        };
        reputationChange = -10;
      } else {
        // Add upvote and remove downvote if exists
        updateOperation = {
          $pull: { 'votes.downvotes': { user: userId } },
          $push: { 'votes.upvotes': { user: userId } }
        };
        reputationChange = hasDownvoted ? 12 : 10; // +10 for upvote, +2 to cancel downvote
      }
    } else { // downvote
      if (hasDownvoted) {
        // Remove downvote
        updateOperation = {
          $pull: { 'votes.downvotes': { user: userId } }
        };
        reputationChange = 2;
      } else {
        // Add downvote and remove upvote if exists
        updateOperation = {
          $pull: { 'votes.upvotes': { user: userId } },
          $push: { 'votes.downvotes': { user: userId } }
        };
        reputationChange = hasUpvoted ? -12 : -2; // -2 for downvote, -10 to cancel upvote
      }
    }

    // Update answer votes
    await Answer.findByIdAndUpdate(answerId, updateOperation);

    // Update answer author's reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: reputationChange }
    });

    // Get updated answer with vote counts
    const updatedAnswer = await Answer.findById(answerId);

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      voteCount: updatedAnswer.voteCount,
      userVote: hasUpvoted && voteType === 'upvote' ? null : 
                hasDownvoted && voteType === 'downvote' ? null : voteType
    });
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's vote status for a question
// @route   GET /api/votes/question/:id/status
// @access  Private
const getQuestionVoteStatus = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.id;

    const question = await Question.findById(questionId);
    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const hasUpvoted = question.votes.upvotes.some(
      vote => vote.user.toString() === userId
    );
    const hasDownvoted = question.votes.downvotes.some(
      vote => vote.user.toString() === userId
    );

    let userVote = null;
    if (hasUpvoted) userVote = 'upvote';
    if (hasDownvoted) userVote = 'downvote';

    res.json({
      success: true,
      userVote,
      voteCount: question.voteCount
    });
  } catch (error) {
    console.error('Get question vote status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's vote status for an answer
// @route   GET /api/votes/answer/:id/status
// @access  Private
const getAnswerVoteStatus = async (req, res) => {
  try {
    const answerId = req.params.id;
    const userId = req.user.id;

    const answer = await Answer.findById(answerId);
    if (!answer || !answer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    const hasUpvoted = answer.votes.upvotes.some(
      vote => vote.user.toString() === userId
    );
    const hasDownvoted = answer.votes.downvotes.some(
      vote => vote.user.toString() === userId
    );

    let userVote = null;
    if (hasUpvoted) userVote = 'upvote';
    if (hasDownvoted) userVote = 'downvote';

    res.json({
      success: true,
      userVote,
      voteCount: answer.voteCount
    });
  } catch (error) {
    console.error('Get answer vote status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  voteQuestion,
  voteAnswer,
  getQuestionVoteStatus,
  getAnswerVoteStatus
};
