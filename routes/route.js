const express = require('express');
const {
  UserLogin,
  UserRegister,
} = require('../controller/users');
const {
  createPrompt,
  getPrompts,
  updateLikes,
  removeLikes,
} = require('../controller/prompts');
const {
  createQuestions,
  getQuestions,
  updateVotes,
  removeVotes,
} = require('../controller/questions');
const {
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
} = require('../controller/answers');
const {
  RegisterUser,
  LoginUser,
  VerifyToken
} = require('../controller/user');

const verifyRoute = require('./routesAuth');
const router = express.Router();
router.use(express.json());

// User authentication routes
router.post('/users/register', RegisterUser);
router.post('/users/login', LoginUser);
router.get('/verify/:token',VerifyToken);

// Prompt routes
router.post('/posts/create-prompt', createPrompt);
router.get('/posts/get-prompts',verifyRoute, getPrompts);
router.put('/prompts/:promptId/likes', updateLikes);
router.delete('/prompts/:promptId/likes', removeLikes);

// Question routes
router.post('/posts/create-question', createQuestions);
router.get('/posts/get-questions',verifyRoute, getQuestions);
router.put('/questions/:questionId/votes', updateVotes);
router.delete('/questions/:questionId/votes', removeVotes);

// Answer routes
router.post('/answers/create-answer', createAnswer);
router.get('/questions/:questionId/answers', getAnswersByQuestionId);
router.put('/answers/:answerId', updateAnswer);
router.delete('/answers/:answerId', deleteAnswer);

module.exports = router;
