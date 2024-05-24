const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    isVerified: {
        type: Boolean,
        default: true,
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
