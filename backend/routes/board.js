const express = require('express');

const {
  createBoard,
  getBoard,
  listBoards,
  updateBoard,
  deleteBoard,
  addMember,
} = require('../controllers/board');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/all', protect, listBoards);
router.post('/create', protect, createBoard);
router.post('/:boardId/addmember', protect, addMember);
router.get('/:boardId', protect, getBoard);
router.put('/:boardId', protect, updateBoard);
router.delete('/:boardId', protect, deleteBoard);

module.exports = router;
