const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }, 
  price: {
    type: Number,
    required: true,
  }
});

const course = mongoose.model('Course', courseSchema);

module.exports = course;