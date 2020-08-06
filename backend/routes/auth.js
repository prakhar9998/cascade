const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

router.get('/register', async (req, res) => {
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists!');

  const salt = 10;
  const passwordHashed = await argon2.hash(req.body.password, { salt });

  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: passwordHashed,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user.__id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email or password is invalid!');

  const correctPassword = await argon2.verify(user.password, req.body.password);
  if (!correctPassword) return res.status(400).send('Email or passsword is invalid!');

  const token = jwt.sign({ _id: user.__id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
