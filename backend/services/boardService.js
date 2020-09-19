const mongoose = require('mongoose');

const Board = require('../models/Board');
const User = require('../models/User');

const ErrorResponse = require('../utils/errorResponse');

const createBoard = async (board) => {
  const boardRecord = await Board.create({
    title: board.title,
    description: board.description,
    creator: board.user,
    members: [board.user],
  });

  return { board: boardRecord };
};

// aggregation query for embedding cards inside every list in the lists array.
const getBoardData = async (boardId) => {
  const boardAgg = await Board.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(boardId) },
    },
    { $lookup: { from: 'users', localField: 'members', foreignField: '_id', as: 'members' } },
    { $project: { 'members.password': 0 } },
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
                { $sort: { order: 1 } },
              ],
              as: 'cards',
            },
          },
          { $sort: { order: 1 } },
        ],
        as: 'lists',
      },
    },
  ]);

  if (boardAgg.length !== 1) {
    throw new ErrorResponse('Resource not found', 404);
  }

  return { board: boardAgg[0] };
};

const getAllBoards = async (userId) => {
  const boardRecords = await Board.find({ members: userId });

  if (!boardRecords) {
    throw new ErrorResponse('No boards found', 404);
  }

  return { boards: boardRecords };
};

const updateBoardData = async (board) => {
  let boardRecord = await Board.findById(board.id);
  if (!boardRecord) {
    throw new ErrorResponse('Board does not exist', 404);
  }

  boardRecord = await Board.findByIdAndUpdate(board.id, board.data, { new: true });
  boardRecord.save();

  return { board: boardRecord };
};

const addMemberToBoard = async (data) => {
  const userRecord = await User.findOne({ email: data.userEmail });
  if (!userRecord) {
    throw new ErrorResponse('User does not exist', 404);
  }

  const boardRecord = await Board.findById(data.boardId);
  if (!boardRecord) {
    throw new ErrorResponse('Board does not exist', 404);
  }

  const isAlreadyAdded = boardRecord.members.some((member) => {
    return member.equals(userRecord._id);
  });

  if (!isAlreadyAdded) {
    boardRecord.members.push(userRecord);
    boardRecord.save();
  }

  return { board: boardRecord };
};

module.exports = { createBoard, getBoardData, getAllBoards, updateBoardData, addMemberToBoard };
