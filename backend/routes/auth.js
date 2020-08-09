const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const asynhHandler = require('../middlewares/async');
const asyncHandler = require('../middlewares/async');

const router = express.Router();

router.post('/register', asyncHandler(async (req, res, next) => {
  // validating data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0]);

  // checking if user is already registered
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send({ message: 'Email already exists!' });

  const salt = 10;
  const passwordHashed = await argon2.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: passwordHashed,
  });

  try {
    const savedUser = await user.save();
    return res.send({ user: savedUser._id });
  } catch (err) {
    return res.status(400).send(err);
  }
}));

router.post('/login', asyncHandler(async (req, res) => {
  // validating data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking if user is already registered
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: 'Email or password is invalid!' });

  // verify password
  const correctPassword = await argon2.verify(user.password, req.body.password);
  if (!correctPassword) return res.status(400).send({ message: 'Email or passsword is invalid!' });

  // create and assign token
  const token = jwt.sign({ _id: user.__id }, process.env.TOKEN_SECRET);
  return res.header('auth-token', token).send(token);
}));

module.exports = router;
