const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Answers schema
const answerSchema = new Schema({
  answer: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'questions', // Reference to the Question model
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create the Answers model
const Answer = mongoose.model('Answers', answerSchema);

module.exports = Answer;
