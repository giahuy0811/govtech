import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { v4 } from 'uuid';
import { EXPRESS_PORT, HTTP_STATUS_CODE } from './constants';
import authRouter from './routes/auth/auth.route';
import seedRouter from './routes/seed/seed.route';
import { AppDataSource } from './database/data-source';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: '*',
		methods: '*',
	})
);
app.get('/', (_: Request, res: Response) => {
	res.send('Govtech app');
});

app.use('/api/auth', authRouter);
app.use('/api/seed', seedRouter);

app.use((err: any, _: Request, res: Response, next: NextFunction): any => {
	const correlationId = v4();
	if (err && err.error && err.error.isJoi) {
		const errorMessages = err.error.details.map(
			(detail: any) => detail.message
		);

		return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
			correlationId,
			error: errorMessages[0],
		});
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
