const Joi = require('@hapi/joi');

exports.createListValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    boardID: Joi.string().required(),
  });

  return schema.validate(data);
};

exports.updateListValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
  });

  return schema.validate(data);
};
