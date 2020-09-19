const Joi = require('@hapi/joi');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const { createBoardValidation, updateBoardValidation } = require('../validation/boardValidation');
const Board = require('../models/Board');
const boardService = require('../services/boardService');

// create a new board for authenticated user
exports.createBoard = asyncHandler(async (req, res, next) => {
  // protected route, creates a board for a user.
  const { value, error } = createBoardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }

  const boardDTO = { ...value, user: req.user };

  const { board } = await boardService.createBoard(boardDTO);

  return res.status(201).json({ success: true, data: board });
});

// get board from id
exports.getBoard = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;
  if (!boardId) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const { board } = await boardService.getBoardData(boardId);

  return res.status(200).json({ success: true, data: board });
});

// list all the boards user has created
exports.listBoards = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const boards = await boardService.getAllBoards(userId);

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

  const boardDTO = { id: boardId, data: value };

  const board = await boardService.updateBoardData(boardDTO);

  return res.status(200).json({ success: true, data: board });
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

exports.addMember = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;
  if (!boardId) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const schema = Joi.object({
    email: Joi.string().required().email(),
  });

  const { value, error } = schema.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }

  const board = await boardService.addMemberToBoard({ boardId, userEmail: value.email });
  return res.status(200).json({ success: true, data: { ...board } });
});
