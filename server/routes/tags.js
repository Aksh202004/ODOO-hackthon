const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getTags, 
  createTag, 
  getPopularTags,
  getTag,
  updateTag,
  deleteTag 
} = require('../controllers/tagController');

// @route   GET /api/tags
// @desc    Get all tags
// @access  Public
router.get('/', getTags);

// @route   GET /api/tags/popular
// @desc    Get popular tags
// @access  Public
router.get('/popular', getPopularTags);

// @route   GET /api/tags/:id
// @desc    Get single tag with questions
// @access  Public
router.get('/:id', getTag);

// @route   POST /api/tags
// @desc    Create new tag
// @access  Private (admin only)
router.post('/', auth, createTag);

// @route   PUT /api/tags/:id
// @desc    Update tag
// @access  Private (admin only)
router.put('/:id', auth, updateTag);

// @route   DELETE /api/tags/:id
// @desc    Delete tag
// @access  Private (admin only)
router.delete('/:id', auth, deleteTag);

module.exports = router;
