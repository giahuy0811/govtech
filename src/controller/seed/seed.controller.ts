import { AppDataSource } from '../../database/data-source';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ApiResponseModel } from '../../utils/response.util';
import { Teacher } from '../../entities/teacher.entity';
import { Student } from '../../entities/student.entity';
import teachers from '../../data/teachers.json';
import students from '../../data/students.json';

const seed = async (_: Request, res: Response): Promise<Response> => {
	try {
		const teacherRepository = AppDataSource.getRepository(Teacher);

		const teacherPromises = teachers.map(async (teacher) => {
			const hashedPassword = await bcrypt.hash(teacher.password, 10);
			return teacherRepository.create({
				...teacher,
				password: hashedPassword,
			});
		});

		const teacherEntities = await Promise.all(teacherPromises);
		await teacherRepository.save(teacherEntities);

		const studentRepository = AppDataSource.getRepository(Student);

		const studentPromises = students.map(async (student) => {
			const hashedPassword = await bcrypt.hash(student.password, 10);
			return studentRepository.create({
				...student,
				password: hashedPassword,
			});
		});

		const studentEntities = await Promise.all(studentPromises);
		await studentRepository.save(studentEntities);

		return ApiResponseModel.toSuccessNoResponse(res);
	} catch (error) {
		console.log(error);
		return ApiResponseModel.toInternalServer(res);
	}
};

export default { seed };
