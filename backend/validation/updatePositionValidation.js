const Joi = require('@hapi/joi');

exports.updatePositionValidation = (data) => {
  const schema = Joi.object({
    initialPosition: Joi.number().required(),
    finalPosition: Joi.number().required(),
    listId: Joi.string().required(),
    boardId: Joi.string().required(),
  });

  return schema.validate(data);
};
