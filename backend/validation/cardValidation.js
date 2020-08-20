const Joi = require('@hapi/joi');

exports.createCardValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    listID: Joi.string().required(),
    boardID: Joi.string().required(),
  });

  return schema.validate(data);
};

exports.updateCardValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    listID: Joi.string(),
  });

  return schema.validate(data);
};
