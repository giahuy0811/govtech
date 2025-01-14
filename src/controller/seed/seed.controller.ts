import { AppDataSource } from '../../database/data-source';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ApiResponseModel } from '../../utils/response.util';
import { Teacher } from '../../entities/teacher.entity';
import { Student } from '../../entities/student.entity';

const seed = async (req: Request, res: Response): Promise<any> => {
	const correlationId = v4();
	try {
		const teacherRepository = AppDataSource.getRepository(Teacher);
		const teachers = [
			{
				name: 'Ken',
				email: 'teacherken@gmail.com',
				password: '123456@Aa',
			},
		];

		for (const teacher of teachers) {
			const hashedPassword = await bcrypt.hash(teacher.password, 10);

			const userEntity = teacherRepository.create({
				...teacher,
				password: hashedPassword,
			});

			await teacherRepository.save(userEntity);
		}

		const studentRepository = AppDataSource.getRepository(Student);
		const students = [
			{
				name: 'Jon',
				email: 'studentjon@gmail.com',
				password: '123456@Aa',
			},
			{
				name: 'Hon',
				email: 'studenthon@gmail.com',
				password: '123456@Aa',
			},
			{
				name: 'Student1',
				email: 'commonstudent1@gmail.com',
				password: '123456@Aa',
			},
      {
				name: 'Student1',
				email: 'commonstudent2@gmail.com',
				password: '123456@Aa',
			},
			{
				name: 'Student Only',
				email: 'student_only_under_teacher_ken@gmail.com',
				password: '123456@Aa',
			},
			{
				name: 'Mary',
				email: 'studentmary@gmail.com',
				password: '123456@Aa',
			},
		];

		for (const student of students) {
			const hashedPassword = await bcrypt.hash(student.password, 10);

			const studentEntity = studentRepository.create({
				...student,
				password: hashedPassword,
			});

			await studentRepository.save(studentEntity);
		}

		return ApiResponseModel.toSuccess(res, { success: true }, correlationId);
	} catch (error) {
    console.log(error)
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

export default { seed };
