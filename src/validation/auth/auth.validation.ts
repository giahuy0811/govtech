import Joi from 'joi';

export const SignInSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'string.base': 'email should be a type of text',
		'string.empty': 'email cannot be empty',
		'string.length': 'email should have at least 10 characters',
		'any.required': 'email is required',
	}),
	password: Joi.string().min(6).max(20).required().messages({
		'string.base': 'password should be a type of text',
		'string.empty': 'password cannot be empty',
		'string.min': 'password should have at least 6 characters',
		'string.max': 'password should have max 20 characters',
		'any.required': 'password is required',
	}),
});
