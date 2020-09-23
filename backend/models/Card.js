const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'list',
  },
  boardId: {
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
      name: { type: String, required: true },
      color: {
        type: String,
        validate: {
          validator: (v) => /^#([0-9a-f]{3}){1,2}$/i.test(v),
          message: (props) => `${props.value} is not a valid color hex value`,
        },
        required: true,
      },
    },
  ],
  order: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Card', cardSchema);
