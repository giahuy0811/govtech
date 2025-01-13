import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import seedController from '../../controller/seed/seed.controller';

const seedRouter = express.Router();

seedRouter.post('/', expressAsyncHandler(seedController.seed));

export default seedRouter;
