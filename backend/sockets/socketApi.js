const socketIo = require('socket.io');
const cardService = require('../services/cardService');
const { updatePositionValidation } = require('../validation/dragDropValidation');

const io = socketIo();
const socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('test', () => {
    io.emit('test event', { response: 'true' });
  });

  socket.on('CHANGE_CARD_POSITION', async (data, callback) => {
    const { value, error } = updatePositionValidation(data);
    if (error) {
      // there was an error
      console.log('CHANGE POS ERROR', error);
      return callback('error');
    }

    await cardService.changePositionInList(
      value.source,
      value.destination,
      value.listId,
      value.boardId,
    );
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = socketApi;
