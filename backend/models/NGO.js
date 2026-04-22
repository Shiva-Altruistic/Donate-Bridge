const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  type: {
    type: String,
    enum: ['Orphanage', 'Food Bank', 'Clinic', 'Shelter', 'Other'],
    default: 'Other'
  }
}, { timestamps: true });

const NGO = mongoose.model('NGO', ngoSchema);

module.exports = NGO;
