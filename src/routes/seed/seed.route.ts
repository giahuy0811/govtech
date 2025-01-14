import express from 'express';
import asyncHandlerMiddleware from '../../middleware/async-handler.middleware';
import seedController from '../../controller/seed/seed.controller';

const seedRouter = express.Router();

seedRouter.post('/', asyncHandlerMiddleware(seedController.seed));

export default seedRouter;
