import {
	JWT_SECRET,
	JWT_REFRESH_SECRET,
	JWT_ACCESS_TOKEN_EXPIRE,
	JWT_REFRESH_TOKEN_EXPIRE,
} from '../../constants';
import jwtService from '../../services/jwt.service';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Service', () => {
	const payload = { id: 1, role: 'teacher' };

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should generate an access token', () => {
		const mockSign = jwt.sign as jest.Mock;
		mockSign.mockReturnValue('mockAccessToken');

		const accessToken = jwtService.generateAccessToken(payload);

		expect(mockSign).toHaveBeenCalledWith(payload, JWT_SECRET, {
			expiresIn: JWT_ACCESS_TOKEN_EXPIRE,
		});
		expect(accessToken).toBe('mockAccessToken');
	});

	it('should generate a refresh token', () => {
		const mockSign = jwt.sign as jest.Mock;
		mockSign.mockReturnValue('mockRefreshToken');

		const refreshToken = jwtService.generateRefreshToken(payload);

		expect(mockSign).toHaveBeenCalledWith(payload, JWT_REFRESH_SECRET, {
			expiresIn: JWT_REFRESH_TOKEN_EXPIRE,
		});
		expect(refreshToken).toBe('mockRefreshToken');
	});

	it('should verify a token', () => {
		const mockVerify = jwt.verify as jest.Mock;
		mockVerify.mockReturnValue(payload);

		const token = 'mockToken';
		const verifiedPayload = jwtService.verifyToken(token);

		expect(mockVerify).toHaveBeenCalledWith(token, JWT_SECRET);
		expect(verifiedPayload).toEqual(payload);
	});

	it('should throw an error if the token is invalid during verification', () => {
		const mockVerify = jwt.verify as jest.Mock;
		mockVerify.mockImplementation(() => {
			throw new Error('Token is invalid');
		});

		const token = 'invalidToken';

		expect(() => jwtService.verifyToken(token)).toThrowError(
			'Token is invalid'
		);
	});
});
