import { AppDataSource } from '../../database/data-source';
import bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ROLE } from '../../constants';
import { ApiResponseModel } from '../../utils/response.util';

const seed = async (req: Request, res: Response): Promise<any> => {
	const correlationId = v4();
	try {
		const repository = AppDataSource.getRepository(User);
		const users = [
			{
				name: 'Ken',
				email: 'teacherken@gmail.com',
				password: '123456@Aa',
				role: ROLE.TEACHER,
			},
			{
				name: 'Jon',
				email: 'studentjon@gmail.com',
				password: '123456@Aa',
				role: ROLE.STUDENT,
			},
			{
				name: 'Hon',
				email: 'studenthon@gmail.com',
				password: '123456@Aa',
				role: ROLE.STUDENT,
			},
		];

		for (const user of users) {
			const hashedPassword = await bcrypt.hash(user.password, 10);

			const userEntity = repository.create({
				...user,
				password: hashedPassword,
			});

			await repository.save(userEntity);
		}

		return ApiResponseModel.toSuccess(res, { success: true }, correlationId);
	} catch (error) {
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

export default { seed };
