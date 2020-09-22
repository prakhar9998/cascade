const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const cookie = require('cookie');

const User = require('../models/User');
const Board = require('../models/Board');

const cardService = require('../services/cardService');
const { updatePositionValidation } = require('../validation/dragDropValidation');
const ErrorResponse = require('../utils/errorResponse');

const io = socketIo();
const socketApi = {};

socketApi.io = io;

const socketAuthMiddleware = async (socket, next) => {
  // checks whether user is authenticated or not

  const cookies = cookie.parse(socket.request.headers.cookie || '');
  const token = cookies.token || '';

  if (!token) {
    return next(new ErrorResponse('Authentication failed', 401));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    socket.decodedUser = await User.findById(verified.id);

    if (!socket.decodedUser) {
      return next(new ErrorResponse('Authentication failed', 401));
    }

    return next();
  } catch (err) {
    return next(new ErrorResponse('Authentication failed', 401));
  }
};

io.use(socketAuthMiddleware);

const checkBoardPermission = async (boardId, userId) => {
  // checks if user has permission to access the board by
  // confirming if the user exists as a member of the board.

  const boardRecord = await Board.findById(boardId);
  const isMember = boardRecord.members.some((member) => {
    return member.equals(userId);
  });
  if (!isMember) {
    return false;
  }
  return true;
};

io.on('connection', (socket) => {
  console.log('connected', socket.decodedUser.email);
  socket.on('join board room', (room) => {
    // this function ensures that client is only joined in one room at a time
    if (socket.lastRoom) {
      socket.leave(socket.lastRoom);
      socket.lastRoom = null;
      console.log('has a last room');
    }
    socket.join(room);
    socket.lastRoom = room;
    console.log('room joined', room);
  });

  socket.on('CHANGE_CARD_POSITION', async (data, callback) => {
    const { value, error } = updatePositionValidation(data);
    if (error) {
      // there was an error
      return callback('error');
    }

    // check if user has permission to make changes to this board.
    if (!checkBoardPermission(data.boardId, socket.decodedUser._id)) {
      return callback('permission denied');
    }

    try {
      const { board } = await cardService.changePositionInList(
        value.source,
        value.destination,
        value.listId,
        value.boardId,
      );
      console.log('boardId', value.boardId);
      socket.to(value.boardId).emit('card updated', { data: board });
      return callback('');
    } catch (err) {
      return callback('server error');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.decodedUser.email);
  });
});

module.exports = socketApi;
