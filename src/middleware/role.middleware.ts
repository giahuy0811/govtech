import { Request, Response, NextFunction } from 'express';
import { BUSINESS_MESSAGE, HTTP_STATUS_CODE } from '../constants';
import { v4 } from 'uuid';
const roleMiddleware = (roles: string[]): any => {
	return (req: Request, res: Response, next: NextFunction) => {
		const correlationId = v4();

		try {
			if (!roles.includes(req.user!.role))
				return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
					correlationId,
					error: BUSINESS_MESSAGE.FORBIDDEN,
				});

			next();
		} catch (error) {
			return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
				correlationId,
				error: BUSINESS_MESSAGE.FORBIDDEN,
			});
		}
	};
};

export default roleMiddleware;
