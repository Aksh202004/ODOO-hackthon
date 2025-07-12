const express = require('express');
const router = express.Router();
const { createAnswer } = require('../controllers/answerController');
const auth = require('../middleware/auth');

// @route   POST api/answers
// @desc    Create an answer
// @access  Private
router.post('/', createAnswer);

module.exports = router;
