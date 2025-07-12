const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, getLeaderboard } = require('../controllers/userController');

// @route   GET /api/users/leaderboard
// @desc    Get user leaderboard
// @access  Public
router.get('/leaderboard', getLeaderboard);

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', getProfile);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, updateProfile);

module.exports = router;
