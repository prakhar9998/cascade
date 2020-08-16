const errorHandler = (err, _req, res, next) => {
  const error = { ...err };

  // log error to console for development
  console.log(error);

  error.message = err.message;

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Server error',
  });
};

module.exports = errorHandler;
