const List = require('../models/List');
const ErrorResponse = require('../utils/errorResponse');

const boardService = require('./boardService');

const createList = async (list) => {
  const bottomListRecord = await List.find({ boardId: list.boardId }).sort('-order').limit(1);
  let listOrder;
  if (bottomListRecord.length === 0) {
    listOrder = 0;
  } else {
    listOrder = bottomListRecord[0].order + 1024;
  }

  const listRecord = await List.create({
    title: list.title,
    boardId: list.boardId,
    order: listOrder,
  });

  return { list: listRecord };
};

const changePosition = async (source, destination, boardId) => {
  const sortedListRecords = await List.find({ boardId }).sort('order');
  const totalListRecords = sortedListRecords.length;

  if (source < 0 || source > totalListRecords - 1) {
    throw new ErrorResponse('Invalid position', 400);
  }

  if (destination <= 0) {
    sortedListRecords[source].order = sortedListRecords[0].order - 1024;
  } else if (destination >= totalListRecords - 1) {
    sortedListRecords[source].order = sortedListRecords[totalListRecords - 1].order + 1024;
  } else {
    sortedListRecords[source].order =
      source > destination
        ? (sortedListRecords[destination - 1].order + sortedListRecords[destination].order) / 2
        : (sortedListRecords[destination + 1].order + sortedListRecords[destination].order) / 2;
  }

  await sortedListRecords[source].save();

  const updatedBoard = await boardService.getBoardData(boardId);
  return { board: updatedBoard };
};

module.exports = { createList, changePosition };
