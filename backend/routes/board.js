const express = require('express');

const {
  createBoard,
  getBoard,
  listBoards,
  updateBoard,
  deleteBoard,
} = require('../controllers/board');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/all', protect, listBoards);
router.get('/:boardId', protect, getBoard);
router.post('/create', protect, createBoard);
router.post('/update/:boardId', protect, updateBoard);
router.post('/delete/:boardId', protect, deleteBoard);

module.exports = router;
