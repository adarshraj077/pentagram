import Joi from "joi";

const createBlogSchema = Joi.object({
  title: Joi.string().min(1).max(30).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 30 characters.",
    "any.required": "Title is required.",
  }),

  content: Joi.string().min(1).max(200).required().messages({
    "string.min": "Content must be at least 1 character long.",
    "string.max": "Content cannot exceed 200 characters.",
    "any.required": "Content is required.",
  }),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().min(1).max(30),
  content: Joi.string().min(1).max(200),
});
export { createBlogSchema, updateBlogSchema };
