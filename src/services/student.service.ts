import { In } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Student } from '../entities/student.entity';
import { TeacherStudent } from '../entities/teacher-student.entity';

const findStudentsByEmails = async (emails: string[]): Promise<Student[]> => {
	try {
		const repository = AppDataSource.getRepository(Student);

		const studentEntities = await repository.find({
			where: {
				email: In(emails),
			},
		});

		return studentEntities;
	} catch (error) {
		return [];
	}
};

async function getStudentsForTeachers(teacherIds: number[]) {
	const teacherStudentRepository = AppDataSource.getRepository(TeacherStudent);

	const students = await teacherStudentRepository
		.createQueryBuilder('teacherStudent')
		.leftJoin('teacherStudent.student', 'student')
		.leftJoin('teacherStudent.teacher', 'teacher')
		.where('teacher.id IN (:...teacherIds)', { teacherIds })
		.groupBy('student.id')
		.having('COUNT(DISTINCT teacher.id) = :teacherCount', {
			teacherCount: teacherIds.length,
		})
		.select('student.id')
		.getRawMany();

	const studentIds = students.map((student) => student.student_id);

	const studentRepository = AppDataSource.getRepository(Student);
	const studentEntities = await studentRepository.find({
		where: {
			id: In(studentIds),
		},
	});

	return mapStudentsToEmailList(studentEntities);
}

async function findByEmail(email: string): Promise<Student | null> {
	const repository = AppDataSource.getRepository(Student);

	const student = await repository.findOneBy({
		email,
	});

	return student;
}

async function suspendStudent(id: number) {
	const repository = AppDataSource.getRepository(Student);

	await repository.update(
		{
			id,
		},
		{
			suspended: true,
		}
	);
}

function mapStudentsToEmailList(studentEntities: Student[]) {
	if (studentEntities.length == 0) return [];

	return studentEntities.map((item) => item.email);
}

export default {
	findStudentsByEmails,
	getStudentsForTeachers,
	suspendStudent,
	findByEmail,
};
