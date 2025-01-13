import { v4 } from 'uuid';
import { User } from '../../entities/user.entity';
import { AppDataSource } from '../../database/data-source';
import { BUSINESS_MESSAGE, ROLE } from '../../constants';
import { ApiResponseModel } from '../../utils/response.util';
import { Request, Response } from 'express';
import { In } from 'typeorm';

const register = async (req: Request, res: Response): Promise<any> => {
	const correlationId = v4();
	try {
		const { teacher, students } = req.body;

		const repository = AppDataSource.getRepository(User);

		const teacherEntity = await repository.findOneBy({
			email: teacher,
			role: ROLE.TEACHER,
		});

		if (teacherEntity === null)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_TEACHER,
				correlationId
			);

		const studentEntities = await repository.find({
			where: {
				role: ROLE.STUDENT,
				email: In(students),
			},
		});

		teacherEntity.students = studentEntities;

		await repository.save(teacherEntity);

		return ApiResponseModel.toSuccess(
			res,
			{
				success: true,
			},
			correlationId
		);
	} catch (error) {
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

const getCommonStudents = async (req: Request, res: Response): Promise<any> => {
	const correlationId = v4();

	const { teacher } = req.query;

	try {
		const teachers = Array.isArray(teacher) ? teacher : [teacher];

		const userRepository = AppDataSource.getRepository(User);

		const result = await userRepository
			.createQueryBuilder('teacher')
			.leftJoin('teacher.students', 'student')
			.where('teacher.role = :role', { role: ROLE.TEACHER })
			.andWhere('teacher.email IN (:...teachers)', { teachers })
			.select(['teacher.email', 'student.email'])
			.getMany();

		return ApiResponseModel.toSuccess(
			res,
			{
				students: mapTeacherEntitiesToStudentList(result),
			},
			correlationId
		);
	} catch (error) {
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

function mapTeacherEntitiesToStudentList(data: User[]) {
	if (data.length === 0) return [];

	const studentList = data.flatMap((teacher) =>
		teacher.students.map((student) => student.email)
	);

	return studentList;
}

const suspend = async (req: Request, res: Response): Promise<any> => {
	const correlationId = v4();
	try {
		const { student } = req.body;

		const userRepository = AppDataSource.getRepository(User);

		const studentEntity = await userRepository.findOne({
			where: {
				email: student,
				role: ROLE.STUDENT,
			},
		});

		if (studentEntity === null)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_STUDENT,
				correlationId
			);

		studentEntity.suspended = true;

		await userRepository.save(studentEntity);

		return ApiResponseModel.toSuccess(
			res,
			{
				studentId: student.id,
				suspended: studentEntity.suspended,
			},
			correlationId
		);
	} catch (error) {
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

export default { register, getCommonStudents, suspend };
