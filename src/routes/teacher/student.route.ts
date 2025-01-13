import express from 'express';
import validation from 'express-joi-validation';
import expressAsyncHandler from 'express-async-handler';
import studentController from '../../controller/teacher/student.controller';
import { RegisterStudentSchema } from '../../validation/teacher/student.validation';

const validator = validation.createValidator({
	passError: true,
});

const studentRouter = express.Router();

/**
 * @swagger
 * /api/teacher/student/register:
 *      post:
 *          summary: Register student to a specified teacher
 *          tags:
 *              - Student
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              teacher:
 *                                  type: string
 *                                  example: teacher@gmail.com
 *                                  required: true
 *                              students:
 *                                  type: array
 *                                  example: string
 *                                  items:
 *                                   type: string
 *                                   example: student@gmail.com
 *                                  required: true
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  correlationId:
 *                                      type: string
 *                                  status:
 *                                      type: number
 *                                  error:
 *                                      type: 'null'
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          id:
 *                                            type: string
 *                                          accessToken:
 *                                            type: string
 *                                          refreshToken:
 *                                            type: string
 *              400:
 *                  description: Bad request
 *              500:
 *                  description: Internal server error
 */
studentRouter.post(
	'/register',
	validator.body(RegisterStudentSchema),
	expressAsyncHandler(studentController.register)
);

export default studentRouter;
