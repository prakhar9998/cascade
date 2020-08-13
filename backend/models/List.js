const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  boardID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'board',
  },
});

module.exports = mongoose.model('List', listSchema);
