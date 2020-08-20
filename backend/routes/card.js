const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createCard,
  getCards,
  detailCard,
  updateCard,
  deleteCard,
} = require('../controllers/cards');

const router = express.Router();

router.post('/create', protect, createCard);
router.get('/all', protect, getCards);
router.get('/:id', protect, detailCard);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;
