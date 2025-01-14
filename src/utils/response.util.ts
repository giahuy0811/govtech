import { Response } from 'express';
import { BUSINESS_MESSAGE } from '../constants';

export class ApiResponseModel {
	static toSuccessNoResponse(res: Response): Response {
		return res.status(204).json();
	}

	static toSuccess<T>(res: Response, data: T): Response {
		return res.status(200).json(data);
	}

	static toBadRequest(res: Response, message: string): Response {
		return res.status(400).json({
			message,
		});
	}

	static toInternalServer(res: Response, correlationId: string): Response {
		return res.status(500).json({
			correlationId,
			message: BUSINESS_MESSAGE.INTERNAL_SERVER,
		});
	}
}
