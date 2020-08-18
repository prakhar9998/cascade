const Joi = require('@hapi/joi');

exports.createBoardValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  });

  return schema.validate(data);
};

exports.updateBoardValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
  });

  return schema.validate(data);
};
