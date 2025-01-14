import express from 'express';
import seedController from '../../controller/seed/seed.controller';
import asyncHandlerMiddleware from '../../middleware/async-handler.middleware';

const seedRouter = express.Router();

seedRouter.post('/', asyncHandlerMiddleware(seedController.seed));

export default seedRouter;
