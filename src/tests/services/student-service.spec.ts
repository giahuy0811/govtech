import { In } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Student } from '../../entities/student.entity';
import { TeacherStudent } from '../../entities/teacher-student.entity';
import studentService from '../../services/student.service';

jest.mock('../../database/data-source', () => ({
	AppDataSource: {
		getRepository: jest.fn(),
	},
}));

describe('studentService', () => {
	const mockQueryBuilder = {
		leftJoin: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		getMany: jest.fn(),
	};

	const mockStudentRepository = {
		find: jest.fn(),
		findOneBy: jest.fn(),
		update: jest.fn(),
		createQueryBuilder: jest.fn(() => mockQueryBuilder),
	};

	const mockTeacherStudentRepository = {
		createQueryBuilder: jest.fn(),
	};

	beforeEach(() => {
		(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
			if (entity === Student) {
				return mockStudentRepository; // Mock for Student
			} else if (entity === TeacherStudent) {
				return mockTeacherStudentRepository; // Mock for TeacherStudent
			}
			return null;
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findStudentsByEmails', () => {
		it('should return students based on provided emails', async () => {
			const mockStudents = [
				{ id: 1, email: 'student1@example.com', name: 'Student One' },
				{ id: 2, email: 'student2@example.com', name: 'Student Two' },
			];

			mockStudentRepository.find.mockResolvedValue(mockStudents);

			const emails = ['student1@example.com', 'student2@example.com'];
			const result = await studentService.findStudentsByEmails(emails);

			expect(mockStudentRepository.find).toHaveBeenCalledWith({
				where: { email: In(emails) },
			});
			expect(result).toEqual(mockStudents);
		});
	});

	describe('getStudentsForTeachers', () => {
		it('should return students based on teacher ids', async () => {
			const mockTeacherStudents = [{ student_id: 1 }];
			mockTeacherStudentRepository.createQueryBuilder.mockReturnValue({
				leftJoin: jest.fn().mockReturnThis(),
				where: jest.fn().mockReturnThis(),
				groupBy: jest.fn().mockReturnThis(),
				having: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				getRawMany: jest.fn().mockResolvedValue(mockTeacherStudents),
			});

			mockStudentRepository.find.mockResolvedValue([
				{ id: 1, email: 'student1@example.com', name: 'Student One' },
			]);

			const teacherIds = [1];
			const result = await studentService.getStudentsForTeachers(teacherIds);

			expect(
				mockTeacherStudentRepository.createQueryBuilder
			).toHaveBeenCalled();
			expect(mockStudentRepository.find).toHaveBeenCalledWith({
				where: { id: In([1]) },
			});
			expect(result).toEqual(['student1@example.com']);
		});
	});

	describe('findByEmail', () => {
		it('should return a student if a matching email is found', async () => {
			const mockStudent = {
				id: 1,
				email: 'student@example.com',
				name: 'Student Name',
			};

			mockStudentRepository.findOneBy.mockResolvedValue(mockStudent);

			const result = await studentService.findByEmail('student@example.com');

			expect(mockStudentRepository.findOneBy).toHaveBeenCalledWith({
				email: 'student@example.com',
			});
			expect(result).toEqual(mockStudent);
		});

		it('should return null if no student is found', async () => {
			mockStudentRepository.findOneBy.mockResolvedValue(null);

			const result = await studentService.findByEmail(
				'nonexistent@example.com'
			);

			expect(mockStudentRepository.findOneBy).toHaveBeenCalledWith({
				email: 'nonexistent@example.com',
			});
			expect(result).toBeNull();
		});
	});

	describe('suspendStudent', () => {
		it('should suspend a student by ID', async () => {
			mockStudentRepository.update.mockResolvedValue(undefined);

			const studentId = 1;
			await studentService.suspendStudent(studentId);

			expect(mockStudentRepository.update).toHaveBeenCalledWith(
				{ id: studentId },
				{ suspended: true }
			);
		});
	});

	describe('getStudentsForNotification', () => {
		it('should return students based on teacherId and mentionedEmails', async () => {
			const mockStudents = [
				{ id: 1, email: 'student1@example.com', name: 'Student One' },
				{ id: 2, email: 'student2@example.com', name: 'Student Two' },
			];

			(mockStudentRepository.createQueryBuilder as jest.Mock).mockReturnValue({
				leftJoin: jest.fn().mockReturnThis(),
				where: jest.fn().mockReturnThis(),
				andWhere: jest.fn().mockReturnThis(),
				getMany: jest.fn().mockResolvedValue(mockStudents),
			});

			const teacherId = 1;
			const mentionedEmails = ['student1@example.com'];
			const result = await studentService.getStudentsForNotification(
				teacherId,
				mentionedEmails
			);

			expect(mockStudentRepository.createQueryBuilder).toHaveBeenCalled();
			expect(result).toEqual(['student1@example.com', 'student2@example.com']);
		});
	});
});
