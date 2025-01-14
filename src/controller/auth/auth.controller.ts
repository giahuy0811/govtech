import { Request, Response } from 'express';
import { User } from '../../entities/user.entity';
import { ApiResponseModel } from '../../utils/response.util';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwtService from '../../services/jwt.service';
import { BUSINESS_MESSAGE } from '../../constants';
import { AppDataSource } from '../../database/data-source';
import { ApiResponse, SignInResponse } from '../../types';

const signIn = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<SignInResponse>>> => {
	const correlationId = v4();
	try {
		const { email, password } = req.body;
		const userRepository = AppDataSource.getRepository(User);

		const user = await userRepository.findOneBy({ email });

		if (user === null)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_SIGN_IN
			);

		const isPasswordValid = bcrypt.compareSync(password, user.password);

		if (!isPasswordValid)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_SIGN_IN
			);

		const signTokenPayload = {
			id: user.id,
			role: user.role,
		};

		const refreshToken = jwtService.generateRefreshToken(signTokenPayload);

		// user.refreshToken = refreshToken;

		await userRepository.save(user);

		const accessToken = jwtService.generateAccessToken(signTokenPayload);

		return ApiResponseModel.toSuccess(res, {
			accessToken,
			refreshToken,
		});
	} catch (error) {
		console.log(error);
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

export default { signIn };
