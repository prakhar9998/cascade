const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Unauthorized to access this route.', 401));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verified);
    return next();
  } catch (err) {
    return next(new ErrorResponse('Unauthorized to access this route.'), 401);
  }
};
