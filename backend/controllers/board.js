const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const { createBoardValidation } = require('../validation/boardValidation');
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

  return res.status(201).json({ success: true, data: { id: board._id } });
});

exports.getBoard = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;
  if (!boardId) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  try {
    const board = await Board.findOne({ _id: boardId });
    console.log('board is', board);
    const responseData = {
      id: board._id,
      title: board.title,
      description: board.description,
      members: board.members,
      creator: board.creator,
    };

    console.log('response data', responseData);

    return res.status(200).json({ success: true, data: { ...responseData } });
  } catch (err) {
    return next(new ErrorResponse('Resource not found'), 404);
  }
});
