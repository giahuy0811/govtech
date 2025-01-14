import { AppDataSource } from '../database/data-source';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';

const findByEmail = async (email: string): Promise<Teacher | null> => {
	try {
		const repository = AppDataSource.getRepository(Teacher);
		const teacher = await repository.findOneBy({
			email,
		});

		return teacher;
	} catch (error) {
		return null;
	}
};

const registerStudents = async (email: string, students: Student[]) => {
	const repository = AppDataSource.getRepository(Teacher);
	const teacher = await repository.findOneBy({
		email,
	});

	if (!teacher) return false;

	teacher.students = students;

	await repository.save(teacher);

	return true;
};

export default { findByEmail, registerStudents };
