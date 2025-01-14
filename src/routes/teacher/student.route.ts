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
 *                                          success:
 *                                            type: boolean
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
 * /api/teacher/student/get-common-students:
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
 *                                  correlationId:
 *                                    type: string
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          students:
 *                                            type: array
 *                                            items:
 *                                              type: string
 *                                              example: studenthon@gmail.com
 *
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
studentRouter.get(
	'/get-common-students',
	validator.query(GetCommonStudentsSchema),
	asyncHandlerMiddleware(studentController.getCommonStudents)
);

/**
 * @swagger
 * /api/teacher/student/suspend:
 *      put:
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
 *                              teacher:
 *                                  type: string
 *                                  example: teacher@gmail.com
 *                                  required: true
 *                              students:
 *                                  type: string
 *                                  example: studentjon@gmail.com
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
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          suspended:
 *                                            type: boolean
 *                                            example: true
 *              400:
 *                  description: Bad request
 *              500:
 *                  description: Internal server error
 */
studentRouter.put(
	'/suspend',
	validator.body(SuspendStudentSchema),
	asyncHandlerMiddleware(studentController.suspend)
);

/**
 * @swagger
 * /api/teacher/student/get-notification-receipents:
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
 *                              students:
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
 *                                  correlationId:
 *                                      type: string
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          receipents:
 *                                            type: array
 *                                            items:
 *                                              type: string
 *                                              example: studenthon@gmail.com
 *              400:
 *                  description: Bad request
 *              500:
 *                  description: Internal server error
 */
studentRouter.post(
	'/get-notification-receipents',
	validator.body(GetNotificationReceipentsSchema),
	asyncHandlerMiddleware(studentController.getNotificationReceipents)
);
export default studentRouter;
