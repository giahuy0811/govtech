import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

const asyncHandlerMiddleware = (
	handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await handler(req, res, next);

			if (result !== undefined && !res.headersSent) {
				res.json(result);
			}
		} catch (error) {
			next(error);
		}
	});

export default asyncHandlerMiddleware;
