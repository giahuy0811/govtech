import { Request } from 'express';
import { UserAuth } from '../constant';

declare module 'express-serve-static-core' {
	interface Request {
		user?: UserAuth;
	}
}
