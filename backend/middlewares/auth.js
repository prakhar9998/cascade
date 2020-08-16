const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('./async');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route.', 401));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = await User.findById(verified.id);

    // TIL mongoose doesn't throw error if user is not found.
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to acces this route.', 401));
    }

    return next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route.', 401));
  }
});
