const Joi = require('@hapi/joi');

exports.createBoardValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  });

  return schema.validate(data);
};
