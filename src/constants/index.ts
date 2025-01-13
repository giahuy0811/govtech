import dotenv from 'dotenv';
dotenv.config();

export const EXPRESS_PORT = process.env.EXPRESS_PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRE = '1d';
export const JWT_REFRESH_TOKEN_EXPIRE = '2d';

export const DATABASE = {
	DB_HOST: process.env.DB_HOST,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASS: process.env.DB_PASS,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: Number(process.env.DB_PORT) || 3306,
};

export type UserAuth = {
	id: string;
	role: string;
	email: string;
};

export enum HTTP_STATUS_CODE {
	SUCCESS = 204,
	BAD_REQUEST = 400,
	UNAUTHORZIED = 401,
	FORBIDDEN = 403,
	INTERNAL_SERVER = 500,
}

export enum HTTP_METHODS {
	POST = 'POST',
	GET = 'GET',
	PUT = 'PUT',
	DELETE = 'DELETE',
}

export enum ROLE {
	TEACHER = 'teacher',
	STUDENT = 'student',
}

export enum BUSINESS_MESSAGE {
	UNAUTHORZIED = 'unauthorzied',
	INTERNAL_SERVER = 'internalServer',
	INVALID_SIGN_IN = 'invalidEmailOrPassword',
	INVALID_EMAIL = 'invalidEmail',
	INVALID_PASSWORD = 'invalidEmail',
	FORBIDDEN = 'forbidden',
	INVALID_TEACHER = 'invalidTeacher',
	INVALID_STUDENT = 'invalidSTUDENT',
}
