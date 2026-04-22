const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: [
      'Clothes', 'Food', 'Books', 'Medical', 'Education', 'Shelter',
      'Disaster Relief', 'Orphan Support', 'Elderly Care',
      'General Fund', 'Other'
    ],
    required: true
  },
  type: {
    type: String,
    enum: ['ngo', 'general'],
    default: 'ngo',
    required: true
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed'],
    default: 'Pending'
  },
  paymentId: {
    type: String
  }
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
