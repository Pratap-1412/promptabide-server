const Users = require('../models/userSchema');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const secretKey = 'abcd123'
const jwt = require('jsonwebtoken')

const UserLogin = async (request, response) => {
  try {
    const { userName, password } = request.body;

    const User = await Users.findOne({ userName });

    if (User) {
      const isPasswordMatch = await bcrypt.compare(password, User.password);

      if (isPasswordMatch) {
        jwt.sign({ User }, secretKey, (error, token) => {
          response.status(200).json({ message: 'LogIn successfull', token: token });
        })
      } else {
        return response.status(401).json('Invalid Login');
      }
    } else {
      return response.status(401).json('Invalid Login');
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};



const UserRegister = async (request, response) => {
  try {
    const exist = await Users.findOne({ username: request.body.username });
    if (exist) {
      return response.status(401).json({ message: 'User already exists' });
    }
    const User = request.body;
    const newUser = new Users(User);
    await newUser.save();
    if (newUser) {
      // sendVerifyEmail(newUser.firstName,newUser.email,newUser._id);
      jwt.sign({ User }, secretKey, (error, token) => {
        response.status(200).json({ message: 'User registered successfully', token: token });
      })
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (request, response) => {
  jwt.verify(request.token, secretKey, (error, authData) => {
    if (error) {
      return response.status(401).json({ error: 'Invalid Token' });
    } else {
      response.json({
        message: 'Profile can be accessed now',
        authData,
      });
    }
  });
};

const verifyUserMail = async (req, res) => {
  try {
    const { UserId } = req.params;

    // Find the User by ID and update the isVerified field
    const User = await Users.findByIdAndUpdate(
      UserId,
      { isVerified: true },
      { new: true }
    );

    if (!User) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'User isVerified field updated successfully', User });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const sendVerifyEmail = async (name, email, userID) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'studymateeasy@gmail.com',
        pass: 'wkpewbtrruybpzjj'
      }

    })
    const mailOptions = {
      from: 'studymateeasy@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<h3>Hye ${name}</h3><p>Greetings from StudyMate,
      We received a request to verify your account associated with this e-mail address. Click the link below to verify your account:</p><a href='http://localhost:3000/mail-verification/User/id/${userID}'>Verify your account.</a>`
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Email sent successfully ", info.response)
      }
    })
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
    UserLogin,
    UserRegister
};
