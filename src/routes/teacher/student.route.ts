import express from 'express';
import studentController from '../../controller/teacher/student.controller';
import {
	GetCommonStudentsSchema,
	GetNotificationReceipentsSchema,
	RegisterStudentSchema,
	SuspendStudentSchema,
} from '../../validation/teacher/student.validation';
import asyncHandlerMiddleware from '../../middleware/async-handler.middleware';
import { validator } from '../../middleware/validator.middleware';

const studentRouter = express.Router();

/**
 * @swagger
 * /api/register:
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
 *                                  items:
 *                                   type: string
 *                                   example: studentjon@gmail.com
 *                                  required: true
 *          responses:
 *              204:
 *                  description: Success
 *              400:
 *                  description: Bad request
 *              500:
 *                  description: Internal server error
 */
studentRouter.post(
	'/register',
	validator.body(RegisterStudentSchema),
	asyncHandlerMiddleware(studentController.register)
);

/**
 * @swagger
 * /api/commonstudents:
 *      get:
 *          summary: Get common students by given list of teachers
 *          tags:
 *              - Student
 *          parameters:
 *               - name: teacher
 *                 in: query
 *                 required: true
 *                 example: teacherken@gmail.com
 *                 schema:
 *                  type: string
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                               students:
 *                                  type: array
 *                                  items:
 *                                   type: string
 *                                   example: studentjon@gmail.com
 *              401:
 *                  description: Bad request
 *              500:
 *                  description: Internal server error
 */
studentRouter.get(
	'/commonstudents',
	validator.query(GetCommonStudentsSchema),
	asyncHandlerMiddleware(studentController.getCommonStudents)
);

/**
 * @swagger
 * /api/suspend:
 *      post:
 *          summary: Suspend a specified student.
 *          tags:
 *              - Student
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              student:
 *                                  type: string
 *                                  example: studentjon@gmail.com
 *          responses:
 *              204:
 *                  description: Success
 *              400:
 *                  description: Bad request
 *              500:
 *                  description: Internal server error
 */
studentRouter.post(
	'/suspend',
	validator.body(SuspendStudentSchema),
	asyncHandlerMiddleware(studentController.suspend)
);

/**
 * @swagger
 * /api/retrievefornotifications:
 *      post:
 *          summary: Get notification receipents
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
 *                              notification:
 *                                  type: string
 *                                  example: Hello students! @studenthon@gmail.com studentjon@gmail.com
 *                                  required: true
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                               students:
 *                                  type: array
 *                                  items:
 *                                   type: string
 *                                   example: studentjon@gmail.com
 *              400:
 *                  description: Bad request
 *              500:
 *                  description: Internal server error
 */
studentRouter.post(
	'/retrievefornotifications',
	validator.body(GetNotificationReceipentsSchema),
	asyncHandlerMiddleware(studentController.getNotificationReceipents)
);
export default studentRouter;
