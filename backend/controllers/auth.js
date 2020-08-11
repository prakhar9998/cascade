const asyncHandler = require('../middlewares/async');
const { registerValidation, loginValidation } = require('../validation');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return next(new ErrorResponse('Email already exists!', 400));
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = user.getAuthToken();

  return res.status(200).json({ success: true, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = user.getAuthToken();
    return res.status(200).header('Bearer').json({ success: true, token });
  } catch (err) {
    return next(err);
  }
});
