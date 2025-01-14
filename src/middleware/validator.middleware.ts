import validation from 'express-joi-validation';

export const validator = validation.createValidator({
	passError: true,
});
