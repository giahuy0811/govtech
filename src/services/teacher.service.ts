import { In } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';
import { TeacherStudent } from '../entities/teacher-student.entity';

async function findByEmail(email: string): Promise<Teacher | null> {
	const repository = AppDataSource.getRepository(Teacher);
	const teacher = await repository.findOneBy({
		email,
	});

	return teacher;
}

async function findByEmails(emails: string[]) {
	const repository = AppDataSource.getRepository(Teacher);

	const teachers = await repository.find({
		where: {
			email: In(emails),
		},
	});

	return teachers;
}

async function registerStudents(teacherEntity: Teacher, students: Student[]) {
	const teacherStudentRepository = AppDataSource.getRepository(TeacherStudent);

	const teacherStudents = students.map((student) => {
		const entity = new TeacherStudent();
		entity.teacher = teacherEntity;
		entity.student = student;

		return entity;
	});

	await teacherStudentRepository.save(teacherStudents);
}

export default { findByEmail, registerStudents, findByEmails };
