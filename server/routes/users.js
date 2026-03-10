const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET api/users/friends
// @desc    Get current user's friends
// @access  Private
router.get('/friends', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'friends',
      select: 'firstName lastName profilePic bio' // include bio
    });
    return res.json({ success: true, data: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;