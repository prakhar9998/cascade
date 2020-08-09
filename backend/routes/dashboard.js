const express = require('express');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/dashboard', protect, (req, res) => {
  res.status(200).send("You're on dashboard.");
});

module.exports = router;
