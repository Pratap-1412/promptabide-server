const Answer = require('../models/answersSchema');
const mongoose = require('mongoose')

const createAnswer = async (req, res) => {
  try {
    const { answer, username, questionId } = req.body;

    // Validate input
    if (!answer || !username || !questionId) {
      return res.status(400).json({ error: 'Please provide answer, username, and questionId.' });
    }

    // Create a new answer instance
    const newAnswer = new Answer({
      answer,
      username,
      questionId,
    });

    // Save the answer to the database
    const savedAnswer = await newAnswer.save();

    res.status(201).json(savedAnswer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAnswersByQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: 'Invalid questionId.' });
    }

    // Find answers for the given questionId
    const answers = await Answer.find({ questionId }).exec();

    res.status(200).json(answers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { answer, username } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({ error: 'Invalid answerId.' });
    }

    // Find and update the answer
    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { answer, username },
      { new: true }
    );

    // Check if the answer exists
    if (!updatedAnswer) {
      return res.status(404).json({ error: 'Answer not found.' });
    }

    res.status(200).json(updatedAnswer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({ error: 'Invalid answerId.' });
    }

    // Find and delete the answer
    const deletedAnswer = await Answer.findByIdAndDelete(answerId);

    // Check if the answer exists
    if (!deletedAnswer) {
      return res.status(404).json({ error: 'Answer not found.' });
    }

    res.status(200).json({ message: 'Answer deleted successfully.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
};
