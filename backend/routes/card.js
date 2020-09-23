const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createCard,
  getCards,
  detailCard,
  updateCard,
  deleteCard,
  changeCardPositionInList,
  moveCardToList,
  addLabel,
  assignMember,
} = require('../controllers/cards');

const router = express.Router();

router.post('/create', protect, createCard);
router.get('/all', protect, getCards);
router.get('/:id', protect, detailCard);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);
router.post('/:id/addlabel', protect, addLabel);
router.post('/changePosition', protect, changeCardPositionInList);
router.post('/moveCard', protect, moveCardToList);
router.post('/assign', protect, assignMember);

module.exports = router;
