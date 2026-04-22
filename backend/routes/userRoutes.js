const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/user/all
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/user/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both old and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Fetch user from DB (protect middleware fetches user but without password, so we need it again)
    const user = await User.findById(req.user._id);

    // Verify old password
    const isMatch = oldPassword === user.password;
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Update user password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/user/delete-account
// @desc    Delete user account and associated donations
// @access  Private
router.delete('/delete-account', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user's donations
    await Donation.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
