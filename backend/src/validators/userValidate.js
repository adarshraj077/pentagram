import Joi from "joi";

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  email: Joi.string()
    .email()
    .pattern(/@gmail\.com$/)
    .min(11)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid @gmail.com address.",
    }),

  password: Joi.string().min(8).max(60).required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/@gmail\.com$/)
    .min(11)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid @gmail.com address.",
    }),

  password: Joi.string().min(8).max(60).required(),
});

export { signupSchema, loginSchema };
