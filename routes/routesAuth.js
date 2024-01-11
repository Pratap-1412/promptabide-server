require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

async function verifyTokenMiddleware(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return unauthorizedResponse(res, 'Token not provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const userId = extractUserId(decoded);

    if (!userId) {
      return unauthorizedResponse(res, 'Invalid token structure.');
    }

    // Use the `exec` method to execute the query and handle the result
    const user = await User.findById(userId).exec();

    if (!user) {
      return unauthorizedResponse(res, 'Access denied. User not found.');
    }

    // Attach user information to the request for further use
    req.user = user;
    next();
  } catch (error) {
    console.error('Token Decoding Error:',error);
    return unauthorizedResponse(res, 'Access denied. Invalid token.');
  }
}

function extractToken(req) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined' && bearerHeader.startsWith('Bearer ')) {
    return bearerHeader.split(' ')[1];
  }

  return null;
}

function extractUserId(decoded) {
  return decoded.userId; // Assuming user ID is stored in the userId claim
}

function unauthorizedResponse(res, message) {
  return res.status(401).json({ error: `Unauthorized: ${message}` });
}

module.exports = verifyTokenMiddleware;
