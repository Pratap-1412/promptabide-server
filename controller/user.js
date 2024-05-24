// routes/auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userSchema');
require('dotenv').config();

// Register user
const RegisterUser = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;

        // Check if email or username is already registered
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            // Respond with a specific status code and message
            return res.status(400).json({ error: 'Email or username is already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        res.status(200).send({ message: 'User registered. Check your email for verification.' });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
};


// Verify email
const VerifyToken = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.isVerified = true;
        await user.save();

        res.status(200).send('Email verified successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying email');
    }
};

// Login
const LoginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Check if identifier is defined
        if (!identifier) {
            return res.status(400).send('Identifier (email or username) is required');
        }

        // Find the user by email or username
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() }
            ]
        });

        if (!user || !user.isVerified) {
            return res.status(401).send('Invalid credentials or unverified email');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '30d' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
};


module.exports = {
    RegisterUser,
    LoginUser,
    VerifyToken
};
