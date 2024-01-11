const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  prompt: {
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
  likes: [
    {
      user: String,
    }
  ],
  tags: [
    {
      type: String
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('prompts', studentSchema);
