import { AppDataSource } from '../../database/data-source';
import bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ROLE } from '../../constants';
import { ApiResponseModel } from '../../utils/response.util';
import { ApiResponse } from '../../types';

const seed = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<{ success: true }>>> => {
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

		const hashedUsers = await Promise.all(
			users.map(async (user) => {
				const hashedPassword = await bcrypt.hash(user.password, 10);
				return {
					...user,
					password: hashedPassword,
				};
			})
		);
		
		const userEntities = repository.create(hashedUsers);
		await repository.save(userEntities);

		return ApiResponseModel.toSuccess(res, { success: true }, correlationId);
	} catch (error) {
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

export default { seed };
