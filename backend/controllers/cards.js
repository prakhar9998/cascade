const Joi = require('@hapi/joi');
const asyncHandler = require('../middlewares/async');
const { createCardValidation, updateCardValidation } = require('../validation/cardValidation');
const {
  updatePositionValidation,
  moveCardValidation,
} = require('../validation/dragDropValidation');
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

  const { board } = await cardService.changePositionInList(
    value.source,
    value.destination,
    value.listId,
    value.boardId,
  );

  return res.status(200).json({ success: true, data: board });
});

exports.moveCardToList = asyncHandler(async (req, res, next) => {
  const { value, error } = moveCardValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }

  const { board } = await cardService.moveCardToList(
    value.source,
    value.destination,
    value.sourceListId,
    value.destinationListId,
    value.boardId,
  );

  return res.status(200).json({ success: true, data: board });
});

exports.addLabel = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const { name, color } = req.body;

  if (!name || !color) {
    return next(new ErrorResponse('Validation failed', 400));
  }
  const { card } = await cardService.addLabel(id, name, color);
  return res.status(201).json({ success: true, data: card });
});

exports.assignMember = asyncHandler(async (req, res, next) => {
  // validation
  const { value, error } = Joi.object({
    email: Joi.string().required().email(),
    boardId: Joi.string().required(),
    cardId: Joi.string().required(),
  }).validate(req.body);

  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }

  const { card } = await cardService.assignMember(value);
  return res.status(200).json({ success: true, data: card });
});
