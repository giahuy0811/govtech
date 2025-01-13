import dotenv from 'dotenv';
dotenv.config();

export const EXPRESS_PORT = process.env.EXPRESS_PORT;


export enum HTTP_STATUS_CODE {
	SUCCESS = 200,
	BAD_REQUEST = 400,
	UNAUTHORZIED = 401,
	FORBIDDEN = 403,
	INTERNAL_SERVER = 500,
}
