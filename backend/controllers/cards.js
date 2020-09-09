const asyncHandler = require('../middlewares/async');
const { createCardValidation, updateCardValidation } = require('../validation/cardValidation');
const { updatePositionValidation } = require('../validation/updatePositionValidation');
const ErrorResponse = require('../utils/errorResponse');
const Card = require('../models/Card');
const cardService = require('../services/cardService');

exports.createCard = asyncHandler(async (req, res, next) => {
  const { value, error } = createCardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }

  const cardDTO = { ...value, user: req.user };

  const { card } = await cardService.createCard(cardDTO);

  return res.status(201).json({ success: true, data: card });
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

  const { card } = await cardService.getCardData(id);

  return res.status(200).json({ success: true, data: card });
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

  const cardDTO = { id, data: value };

  const card = await cardService.updateCardData(cardDTO);

  return res.status(200).json({ success: true, data: card });
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
  const { value, error } = updatePositionValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }

  await cardService.changePositionInList(
    value.initialPosition,
    value.finalPosition,
    value.listId,
    value.boardId,
  );

  return res.status(200).json({ success: true, data: { message: 'Updated' } });
});
