const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  markAllAsRead,
} = require('../controllers/notificationController');

// @route   GET api/notifications
// @desc    Get all notifications for a user
// @access  Private
router.get('/', auth, getNotifications);

// @route   PUT api/notifications/mark-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-read', auth, markAllAsRead);

module.exports = router;
