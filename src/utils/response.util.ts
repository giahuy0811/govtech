import { Response } from 'express';
import { BUSINESS_MESSAGE } from '../constants';

export class ApiResponseModel {
	static toSuccess<T>(res: Response, data: T, correlationId: string): Response {
		return res.status(200).json({
			correlationId,
			data,
		});
	}

	static toBadRequest(
		res: Response,
		error: string,
		correlationId: string
	): Response {
		return res.status(400).json({
			correlationId,
			error,
		});
	}

	static toInternalServer(res: Response, correlationId: string): Response {
		return res.status(500).json({
			correlationId,
			error: BUSINESS_MESSAGE.INTERNAL_SERVER,
		});
	}
}
