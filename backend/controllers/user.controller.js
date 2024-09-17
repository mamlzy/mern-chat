const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const { generateToken } = require('../config/generate-token');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, pic });
  if (user) {
    res.status(201).json({
      ...user.toJSON(),
      password: undefined,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Failed to create user');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password, user.password))) {
    res.json({
      ...user.toJSON(),
      password: undefined,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

module.exports = { registerUser, authUser };
