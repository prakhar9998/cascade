const Joi = require('@hapi/joi');

exports.updatePositionValidation = (data) => {
  const schema = Joi.object({
    source: Joi.number().required(),
    destination: Joi.number().required(),
    listId: Joi.string().required(),
    boardId: Joi.string().required(),
  });

  return schema.validate(data);
};

exports.moveCardValidation = (data) => {
  const schema = Joi.object({
    source: Joi.number().required(),
    destination: Joi.number().required(),
    sourceListId: Joi.string().required(),
    destinationListId: Joi.string().required(),
    boardId: Joi.string().required(),
  });

  return schema.validate(data);
};
