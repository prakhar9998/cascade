const asyncHandler = require('../middlewares/async');
const { createListValidation, updateListValidation } = require('../validation/listValidation');
const ErrorResponse = require('../utils/errorResponse');
const List = require('../models/List');

exports.createList = asyncHandler(async (req, res, next) => {
  const { value, error } = createListValidation(req.body);
  // it does not validate for objectID since mongoose will anyway throw
  // an error if it's not valid.
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }

  const list = await List.create(value);

  return res.status(201).json({ success: true, data: { id: list._id } });
});

exports.getList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const list = await List.findById(id);

  return res.status(200).json({ success: true, data: { id: list._id, title: list.title } });
});

exports.getLists = asyncHandler(async (req, res, next) => {
  const lists = await List.find({});

  if (!lists) {
    return next(new ErrorResponse('No lists found'), 404);
  }

  return res.status(200).json({ success: true, data: lists });
});

exports.updateList = asyncHandler(async (req, res, next) => {
  const { value, error } = updateListValidation(req.body);
  if (error) {
    return next(new ErrorResponse(error.message), 400);
  }

  const { id } = req.params;
  if (!id) {
    return next(new ErrorResponse('Resource not specified'), 400);
  }

  let list = await List.findById(id);
  if (!list) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  list = await List.findByIdAndUpdate(id, value, { new: true });
  list.save();

  return res.status(200).json({ success: true, data: { id: list._id, title: list.title } });
});

exports.deleteList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorResponse('Resource not specified', 400));
  }

  const list = await List.deleteOne({ _id: id });
  return res.status(200).json({ success: true, data: { ...list } });
});
