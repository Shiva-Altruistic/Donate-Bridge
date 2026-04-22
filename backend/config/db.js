const mongoose = require('mongoose');

// Use a local MongoDB connection string for development if no environment variable is provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/charity_db';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
