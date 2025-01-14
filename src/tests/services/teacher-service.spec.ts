import { In } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Teacher } from '../../entities/teacher.entity';
import { TeacherStudent } from '../../entities/teacher-student.entity';
import teacherService from '../../services/teacher.service';
import { Student } from '../../entities/student.entity';

jest.mock('../../database/data-source', () => ({
	AppDataSource: {
		getRepository: jest.fn(),
	},
}));

describe('teacherService', () => {
	const mockTeacherRepository = {
		findOneBy: jest.fn(),
		find: jest.fn(),
	};

	const mockTeacherStudentRepository = {
		save: jest.fn(),
	};

	beforeEach(() => {
		(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
			if (entity === Teacher) {
				return mockTeacherRepository;
			} else if (entity === TeacherStudent) {
				return mockTeacherStudentRepository;
			}
			return null;
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findByEmail', () => {
		it('should return a teacher if found by email', async () => {
			const mockTeacher = {
				id: 1,
				email: 'teacher@example.com',
				name: 'Teacher One',
			};

			mockTeacherRepository.findOneBy.mockResolvedValue(mockTeacher);

			const result = await teacherService.findByEmail('teacher@example.com');

			expect(mockTeacherRepository.findOneBy).toHaveBeenCalledWith({
				email: 'teacher@example.com',
			});
			expect(result).toEqual(mockTeacher);
		});

		it('should return null if no teacher is found by email', async () => {
			mockTeacherRepository.findOneBy.mockResolvedValue(null);

			const result = await teacherService.findByEmail(
				'nonexistent@example.com'
			);

			expect(mockTeacherRepository.findOneBy).toHaveBeenCalledWith({
				email: 'nonexistent@example.com',
			});
			expect(result).toBeNull();
		});
	});

	describe('findByEmails', () => {
		it('should return multiple teachers for the given emails', async () => {
			const mockTeachers = [
				{ id: 1, email: 'teacher1@example.com', name: 'Teacher One' },
				{ id: 2, email: 'teacher2@example.com', name: 'Teacher Two' },
			];

			mockTeacherRepository.find.mockResolvedValue(mockTeachers);

			const result = await teacherService.findByEmails([
				'teacher1@example.com',
				'teacher2@example.com',
			]);

			expect(mockTeacherRepository.find).toHaveBeenCalledWith({
				where: { email: In(['teacher1@example.com', 'teacher2@example.com']) },
			});
			expect(result).toEqual(mockTeachers);
		});
	});

	describe('registerStudents', () => {
		it('should register students for the given teacher', async () => {
			const teacher: Teacher = {
				id: 1,
				name: 'Teacher One',
				email: 'teacher@example.com',
			} as Teacher;
			const students: Student[] = [
				{
					id: 1,
					name: 'Student One',
					email: 'student1@example.com',
				} as Student,
				{
					id: 2,
					name: 'Student Two',
					email: 'student2@example.com',
				} as Student,
			];

			await teacherService.registerStudents(teacher, students);

			expect(mockTeacherStudentRepository.save).toHaveBeenCalledWith([
				expect.objectContaining({ teacher, student: students[0] }),
				expect.objectContaining({ teacher, student: students[1] }),
			]);
			expect(mockTeacherStudentRepository.save).toHaveBeenCalledTimes(1);
		});
	});
});
