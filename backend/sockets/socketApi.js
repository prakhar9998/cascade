const socketIo = require('socket.io');

const io = socketIo();
const socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('test event', () => {
    io.emit('test event', { response: 'true' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = socketApi;
