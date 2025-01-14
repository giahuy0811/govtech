import { Request, Response } from 'express';
import { AppDataSource } from '../../database/data-source';
import { ApiResponseModel } from '../../utils/response.util';
import jwtService from '../../services/jwt.service';
import bcrypt from 'bcrypt';
import { BUSINESS_MESSAGE } from '../../constants';
import { v4 } from 'uuid';
import authController from '../../controller/auth/auth.controller';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

jest.mock('../../database/data-source');
jest.mock('../../utils/response.util');
jest.mock('../../services/jwt.service');
jest.mock('bcrypt');
jest.mock('uuid', () => ({ v4: jest.fn() }));

let userRepository: jest.Mocked<Partial<Repository<User>>>;
describe('signIn', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	beforeEach(() => {
		mockRequest = {
			body: {
				email: 'test@example.com',
				password: 'password123',
			},
		};

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		userRepository = {
			findOneBy: jest.fn() as jest.MockedFunction<
      (where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) => Promise<User | null>
    >,
			save: jest.fn(),
		};
	

		userRepository = userRepository as jest.Mocked<Repository<User>>;

		(AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepository);
		(v4 as jest.Mock).mockReturnValue('mocked-correlation-id');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return bad request if user is not found', async () => {
		(userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

		await authController.signIn(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(ApiResponseModel.toBadRequest).toHaveBeenCalledWith(
			mockResponse,
			BUSINESS_MESSAGE.INVALID_SIGN_IN,
			'mocked-correlation-id'
		);
	});

	it('should return bad request if password is invalid', async () => {
		(userRepository.findOneBy as jest.Mock).mockResolvedValue({
			email: 'test@example.com',
			password: 'hashedpassword',
		});
		(bcrypt.compareSync as jest.Mock).mockReturnValue(false);

		await authController.signIn(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(ApiResponseModel.toBadRequest).toHaveBeenCalledWith(
			mockResponse,
			BUSINESS_MESSAGE.INVALID_SIGN_IN,
			'mocked-correlation-id'
		);
	});

	it('should return success with accessToken and refreshToken if sign-in is valid', async () => {
		const user = {
			id: 1,
			email: 'test@example.com',
			password: 'hashedpassword',
			role: 'user',
			refreshToken: '',
		};

		(userRepository.findOneBy as jest.Mock).mockResolvedValue(user);
		(bcrypt.compareSync as jest.Mock).mockReturnValue(true);
		(jwtService.generateAccessToken as jest.Mock).mockReturnValue(
			'mocked-access-token'
		);
		(jwtService.generateRefreshToken as jest.Mock).mockReturnValue(
			'mocked-refresh-token'
		);

		await authController.signIn(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(userRepository.save).toHaveBeenCalledWith({
			...user,
			refreshToken: 'mocked-refresh-token',
		});
		expect(ApiResponseModel.toSuccess).toHaveBeenCalledWith(
			mockResponse,
			{
				accessToken: 'mocked-access-token',
				refreshToken: 'mocked-refresh-token',
			},
			'mocked-correlation-id'
		);
	});

	it('should handle internal server error gracefully', async () => {
		(userRepository.findOneBy as jest.Mock).mockRejectedValue(new Error('Database error'));

		await authController.signIn(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(ApiResponseModel.toInternalServer).toHaveBeenCalledWith(
			mockResponse,
			'mocked-correlation-id'
		);
	});
});
