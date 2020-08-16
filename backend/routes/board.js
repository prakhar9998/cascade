const express = require('express');

const { createBoard, getBoard, listBoards } = require('../controllers/board');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/all', protect, listBoards);
router.get('/:boardId', protect, getBoard);
router.post('/create', protect, createBoard);

module.exports = router;
