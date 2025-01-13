import express from 'express';
import studentRouter from './student.route';

const teacherRouter = express.Router();

teacherRouter.use('/student', studentRouter);
export default teacherRouter;
