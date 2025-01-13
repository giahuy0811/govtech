import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import validation from 'express-joi-validation';
import { SignInSchema } from '../../validation/auth/auth.validation';
import authController from '../../controller/auth/auth.controller';

const validator = validation.createValidator({
	passError: true,
});

const authRouter = express.Router();

authRouter.post(
	'/sign-in',
	validator.body(SignInSchema),
	expressAsyncHandler(authController.signIn)
);

export default authRouter;
