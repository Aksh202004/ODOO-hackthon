const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  getUnreadCount,
  deleteNotification 
} = require('../controllers/notificationController');

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', auth, getUnreadCount);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, markAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, deleteNotification);

module.exports = router;
