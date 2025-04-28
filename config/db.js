const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://codeat9am:xCc7CjdkPW6a8Mhh@women-analytics-db.67np8kh.mongodb.net/?retryWrites=true&w=majority&appName=women-analytics-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected ✅');
  } catch (error) {
    console.error('MongoDB connection failed ❌:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
