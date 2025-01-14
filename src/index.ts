import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { v4 } from 'uuid';
import swaggerUi from 'swagger-ui-express';
import apiOptions from './swagger';
import swaggerJSDoc from 'swagger-jsdoc';
import { EXPRESS_PORT, HTTP_STATUS_CODE, ROLE } from './constants';
import { AppDataSource } from './database/data-source';
import teacherRouter from './routes/teacher/teacher.route';
import authMiddleware from './middleware/auth.middleware';
import roleMiddleware from './middleware/role.middleware';
import { JoiError } from './types';
import seedRouter from './routes/seed/seed.route';

const app = express();
const swaggerSpec = swaggerJSDoc(apiOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: '*',
		methods: '*',
	})
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_: Request, res: Response) => {
	res.send('Govtech app');
});

app.use('/api/seed', seedRouter);
app.use('/api', authMiddleware, roleMiddleware([ROLE.TEACHER]), teacherRouter);

app.use((err: unknown, _: Request, res: Response, next: NextFunction): void => {
	const correlationId = v4();

	if (
		err &&
		typeof err === 'object' &&
		'error' in err &&
		(err as JoiError).error.isJoi
	) {
		const joiError = err as { error: { details: { message: string }[] } };
		const errorMessages = joiError.error.details.map(
			(detail) => detail.message
		);

		res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
			correlationId,
			error: errorMessages[0],
		});

		return;
	}

	next();
});

const startServer = async () => {
	AppDataSource.initialize().then(() => console.log('db connected'));
	app.listen(EXPRESS_PORT, () => {
		console.log(`Server is running on http://localhost:${EXPRESS_PORT}`);
	});
};

startServer().catch(console.error);
process.on('SIGINT', async () => {
	console.log('Shutting down...');
	process.exit(0);
});

export default app;
