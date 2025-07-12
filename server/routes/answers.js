const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { 
  getAnswers, 
  createAnswer, 
  updateAnswer, 
  deleteAnswer,
  acceptAnswer 
} = require('../controllers/answerController');

// @route   GET /api/answers/question/:questionId
// @desc    Get all answers for a question
// @access  Public
router.get('/question/:questionId', getAnswers);

// @route   POST /api/answers
// @desc    Create new answer
// @access  Private
router.post('/', [
  body('content').trim().isLength({ min: 10 }),
  body('questionId').isMongoId()
], auth, createAnswer);

// @route   PUT /api/answers/:id
// @desc    Update answer
// @access  Private
router.put('/:id', auth, updateAnswer);

// @route   PUT /api/answers/:id/accept
// @desc    Accept answer
// @access  Private (question owner only)
router.put('/:id/accept', auth, acceptAnswer);

// @route   DELETE /api/answers/:id
// @desc    Delete answer
// @access  Private
router.delete('/:id', auth, deleteAnswer);

module.exports = router;
