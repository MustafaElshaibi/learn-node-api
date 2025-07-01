const mongoose = require('mongoose');
const validator = require('validator');
const roles = require('../utility/roles');
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  }, 
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: [roles.USER, roles.ADMIN, roles.MANAGER],
    default: roles.USER
  },
  avatar: {
    type: String,
    default: 'avatar.png',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("User", userSchema);