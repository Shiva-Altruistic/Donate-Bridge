const mongoose = require('mongoose');
require('dotenv').config();
const NGO = require('./models/NGO');

const seedNGOs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/charity_db');
    console.log('MongoDB Connected');

    const dummyNGOs = [
      { name: 'Hope Foundation', city: 'Hyderabad', pincode: '500001', type: 'Other' },
      { name: 'Care India', city: 'Delhi', pincode: '110001', type: 'Other' },
      { name: 'Smile Trust', city: 'Bangalore', pincode: '560001', type: 'Other' },
      { name: 'Helping Hands', city: 'Chennai', pincode: '600001', type: 'Other' }
    ];

    await NGO.insertMany(dummyNGOs);
    console.log('Dummy NGOs seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding NGOs:', error);
    process.exit(1);
  }
};

seedNGOs();
