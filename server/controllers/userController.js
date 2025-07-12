const { validationResult } = require('express-validator');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate({
        path: 'questionsAsked',
        select: 'title createdAt votes views',
        options: { limit: 10, sort: { createdAt: -1 } }
      })
      .populate({
        path: 'answersGiven',
        select: 'content createdAt votes isAccepted',
        populate: {
          path: 'question',
          select: 'title'
        },
        options: { limit: 10, sort: { createdAt: -1 } }
      });

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const questionCount = await Question.countDocuments({ 
      author: user._id, 
      isActive: true 
    });
    
    const answerCount = await Answer.countDocuments({ 
      author: user._id, 
      isActive: true 
    });
    
    const acceptedAnswersCount = await Answer.countDocuments({ 
      author: user._id, 
      isAccepted: true, 
      isActive: true 
    });

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        stats: {
          questionCount,
          answerCount,
          acceptedAnswersCount
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { username, avatar } = req.body;
    
    // Check if username is already taken
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('username avatar reputation')
      .sort({ reputation: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getLeaderboard
};
