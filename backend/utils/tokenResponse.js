const sendTokenResponse = (res, user, statusCode) => {
  const expiration = process.env.JWT_COOKIE_EXPIRE || 8 * 3600000;
  const token = user.getAuthToken();
  const options = {
    expires: new Date(Date.now() + expiration),
    secure: false, // set to true in production(https)
    httpOnly: true,
  };

  return res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

module.exports = sendTokenResponse;
