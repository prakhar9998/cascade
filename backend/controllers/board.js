const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
// const User = require('../models/User');
// const Board = require('../models/Board');
const {
  createBoardValidation,
} = require('../validation/boardValidation');
const Board = require('../models/Board');

exports.createBoard = asyncHandler(async (req, res, next) => {
  // protected route, creates a board for a user.
  const { value, error } = createBoardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }

  const board = await Board.create({
    title: value.title,
    description: value.description,
    creator: req.user,
  });
  board.members.push(req.user);

  return res
    .status(201)
    .json({ success: true, data: { title: board.title } });
});
