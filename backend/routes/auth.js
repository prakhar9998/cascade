const express = require('express');
const { register, login, logout, userDetails } = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, userDetails);

module.exports = router;
