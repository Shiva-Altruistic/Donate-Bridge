const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/ngos
// @desc    Get all NGOs
// @access  Public or Private
router.get('/', async (req, res, next) => {
  try {
    const ngos = await NGO.find({}).sort({ name: 1 });
    res.json(ngos);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ngos
// @desc    Create an NGO
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, city, pincode, address, type } = req.body;
    const ngo = new NGO({ name, city, pincode, address, type });
    const savedNgo = await ngo.save();
    res.status(201).json(savedNgo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
