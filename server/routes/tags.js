const express = require('express');
const router = express.Router();
const { getTags, createTag, getPopularTags } = require('../controllers/tagController');
const auth = require('../middleware/auth');

// @route   GET api/tags
// @desc    Get all tags
// @access  Public
router.get('/', getTags);

// @route   POST api/tags
// @desc    Create a tag
// @access  Private
router.post('/', auth, createTag);

// @route   GET api/tags/popular
// @desc    Get popular tags
// @access  Public
router.get('/popular', getPopularTags);

module.exports = router;
