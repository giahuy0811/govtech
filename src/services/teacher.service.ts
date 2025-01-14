import { In } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';
import { TeacherStudent } from '../entities/teacher-student.entity';

const findByEmail = async (email: string): Promise<Teacher | null> => {
	const repository = AppDataSource.getRepository(Teacher);
	const teacher = await repository.findOneBy({
		email,
	});

	return teacher;
};

const findByEmails = async (emails: string[]) => {
	const repository = AppDataSource.getRepository(Teacher);

	const teachers = await repository.find({
		where: {
			email: In(emails),
		},
	});

	return teachers;
};

const registerStudents = async (email: string, students: Student[]) => {
	const teacherStudentRepository = AppDataSource.getRepository(TeacherStudent);

	const teacher = await findByEmail(email);

	if (teacher === null) return false;

	const teacherStudents = students.map((student) => {
		const entity = new TeacherStudent();
		entity.teacher = teacher;
		entity.student = student;

		return entity;
	});

	await teacherStudentRepository.save(teacherStudents);

	return true;
};

export default { findByEmail, registerStudents, findByEmails };
