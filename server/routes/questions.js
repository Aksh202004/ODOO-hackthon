const express = require('express');
const router = express.Router();
const { getQuestions, getQuestion, createQuestion, getHotQuestions } = require('../controllers/questionController');
const auth = require('../middleware/auth');

// @route   GET api/questions
// @desc    Get all questions
// @access  Public
router.get('/', getQuestions);

// @route   GET api/questions/hot
// @desc    Get hot questions
// @access  Public
router.get('/hot', getHotQuestions);

// @route   GET api/questions/:id
// @desc    Get single question
// @access  Public
router.get('/:id', getQuestion);

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post('/', auth, createQuestion);

module.exports = router;
