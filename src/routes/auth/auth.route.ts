import express from 'express';
import { SignInSchema } from '../../validation/auth/auth.validation';
import authController from '../../controller/auth/auth.controller';
import asyncHandlerMiddleware from '../../middleware/async-handler.middleware';
import { validator } from '../../middleware/validator.middleware';

const authRouter = express.Router();

authRouter.post(
	'/sign-in',
	validator.body(SignInSchema),
	asyncHandlerMiddleware(authController.signIn)
);

export default authRouter;
