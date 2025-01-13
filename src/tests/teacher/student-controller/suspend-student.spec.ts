import { Request, Response } from 'express';
import { AppDataSource } from '../../../database/data-source';
import { BUSINESS_MESSAGE, ROLE } from '../../../constants';
import studentController from '../../../controller/teacher/student.controller';
import { User } from '../../../entities/user.entity';
import { ApiResponseModel } from '../../../utils/response.util';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'test-correlation-id'),
}));

jest.mock('../../../utils/response.util');

describe('suspend', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockUserRepository: any;

	beforeEach(() => {
		mockRequest = {
			body: {
				student: 'student@example.com',
			},
		};

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		mockUserRepository = {
			findOne: jest.fn(),
			save: jest.fn(),
		};

		AppDataSource.getRepository = jest.fn().mockReturnValue(mockUserRepository);

		jest.clearAllMocks();
	});

	it('should successfully suspend a student', async () => {
		const mockStudent = {
			email: 'student@example.com',
			role: ROLE.STUDENT,
			suspended: false,
		};

		mockUserRepository.findOne.mockResolvedValue(mockStudent);
		mockUserRepository.save.mockResolvedValue({
			...mockStudent,
			suspended: true,
		});

		await studentController.suspend(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
		expect(mockUserRepository.findOne).toHaveBeenCalledWith({
			where: {
				email: 'student@example.com',
				role: ROLE.STUDENT,
			},
		});
		expect(mockUserRepository.save).toHaveBeenCalledWith({
			...mockStudent,
			suspended: true,
		});

		expect(ApiResponseModel.toSuccess).toHaveBeenCalledWith(
			mockResponse,
			{
				studentId: undefined,
				suspended: true,
			},
			'test-correlation-id'
		);
	});

	it('should return bad request if student is not found', async () => {
		mockUserRepository.findOne.mockResolvedValue(null);

		await studentController.suspend(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
		expect(mockUserRepository.findOne).toHaveBeenCalledWith({
			where: {
				email: 'student@example.com',
				role: ROLE.STUDENT,
			},
		});

		expect(ApiResponseModel.toBadRequest).toHaveBeenCalledWith(
			mockResponse,
			BUSINESS_MESSAGE.INVALID_STUDENT,
			'test-correlation-id'
		);
	});

	it('should handle internal server error', async () => {
		mockUserRepository.findOne.mockRejectedValue(new Error('Database error'));

		await studentController.suspend(
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
