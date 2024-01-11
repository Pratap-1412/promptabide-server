const Prompt = require('../models/promptsSchema');

const createPrompt = async (req, res) => {
  try {
    const newPrompt = await Prompt.create(req.body);
    res.status(201).json({ message: "Prompt Created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ likes: -1 });
    res.status(200).json(prompts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateLikes = async (req, res) => {
  const { promptId } = req.params; // Assuming you pass the prompt ID as a route parameter
  const  {user}  = req.body;
   // Assuming you send the user's ID in the request body

  try {
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      promptId,
      { $push: { likes: { user: user } } },
      { new: true }
    );

    if (!updatedPrompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    res.status(200).json(updatedPrompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeLikes = async (req, res) => {
  const { promptId } = req.params; // Assuming you pass the prompt ID as a route parameter
  const  {user}  = req.body;
   // Assuming you send the user's ID in the request body

  try {
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      promptId,
      { $pull: { likes: { user: user } } },      
      { new: true }
    );

    if (!updatedPrompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    res.status(200).json(updatedPrompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createPrompt,
  getPrompts, 
  updateLikes,
  removeLikes
};
