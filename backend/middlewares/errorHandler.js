const errorHandler = (err, req, res, next) => {
  console.log("An error occured!", err);
  return res.status(500).send('Server error');
};

module.exports = errorHandler;
