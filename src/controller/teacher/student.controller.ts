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

export default { register };
