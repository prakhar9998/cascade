const express = require('express');

const { createBoard } = require('../controllers/board');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', protect, createBoard);

module.exports = router;
