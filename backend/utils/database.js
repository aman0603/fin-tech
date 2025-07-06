const mongoose = require('mongoose');

const MONGODB_URI =  'mongodb://localhost:27017/finance';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });



module.exports = mongoose;