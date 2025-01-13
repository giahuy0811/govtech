import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../../../database/data-source';
import studentController from '../../../controller/teacher/student.controller';
import { User } from '../../../entities/user.entity';
import { BUSINESS_MESSAGE, ROLE } from '../../../constants';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'test-correlation-id') }));

describe('getCommonStudents', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockUserRepository: any;

	beforeEach(() => {
		mockRequest = {
			query: {
				teacher: ['teacher1@example.com', 'teacher2@example.com'],
			},
		};

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const mockQueryBuilder = {
			leftJoin: jest.fn().mockReturnThis(),
			where: jest.fn().mockReturnThis(),
			andWhere: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			getMany: jest.fn(),
		};

		mockUserRepository = {
			createQueryBuilder: jest.fn(() => mockQueryBuilder),
		};

		AppDataSource.getRepository = jest.fn().mockReturnValue(mockUserRepository);
	});

	it('should return a list of unique students successfully', async () => {
		const mockData = [
			{
				email: 'teacher1@example.com',
				students: [
					{ email: 'student1@example.com' },
					{ email: 'student2@example.com' },
				],
			},
			{
				email: 'teacher2@example.com',
				students: [
					{ email: 'student2@example.com' },
					{ email: 'student3@example.com' },
				],
			},
		];

		mockUserRepository.createQueryBuilder().getMany.mockResolvedValue(mockData);

		await studentController.getCommonStudents(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
		expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith(
			'teacher'
		);
		expect(
			mockUserRepository.createQueryBuilder().leftJoin
		).toHaveBeenCalledWith('teacher.students', 'student');
		expect(mockUserRepository.createQueryBuilder().where).toHaveBeenCalledWith(
			'teacher.role = :role',
			{ role: ROLE.TEACHER }
		);
		expect(
			mockUserRepository.createQueryBuilder().andWhere
		).toHaveBeenCalledWith('teacher.email IN (:...teachers)', {
			teachers: ['teacher1@example.com', 'teacher2@example.com'],
		});
		expect(mockUserRepository.createQueryBuilder().select).toHaveBeenCalledWith(
			['teacher.email', 'student.email']
		);
		expect(mockUserRepository.createQueryBuilder().getMany).toHaveBeenCalled();

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({
			correlationId: 'test-correlation-id',
			data: {
				students: [
					'student1@example.com',
					'student2@example.com',
					'student3@example.com',
				],
			},
		});
	});

	it('should return an empty student list if no students are found', async () => {
		mockUserRepository.createQueryBuilder().getMany.mockResolvedValue([]);

		await studentController.getCommonStudents(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({
			correlationId: 'test-correlation-id',
			data: {
				students: [],
			},
		});
	});

	it('should handle errors and return internal server error', async () => {
		mockUserRepository
			.createQueryBuilder()
			.getMany.mockRejectedValue(new Error('Database error'));

		await studentController.getCommonStudents(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			correlationId: 'test-correlation-id',
			error: BUSINESS_MESSAGE.INTERNAL_SERVER,
		});
	});
});
