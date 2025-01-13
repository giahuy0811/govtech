import { Request, Response } from 'express';
import { AppDataSource } from '../../../database/data-source';
import studentController from '../../../controller/teacher/student.controller';
import { BUSINESS_MESSAGE, ROLE } from '../../../constants';

jest.mock('../../../database/data-source');

describe('register', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let mockJson: jest.Mock;
	let mockStatus: jest.Mock;

	beforeEach(() => {
		mockJson = jest.fn();
		mockStatus = jest.fn().mockReturnValue({ json: mockJson });

		req = {
			body: {
				teacher: 'teacher@example.com',
				students: ['student1@example.com', 'student2@example.com'],
			},
		};

		res = {
			status: mockStatus,
		};

		jest.clearAllMocks();
	});

	it('should successfully register students to a teacher', async () => {
		const mockFindOneBy = jest.fn().mockResolvedValue({
			email: 'teacher@example.com',
			role: ROLE.TEACHER,
			students: [],
		});

		const mockFind = jest.fn().mockResolvedValue([
			{ email: 'student1@example.com', role: ROLE.STUDENT },
			{ email: 'student2@example.com', role: ROLE.STUDENT },
		]);

		const mockSave = jest.fn().mockResolvedValue(null);

		AppDataSource.getRepository = jest.fn().mockReturnValue({
			findOneBy: mockFindOneBy,
			find: mockFind,
			save: mockSave,
		});

		await studentController.register(req as Request, res as Response);

		expect(mockFindOneBy).toHaveBeenCalledWith({
			email: 'teacher@example.com',
			role: ROLE.TEACHER,
		});
		expect(mockFind).toHaveBeenCalledWith({
			where: {
				role: ROLE.STUDENT,
				email: expect.objectContaining({
					_type: 'in',
					_value: expect.arrayContaining([
						'student1@example.com',
						'student2@example.com',
					]),
				}),
			},
		});

		expect(mockSave).toHaveBeenCalled();

		expect(mockStatus).toHaveBeenCalledWith(200);
		expect(mockJson).toHaveBeenCalledWith({
			correlationId: expect.any(String),
			data: { success: true },
		});
	});

	it('should return bad request if teacher is not found', async () => {
		const mockFindOneBy = jest.fn().mockResolvedValue(null);

		AppDataSource.getRepository = jest.fn().mockReturnValue({
			findOneBy: mockFindOneBy,
		});

		await studentController.register(req as Request, res as Response);

		expect(mockFindOneBy).toHaveBeenCalledWith({
			email: 'teacher@example.com',
			role: ROLE.TEACHER,
		});
		expect(mockStatus).toHaveBeenCalledWith(400);
		expect(mockJson).toHaveBeenCalledWith({
			correlationId: expect.any(String),
			error: BUSINESS_MESSAGE.INVALID_TEACHER,
		});
	});

	it('should return bad request if no teacher is found', async () => {
		const mockFindOneBy = jest.fn().mockResolvedValue(null);
		const mockFind = jest.fn();
		const mockSave = jest.fn();

		AppDataSource.getRepository = jest.fn().mockReturnValue({
			findOneBy: mockFindOneBy,
			find: mockFind,
			save: mockSave,
		});

		const req = {
			body: {
				teacher: 'teacher@example.com',
				students: ['student@example.com'],
			},
		};

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await studentController.register(
			req as Request,
			res as unknown as Response
		);

		expect(mockFindOneBy).toHaveBeenCalledWith({
			email: 'teacher@example.com',
			role: ROLE.TEACHER,
		});

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			correlationId: expect.any(String),
			error: BUSINESS_MESSAGE.INVALID_TEACHER,
		});
	});

	it('should handle internal server errors gracefully', async () => {
		AppDataSource.getRepository = jest.fn(() => {
			throw new Error('Database error');
		});

		await studentController.register(req as Request, res as Response);

		expect(mockStatus).toHaveBeenCalledWith(500);
		expect(mockJson).toHaveBeenCalledWith({
			correlationId: expect.any(String),
			error: BUSINESS_MESSAGE.INTERNAL_SERVER,
		});
	});
});
