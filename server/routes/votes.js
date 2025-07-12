const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  voteQuestion, 
  voteAnswer,
  getQuestionVoteStatus,
  getAnswerVoteStatus 
} = require('../controllers/voteController');

// @route   POST /api/votes/question/:id
// @desc    Vote on a question (upvote/downvote)
// @access  Private
router.post('/question/:id', auth, voteQuestion);

// @route   GET /api/votes/question/:id/status
// @desc    Get user's vote status for a question
// @access  Private
router.get('/question/:id/status', auth, getQuestionVoteStatus);

// @route   POST /api/votes/answer/:id
// @desc    Vote on an answer (upvote/downvote)
// @access  Private
router.post('/answer/:id', auth, voteAnswer);

// @route   GET /api/votes/answer/:id/status
// @desc    Get user's vote status for an answer
// @access  Private
router.get('/answer/:id/status', auth, getAnswerVoteStatus);

module.exports = router;
