import { Request, Response } from 'express';
import { AppDataSource } from '../../../database/data-source';
import studentController from '../../../controller/teacher/student.controller';
import { User } from '../../../entities/user.entity';
import { BUSINESS_MESSAGE, ROLE } from '../../../constants';
import { Repository } from 'typeorm';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'test-correlation-id') }));

describe('getCommonStudents', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockUserRepository: jest.Mocked<Repository<User>>;

	const mockQueryBuilder = {
		leftJoin: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		getMany: jest.fn(),
	};

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

		mockUserRepository = {
			createQueryBuilder: jest.fn(() => mockQueryBuilder),
		} as unknown as jest.Mocked<Repository<User>>;

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

		(
			mockUserRepository.createQueryBuilder().getMany as jest.Mock
		).mockResolvedValue(mockData);

		await studentController.getCommonStudents(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(AppDataSource.getRepository).toHaveBeenCalledWith(User);
		expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith(
			'teacher'
		);
		expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
			'teacher.students',
			'student'
		);
		expect(mockQueryBuilder.where).toHaveBeenCalledWith(
			'teacher.role = :role',
			{ role: ROLE.TEACHER }
		);
		expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
			'teacher.email IN (:...teachers)',
			{ teachers: ['teacher1@example.com', 'teacher2@example.com'] }
		);
		expect(mockQueryBuilder.select).toHaveBeenCalledWith([
			'teacher.email',
			'student.email',
		]);
		expect(mockQueryBuilder.getMany).toHaveBeenCalled();

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
		(
			mockUserRepository.createQueryBuilder().getMany as jest.Mock
		).mockResolvedValue([]);

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
		(
			mockUserRepository.createQueryBuilder().getMany as jest.Mock
		).mockRejectedValue(new Error('Database error'));

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
