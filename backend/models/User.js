/* eslint-disable func-names */
const mongoose = require('mongoose');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const ErrorResponse = require('../utils/errorResponse');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      min: 3,
      max: 128,
    },
    lastname: {
      type: String,
      max: 128,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      min: 8,
      max: 512,
    },
  },
  { timestamps: true },
);

userSchema.virtual('fullname').get(function () {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // hashing password before save
  this.password = await argon2.hash(this.password);
});

userSchema.methods.getAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new ErrorResponse('Email or password is invalid.', 400);
  }

  // matching passwords
  console.log('user password', user);
  const isPasswordCorrect = await argon2.verify(user.password, password);
  if (!isPasswordCorrect) {
    throw new ErrorResponse('Email or password is invalid.', 400);
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
