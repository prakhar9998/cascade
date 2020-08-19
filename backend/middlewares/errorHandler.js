const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, _req, res, next) => {
  let error = { ...err };

  // log error to console for development
  console.log(err);

  error.message = err.message;

  // mongoose throws an error for a query if the id passed in isn't valid ObjectID object.
  // Server should respond with 404 instead of 500 server error in this case
  if (err instanceof mongoose.CastError) {
    error = new ErrorResponse('Resource not found', 404);
  }

  // mongoose throws a validation error if one of the required fields is invalid ObjectID
  if (err.name === 'ValidationError') {
    error = new ErrorResponse(err._message, 400);
  }

  // error shouldn't include error.message in production
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Server error',
  });
};

module.exports = errorHandler;
