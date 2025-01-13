import Joi from 'joi';

export const RegisterStudentSchema = Joi.object({
	teacher: Joi.string().email().required().messages({
		'string.base': 'teacher should be a type of string',
		'string.email': 'teacher should be a type of email',
		'string.empty': 'teacher cannot be empty',
		'any.required': 'teacher is required',
	}),
	students: Joi.array().items(Joi.string().email()).required().messages({
		'array.base': 'students should be a type of array',
		'array.empty': 'students cannot be empty',
		'any.required': 'students is required',
	}),
});

export const SuspendStudentSchema = Joi.object({
	student: Joi.string().email().required().messages({
		'string.base': 'student should be a type of string',
		'string.email': 'student should be a type of email',
		'string.empty': 'student cannot be empty',
		'any.required': 'student is required',
	}),
});

export const GetNotificationReceipentsSchema = Joi.object({
	teacher: Joi.string().email().required().messages({
		'string.base': 'teacher should be a type of string',
		'string.email': 'teacher should be a type of email',
		'string.empty': 'teacher cannot be empty',
		'any.required': 'teacher is required',
	}),
	notification: Joi.string().required().messages({
		'string.base': 'notification should be a type of string',
		'string.empty': 'notification cannot be empty',
		'any.required': 'notification is required',
	}),
});

export const GetCommonStudentsSchema = Joi.object({
	teacher: Joi.string().email().required().messages({
		'string.base': 'teacher should be a type of string',
		'string.email': 'teacher should be a type of email',
		'string.empty': 'teacher cannot be empty',
		'any.required': 'teacher is required',
	}),
});
