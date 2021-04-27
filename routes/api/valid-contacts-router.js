/*
Module contains validation schemas 
for sending objects
*/

const Joi = require('joi')

const addContactSchema = Joi.object({
  name:
    Joi
      .string()
      .min(1)
      .max(50)
      .required(),

  email:
    Joi
      .string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ["com", "net"]
        },
      })
      .required(),

  phone:
    Joi
      .string()
      .min(10)
      .max(15)
      .pattern(/^[0-9]+$/)
      .required(),

  favorite:
    Joi
      .boolean()
      .default(false),
})

const updateContactSchema = Joi.object({
  name:
    Joi
      .string()
      .min(1)
      .max(50),

  email:
    Joi
      .string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ["com", "net"]
        },
      }),

  phone:
    Joi
      .string()
      .min(10)
      .max(15)
      .pattern(/^[0-9]+$/),

  favorite:
    Joi
      .boolean()
      .default(false),
})

const updateContactFavoriteStatusSchema = Joi.object({
  favorite:
    Joi
      .boolean()
      .default(false),
})

const validate = async (schema, contactObj, next) => {
  try {
    await schema.validateAsync(contactObj);
    return next();
  } catch (err) {
    next({ status: 400, message: err.message });
  }
}

module.exports = {
  addContactSchema: async (req, res, next) => {
    return await validate(addContactSchema, req.body, next);
  },
  updateContactSchema: async (req, res, next) => {
    return await validate(updateContactSchema, req.body, next);
  },
  updateContactFavoriteStatusSchema: async (req, res, next) => {
    return await validate(updateContactFavoriteStatusSchema, req.body, next);
  },
}
