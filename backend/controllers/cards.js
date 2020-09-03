const asyncHandler = require('../middlewares/async');
const { createCardValidation, updateCardValidation } = require('../validation/cardValidation');
const ErrorResponse = require('../utils/errorResponse');
const Card = require('../models/Card');

exports.createCard = asyncHandler(async (req, res, next) => {
  const { value, error } = createCardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }
  console.log(value);
  // TODO: Verify that the given boardId and listId exists.
  const card = await Card.create({
    title: value.title,
    description: value.description,
    listId: value.listId,
    boardId: value.boardId,
    creator: req.user,
  });

  const responseData = {
    title: card.title,
    description: card.description,
    listId: card.listId,
    boardId: card.boardId,
    creator: card.creator,
    assigned: card.assigned,
    labels: card.labels,
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
