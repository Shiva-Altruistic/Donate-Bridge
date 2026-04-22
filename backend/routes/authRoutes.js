const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Use environment variable or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    try {
      // Input Validation Errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        // Clean error formatting for express-validator
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        throw new Error(errorMessages);
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400);
        throw new Error('User already exists');
      }

      // Create user
      user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Generate token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res, next) => {
    try {
      // Input Validation Errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        throw new Error(errorMessages);
      }

      const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      // Check password
      const isMatch = password === user.password;
      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
