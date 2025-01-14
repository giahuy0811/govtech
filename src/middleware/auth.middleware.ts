import { Response, NextFunction, Request } from 'express';
import { v4 } from 'uuid';
import { BUSINESS_MESSAGE, HTTP_STATUS_CODE, UserAuth } from '../constants';
import jwtService from '../services/jwt.service';

const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const correlationId = v4();
	const token = req.header('Authorization')?.split(' ')[1];

	if (!token) {
		res.status(HTTP_STATUS_CODE.UNAUTHORZIED).json({
			correlationId,
			error: BUSINESS_MESSAGE.UNAUTHORZIED,
		});

		return;
	}

	try {
		const userAuth = jwtService.verifyToken(token);

		req.user = userAuth as UserAuth;

		next();
	} catch (error) {
		console.log(error);
		res.status(HTTP_STATUS_CODE.UNAUTHORZIED).json({
			correlationId,
			error: BUSINESS_MESSAGE.UNAUTHORZIED,
		});
	}
};

export default authMiddleware;
