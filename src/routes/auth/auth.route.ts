import express from 'express';
import validation from 'express-joi-validation';
import { SignInSchema } from '../../validation/auth/auth.validation';
import authController from '../../controller/auth/auth.controller';
import asyncHandlerMiddleware from '../../middleware/async-handler.middleware';

const validator = validation.createValidator({
	passError: true,
});

const authRouter = express.Router();

authRouter.post(
	'/sign-in',
	validator.body(SignInSchema),
	asyncHandlerMiddleware(authController.signIn)
);

export default authRouter;
