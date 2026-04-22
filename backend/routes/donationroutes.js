const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const { protect, admin } = require('../middleware/authMiddleware');
const Razorpay = require('razorpay');

// @route   POST /api/donations/order
// @desc    Create Razorpay Order
// @access  Private
router.post('/order', protect, async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error('Valid amount is required');
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('amount', 'Please provide a valid donation amount').isNumeric().custom(value => value > 0),
      check('category', 'Category is required').not().isEmpty(),
      check('type', 'Type must be ngo or general').isIn(['ngo', 'general'])
    ]
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

      let { amount, category, type, ngoId, paymentId } = req.body;

      if (type === 'general') {
        ngoId = null;
      } else if (type === 'ngo' && !ngoId) {
        res.status(400);
        throw new Error('NGO selection is required for NGO donations');
      }

      // Create a new donation linked to the logged-in user
      const donation = new Donation({
        userId: req.user.id,
        amount,
        category,
        type,
        ngoId,
        paymentId
      });

      const savedDonation = await donation.save();
      const populatedDonation = await savedDonation.populate('ngoId', 'name city');
      res.status(201).json(populatedDonation);
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/donations
// @desc    Get logged-in user's donations
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    // Find donations where the user field matches the logged-in user's ID
    const donations = await Donation.find({ userId: req.user.id })
      .populate('ngoId', 'name city')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/donations/all
// @desc    Get all donations (Admin only)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res, next) => {
  try {
    const donations = await Donation.find({})
      .populate('userId', 'name email')
      .populate('ngoId', 'name city')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Completed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Allowed values: Pending, Approved, Completed');
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('userId', 'name email')
    .populate('ngoId', 'name city');

    if (!updatedDonation) {
      res.status(404);
      throw new Error('Donation not found');
    }
    
    res.json({ message: 'Status updated successfully', donation: updatedDonation });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/donations/:id/assign
// @desc    Assign general donation to NGO (Admin only)
// @access  Private/Admin
router.put('/:id/assign', protect, admin, async (req, res, next) => {
  try {
    const { ngoId } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      res.status(404);
      throw new Error('Donation not found');
    }
    
    if (donation.type !== 'general') {
      res.status(400);
      throw new Error('Only general donations can be assigned to an NGO');
    }
    
    donation.ngoId = ngoId;
    donation.type = 'ngo';
    const updatedDonation = await donation.save();
    
    // Populate before sending back
    await updatedDonation.populate('ngoId', 'name city');
    
    res.json(updatedDonation);
  } catch (error) {
    next(error);
  }
});

module.exports = router;