const express = require('express');
const { createList, getList, updateList, deleteList, getLists } = require('../controllers/list');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', protect, createList);
router.get('/all', protect, getLists);
router.get('/:id', protect, getList);
router.put('/:id', protect, updateList);
router.delete('/:id', protect, deleteList);

module.exports = router;
