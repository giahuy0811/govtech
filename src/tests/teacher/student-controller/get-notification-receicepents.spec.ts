import { Request, Response } from 'express';
import { AppDataSource } from '../../../database/data-source';
import studentController from '../../../controller/teacher/student.controller';
import { ApiResponseModel } from '../../../utils/response.util';
import { User } from '../../../entities/user.entity';
import { BUSINESS_MESSAGE } from '../../../constants';
import { In } from 'typeorm';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'test-correlation-id'),
}));

jest.mock('../../../utils/response.util');

describe('getNotificationReceipents', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockUserRepository: any;

	beforeEach(() => {
		mockRequest = {
			body: {
				teacher: 'teacher@example.com',
				notification: 'Hello @student1@example.com and @student2@example.com',
			},
		};

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		mockUserRepository = {
			findOne: jest.fn(),
			find: jest.fn(),
		};

		jest
			.spyOn(studentController, 'extractEmailsFromString')
			.mockReturnValue(['student2@example.com', 'student3@example.com']);
		AppDataSource.getRepository = jest.fn().mockReturnValue(mockUserRepository);
		jest.clearAllMocks();
	});

	it('should return bad request if the teacher is not found', async () => {
		mockUserRepository.findOne.mockResolvedValue(null);

		await studentController.getNotificationReceipents(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
		expect(mockUserRepository.findOne).toHaveBeenCalledWith({
			where: { email: 'teacher@example.com' },
			relations: ['students'],
		});

		expect(ApiResponseModel.toBadRequest).toHaveBeenCalledWith(
			mockResponse,
			BUSINESS_MESSAGE.INVALID_TEACHER,
			'test-correlation-id'
		);
	});

	it('should handle internal server errors', async () => {
		mockUserRepository.findOne.mockRejectedValue(new Error('Database error'));

		await studentController.getNotificationReceipents(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
		expect(ApiResponseModel.toInternalServer).toHaveBeenCalledWith(
			mockResponse,
			'test-correlation-id'
		);
	});
});
