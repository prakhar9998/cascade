const express = require('express');

const { createBoard, getBoard } = require('../controllers/board');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', protect, createBoard);
router.get('/:boardId', protect, getBoard);

module.exports = router;
