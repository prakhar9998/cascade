const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  listID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'list',
  },
  boardID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'board',
  },
  assigned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  labels: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('Card', cardSchema);
