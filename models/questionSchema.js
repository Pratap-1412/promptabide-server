const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  AITool: {
    type: String,
    required: true
  },
  AIToolCategory: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true,
  },
  votes: [
    {
      user: String,
    }
  ],
  tags: [
    {
      type: String
    },
  ],
  answers: [
    {
      type: String
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('questions', studentSchema);
