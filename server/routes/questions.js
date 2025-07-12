const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { 
  getQuestions, 
  getQuestion, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion 
} = require('../controllers/questionController');

// @route   GET /api/questions
// @desc    Get all questions with pagination
// @access  Public
router.get('/', getQuestions);

// @route   GET /api/questions/:id
// @desc    Get single question by ID
// @access  Public
router.get('/:id', getQuestion);

// @route   POST /api/questions
// @desc    Create new question
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 10, max: 150 }),
  body('description').trim().isLength({ min: 20 }),
  body('tags').isArray({ min: 1, max: 5 })
], auth, createQuestion);

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private
router.put('/:id', auth, updateQuestion);

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private
router.delete('/:id', auth, deleteQuestion);

module.exports = router;
