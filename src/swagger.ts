import { SwaggerDefinition } from 'swagger-jsdoc';
import { SwaggerOptions } from 'swagger-ui-express';

const swaggerDefinition: SwaggerDefinition = {
	openapi: '3.1.0',
	info: {
		title: 'API Documents Govtech app',
		version: '1.0.0',
	},
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
	},
};

const apiOptions: SwaggerOptions = {
	swaggerDefinition,
	apis: ['./src/routes/**/*.route.ts', './dist/routes/**/*.route.js'],
};

export default apiOptions;
