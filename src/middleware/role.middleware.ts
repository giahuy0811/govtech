import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BUSINESS_MESSAGE, HTTP_STATUS_CODE } from '../constants';
import { v4 } from 'uuid';
const roleMiddleware = (roles: string[]): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const correlationId = v4();

		try {
			if (!roles.includes(req.user!.role)) {
				res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
					correlationId,
					error: BUSINESS_MESSAGE.FORBIDDEN,
				});
				return;
			}

			next();
		} catch (error) {
			console.log(error);
			res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
				correlationId,
				error: BUSINESS_MESSAGE.FORBIDDEN,
			});
			return;
		}
	};
};

export default roleMiddleware;
