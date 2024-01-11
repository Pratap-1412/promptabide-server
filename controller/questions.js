const Question = require('../models/questionSchema');

const createQuestions = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    res.status(201).json({ message: "Question Created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ votes: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateVotes = async (req, res) => {
  const { questionId } = req.params;
  const  {user}  = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
      { $push: { votes: { user: user } } },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeVotes = async (req, res) => {
  const { questionId } = req.params; 
  const  {user}  = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
      { $pull: { votes: { user: user } } },      
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createQuestions,
  getQuestions, 
  updateVotes,
  removeVotes
};
