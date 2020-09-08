const mongoose = require('mongoose');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const { createBoardValidation, updateBoardValidation } = require('../validation/boardValidation');
const Board = require('../models/Board');

// create a new board for authenticated user
exports.createBoard = asyncHandler(async (req, res, next) => {
  // protected route, creates a board for a user.
  const { value, error } = createBoardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }

  const board = await Board.create({
    title: value.title,
    description: value.description,
    creator: req.user,
    members: [req.user],
  });

  return res.status(201).json({ success: true, data: { id: board._id } });
});

// get board from id
exports.getBoard = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;
  if (!boardId) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  // aggregation query for embedding cards inside every list in the lists array.
  const boardAgg = await Board.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(boardId) },
    },
    {
      $lookup: {
        from: 'lists',
        let: { boardId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$boardId', '$$boardId'] } } },
          {
            $lookup: {
              from: 'cards',
              let: { listId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$listId', '$$listId'] } } },
                { $addFields: { id: '$_id' } },
                { $sort: { order: 1 } },
              ],
              as: 'cards',
            },
          },
          { $addFields: { id: '$_id' } },
          { $sort: { order: 1 } },
        ],
        as: 'lists',
      },
    },
  ]);

  // should return only 1 board since the _id match is used.
  if (boardAgg.length !== 1) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  const responseData = {
    id: boardAgg[0]._id,
    title: boardAgg[0].title,
    description: boardAgg[0].description,
    members: boardAgg[0].members,
    creator: boardAgg[0].creator,
    lists: boardAgg[0].lists,
  };

  return res.status(200).json({ success: true, data: { ...responseData } });
});

// list all the boards user has created
exports.listBoards = asyncHandler(async (req, res, next) => {
  const boards = await Board.find({ members: req.user._id });
  if (!boards) {
    return next(new ErrorResponse('No boards found', 400));
  }
  return res.status(200).json({ success: true, data: boards });
});

// update board from a given id
exports.updateBoard = asyncHandler(async (req, res, next) => {
  const { value, error } = updateBoardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(`Invalid parameters specified: ${error.message}`, 400));
  }
  const { boardId } = req.params;
  if (!boardId) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  let board = await Board.findById(boardId);
  if (!board) {
    return next(new ErrorResponse('Board does not exist', 404));
  }

  // check whether user is owner of the board or not
  if (board.creator.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this board', 401));
  }

  board = await Board.findByIdAndUpdate(boardId, value, { new: true });
  board.save();

  return res.status(200).json({
    success: true,
    data: {
      id: board._id,
      title: board.title,
      description: board.description,
      members: board.members,
      creator: board.creator,
    },
  });
});

// delete board with the given id
exports.deleteBoard = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;
  if (!boardId) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const board = await Board.deleteOne({ _id: boardId });
  return res.status(200).json({ success: true, data: { ...board } });
});
