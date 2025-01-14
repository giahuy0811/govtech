import { In } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Student } from '../entities/student.entity';

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

export default { findStudentsByEmails };
