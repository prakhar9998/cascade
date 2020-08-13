const asyncHandler = require('../middlewares/async');
const {
  registerValidation,
  loginValidation,
} = require('../validation/authValidation');
const ErrorResponse = require('../utils/errorResponse');
const sendTokenResponse = require('../utils/tokenResponse');
const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {
  const { value, error } = registerValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return next(new ErrorResponse('Email already exists!', 400));
  }

  const user = await User.create({
    firstname: value.firstname,
    email: value.email,
    password: value.password,
  });

  return sendTokenResponse(res, user, 200);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );

    return sendTokenResponse(res, user, 200);
  } catch (err) {
    return next(err);
  }
});
