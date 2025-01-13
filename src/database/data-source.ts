import path from 'path';
import { DataSource } from 'typeorm';
import { DATABASE } from '../constants';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: DATABASE.DB_HOST,
	port: DATABASE.DB_PORT,
	username: DATABASE.DB_USERNAME,
	password: DATABASE.DB_PASS,
	database: DATABASE.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [path.join(__dirname + '/../entities/*.entity.{js,ts}')],
	migrations: [path.join(__dirname + '/../migrations/*.{js,ts}')],
	subscribers: [],
});
