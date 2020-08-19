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
router.post('/create', protect, createBoard);
router.get('/:boardId', protect, getBoard);
router.put('/:boardId', protect, updateBoard);
router.delete('/:boardId', protect, deleteBoard);

module.exports = router;
