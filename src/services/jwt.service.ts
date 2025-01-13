import * as jwtService from 'jsonwebtoken';
import {
	JWT_ACCESS_TOKEN_EXPIRE,
	JWT_REFRESH_SECRET,
	JWT_REFRESH_TOKEN_EXPIRE,
	JWT_SECRET,
	UserAuth,
} from '../constants';

const generateAccessToken = (payload: any) =>
	jwtService.sign(payload, JWT_SECRET!, {
		expiresIn: JWT_ACCESS_TOKEN_EXPIRE,
	});

const generateRefreshToken = (payload: any) =>
	jwtService.sign(payload, JWT_REFRESH_SECRET!, {
		expiresIn: JWT_REFRESH_TOKEN_EXPIRE,
	});

const verifyToken = (token: string): UserAuth =>
	jwtService.verify(token, JWT_SECRET!) as UserAuth;

export default { generateAccessToken, generateRefreshToken, verifyToken };
