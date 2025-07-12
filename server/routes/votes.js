const express = require('express');
const router = express.Router();

// @route   GET api/votes
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Votes route'));

module.exports = router;
