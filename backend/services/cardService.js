const mongoose = require('mongoose');

const Card = require('../models/Card');
const ErrorResponse = require('../utils/errorResponse');
const boardService = require('./boardService');

const createCard = async (card) => {
  // new card is always created at the bottom of the list.
  const bottomCardRecord = await Card.find({ listId: card.listId }).sort('-order').limit(1);

  let cardOrder;
  if (bottomCardRecord.length === 0) {
    // this is the first card created in the list.
    cardOrder = 0;
  } else {
    // TODO: set 1024 as DRAGGABLE_ITEM_BUFFER_SIZE in config.
    cardOrder = bottomCardRecord[0].order + 1024;
  }

  const cardRecord = await Card.create({
    title: card.title,
    description: card.description,
    listId: card.listId,
    boardId: card.boardId,
    creator: card.user,
    order: cardOrder,
  });

  return { card: cardRecord };
};

// might not really need this since the board is providing all the data
const getCardData = async (cardId) => {
  // TODO: Populate fields
  const cardRecord = await Card.findById(cardId);

  return { card: cardRecord };
};

const updateCardData = async (card) => {
  let cardRecord = await Card.findById(card.id);
  if (!cardRecord) {
    throw new ErrorResponse('Reource not found', 404);
  }

  cardRecord = await Card.findByIdAndUpdate(card.id, card.data, { new: true });
  cardRecord.save();

  return { card: cardRecord };
};

const changePositionInList = async (source, destination, listId, boardId) => {
  // this function expect validated data to be given to it, no nonsense
  // initial and final position are indexes in the list array not the "order" property.

  const sortedCardRecords = await Card.find({ listId, boardId }).sort('order');
  const totalCardRecords = sortedCardRecords.length;

  if (source < 0 || source > totalCardRecords - 1) {
    // oopsie
    throw new ErrorResponse('Invalid position', 400);
  }

  // if destination is out of the bounds then insert at top or bottom
  if (destination <= 0) {
    // position this card at top
    sortedCardRecords[source].order = sortedCardRecords[0].order - 1024;
  } else if (destination >= totalCardRecords) {
    // positing this card at bottom
    sortedCardRecords[source].order = sortedCardRecords[totalCardRecords - 1].order + 1024;
  } else {
    // push somewhere in the middle

    // TODO: reassign the ordering with equal spacing in case
    // the average is too small (below a certain threshold)

    sortedCardRecords[source].order =
      source > destination
        ? (sortedCardRecords[destination - 1].order + sortedCardRecords[destination].order) / 2
        : (sortedCardRecords[destination + 1].order + sortedCardRecords[destination].order) / 2;
  }
  await sortedCardRecords[source].save();

  const updatedBoard = await boardService.getBoardData(boardId);
  return { board: updatedBoard };
};

const moveCardToList = async (source, destination, sourceListId, destinationListId, boardId) => {
  const sourceCardRecords = await Card.find({ listId: sourceListId, boardId }).sort('order');
  const destinationCardRecords = await Card.find({
    listId: destinationListId,
    boardId,
  }).sort('order');

  const totalRecords = destinationCardRecords.length;
  let newOrder;
  if (totalRecords === 0) {
    newOrder = 0;
  } else if (destination <= 0) {
    // at top
    newOrder = destinationCardRecords[0].order - 1024;
  } else if (destination >= totalRecords) {
    // at bottom
    newOrder = destinationCardRecords[totalRecords - 1].order + 1024;
  } else {
    // in middle
    newOrder =
      (destinationCardRecords[destination - 1].order + destinationCardRecords[destination].order) /
      2;
  }

  sourceCardRecords[source].order = newOrder;
  sourceCardRecords[source].listId = mongoose.Types.ObjectId(destinationListId);
  await sourceCardRecords[source].save();

  const updatedBoard = await boardService.getBoardData(boardId);
  return { board: updatedBoard };
};

module.exports = { createCard, getCardData, updateCardData, changePositionInList, moveCardToList };
