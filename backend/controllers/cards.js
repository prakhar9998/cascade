const asyncHandler = require('../middlewares/async');
const { createCardValidation, updateCardValidation } = require('../validation/cardValidation');
const ErrorResponse = require('../utils/errorResponse');
const Card = require('../models/Card');

exports.createCard = asyncHandler(async (req, res, next) => {
  const { value, error } = createCardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }

  const sortedCards = await Card.find({ listId: value.listId }).sort('order');

  let cardOrder;

  if (sortedCards.length === 0) {
    // this card is the first card in the list
    cardOrder = 0;
  } else {
    // insert at the bottom of the list of cards
    cardOrder = sortedCards[sortedCards.length - 1].order + 2048;
  }

  // TODO: Verify that the given boardId and listId exists.
  const card = await Card.create({
    title: value.title,
    description: value.description,
    listId: value.listId,
    boardId: value.boardId,
    creator: req.user,
    order: cardOrder,
  });

  const responseData = {
    title: card.title,
    description: card.description,
    listId: card.listId,
    boardId: card.boardId,
    creator: card.creator,
    assigned: card.assigned,
    labels: card.labels,
    order: cardOrder,
  };

  return res.status(201).json({ success: true, data: { ...responseData } });
});

exports.getCards = asyncHandler(async (req, res, next) => {
  // might not need this endpoint in the final design.
  const cards = await Card.find({});
  if (!cards) {
    return next(new ErrorResponse('No cards found'), 404);
  }

  return res.status(200).json({ success: true, data: cards });
});

exports.detailCard = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const card = await Card.findById(id);

  // TODO: Make a helper function for sending response data
  const responseData = {
    id: card._id,
    title: card.title,
    description: card.description,
    listId: card.listId,
    boardId: card.boardId,
    assigned: card.assigned,
    creator: card.creator,
    labels: card.labels,
  };

  return res.status(200).json({ success: true, data: { ...responseData } });
});

exports.updateCard = asyncHandler(async (req, res, next) => {
  const { value, error } = updateCardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }

  const { id } = req.params;
  if (!id) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  let card = await Card.findById(id);
  if (!card) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  card = await Card.findByIdAndUpdate(id, value, { new: true });
  card.save();

  const responseData = {
    id: card._id,
    title: card.title,
    description: card.description,
    listId: card.listId,
    boardId: card.boardId,
    assigned: card.assigned,
    creator: card.creator,
    labels: card.labels,
  };

  return res.status(200).json({ success: true, data: { ...responseData } });
});

exports.deleteCard = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const card = await Card.deleteOne({ _id: id });

  return res.status(200).json({ success: true, data: { ...card } });
});

exports.changeCardPositionInList = asyncHandler(async (req, res, next) => {
  const { initialPosition, finalPosition, listId, boardId } = req.body;

  // TODO: Add validation for checking initialPosition and finalPosition as numbers
  // validation
  // if (!initialPosition || !finalPosition || !listId || !boardId) {
  //   return next(new ErrorResponse('Validation failed', 400));
  // }

  if (initialPosition === finalPosition) {
    // do nothing

    // if (cards[0].order - 2048 <= -32000) {
    //   cards[initialPosition].order = (SOME_LOWER_BOUND + cards[0].order)/2;
    // }

    return res.status(200).json({ success: true, data: { message: 'Updated' } });
  }

  const cards = await Card.find({ listId, boardId }).sort('order');

  // TODO: validate that the positions are inside the range of card array length

  if (finalPosition <= 0) {
    // pushing at the top.
    cards[initialPosition].order = cards[0].order - 2048;
  } else if (finalPosition >= cards.length - 1) {
    // pushing at the bottom

    // if (cards[cards.length - 1].order + 2048 >= 32000) {
    //   // start taking average from the upper bound instead of adding the buffer
    //   cards[initialPosition].order = (SOME_UPPER_BOUND + cards[cards.length - 1].order) / 2;
    // }
    cards[initialPosition].order = cards[cards.length - 1].order + 2048;
  } else {
    // pushing somewhere in the middle
    // TODO: reassign the ordering with equal spacing in case the average is smaller than a certain threshold
    cards[initialPosition].order =
      (cards[finalPosition - 1].order + cards[finalPosition].order) / 2;
  }
  cards[initialPosition].save();

  return res.status(200).json({ success: true, data: { message: 'Updated' } });
});
