const { validationResult } = require('express-validator');
const Tag = require('../models/Tag');
const Question = require('../models/Question');

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
const getTags = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sort = '-questionCount',
      search 
    } = req.query;
    
    const skip = (page - 1) * limit;
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const tags = await Tag.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Tag.countDocuments(query);

    res.json({
      success: true,
      tags,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get popular tags
// @route   GET /api/tags/popular
// @access  Public
const getPopularTags = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const tags = await Tag.find({ 
      isActive: true,
      questionCount: { $gt: 0 }
    })
      .sort({ questionCount: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      tags
    });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single tag with questions
// @route   GET /api/tags/:id
// @access  Public
const getTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag || !tag.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Get questions with this tag
    const questions = await Question.find({ 
      tags: tag._id, 
      isActive: true 
    })
      .populate('author', 'username avatar reputation')
      .populate('tags', 'name color')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      tag: {
        ...tag.toObject(),
        questions
      }
    });
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new tag
// @route   POST /api/tags
// @access  Private (admin only)
const createTag = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, color } = req.body;

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: 'Tag already exists'
      });
    }

    const tag = new Tag({
      name: name.toLowerCase(),
      description,
      color: color || '#007bff'
    });

    await tag.save();

    res.status(201).json({
      success: true,
      tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update tag
// @route   PUT /api/tags/:id
// @access  Private (admin only)
const updateTag = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { name, description, color } = req.body;
    
    const tag = await Tag.findById(req.params.id);
    if (!tag || !tag.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name.toLowerCase() !== tag.name) {
      const existingTag = await Tag.findOne({ 
        name: name.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existingTag) {
        return res.status(400).json({
          success: false,
          message: 'Tag name already exists'
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name.toLowerCase();
    if (description !== undefined) updateData.description = description;
    if (color) updateData.color = color;

    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      tag: updatedTag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete tag
// @route   DELETE /api/tags/:id
// @access  Private (admin only)
const deleteTag = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const tag = await Tag.findById(req.params.id);
    if (!tag || !tag.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Check if tag is being used by any questions
    const questionsWithTag = await Question.countDocuments({ 
      tags: tag._id, 
      isActive: true 
    });

    if (questionsWithTag > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tag that is being used by questions'
      });
    }

    // Soft delete the tag
    await Tag.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getTags,
  getPopularTags,
  getTag,
  createTag,
  updateTag,
  deleteTag
};
