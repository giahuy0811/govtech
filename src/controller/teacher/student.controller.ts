import { Request, Response } from 'express';
import { In } from 'typeorm';
import { v4 } from 'uuid';
import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/user.entity';
import { BUSINESS_MESSAGE, ROLE } from '../../constants';
import { ApiResponseModel } from '../../utils/response.util';
import {
	ApiResponse,
	GetCommonStudentsResponse,
	GetNotificationRecipentsResponse,
	RegisterStudentResponse,
	SuspendStudentResponse,
} from '../../types';
import teacherService from '../../services/teacher.service';
import studentService from '../../services/student.service';

const register = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<RegisterStudentResponse>>> => {
	const correlationId = v4();
	try {
		const { teacher, students } = req.body;

		const teacherEntity = await teacherService.findByEmail(teacher);

		if (teacherEntity === null)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_TEACHER
			);

		const studentEntities = await studentService.findStudentsByEmails(students);
		if (studentEntities.length === 0)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_STUDENT
			);

		await teacherService.registerStudents(teacher, studentEntities);

		return ApiResponseModel.toSuccessNoResponse(res);
	} catch (error) {
		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

const getCommonStudents = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<GetCommonStudentsResponse>>> => {
	const correlationId = v4();

	const { teacher } = req.query;

	try {
		const teachers = Array.isArray(teacher) ? teacher : [teacher];

		if (teachers.length == 0)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_TEACHER
			);

		const teacherEntities = await teacherService.findByEmails(
			teachers as string[]
		);

		if (teacherEntities.length === 0)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_TEACHER
			);

		const teacherIds = teacherEntities.map((item) => item.id);

		const students = await studentService.getStudentsForTeachers(teacherIds);

		return ApiResponseModel.toSuccess(res, {
			students,
		});
	} catch (error) {
		console.log(error);

		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

const suspend = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<SuspendStudentResponse>>> => {
	const correlationId = v4();
	try {
		const { student } = req.body;

		const studentEntity = await studentService.findByEmail(student);

		if (studentEntity === null)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_STUDENT
			);

		await studentService.suspendStudent(studentEntity.id);

		return ApiResponseModel.toSuccessNoResponse(res);
	} catch (error) {
		console.log(error);

		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

const getNotificationReceipents = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<GetNotificationRecipentsResponse>>> => {
	const correlationId = v4();

	try {
		const { teacher, notification } = req.body;

		const mentionedEmails = extractEmailsFromString(notification);

		const userRepository = AppDataSource.getRepository(User);
		const teacherEntity = await userRepository.findOne({
			where: { email: teacher },
			relations: ['students'],
		});

		if (!teacherEntity)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_TEACHER
			);

		const registeredStudentEmails = teacherEntity.students
			.filter((student) => !student.suspended)
			.map((student) => student.email);

		const allRecipients = Array.from(
			new Set([...registeredStudentEmails, ...mentionedEmails])
		);

		const studentRepository = AppDataSource.getRepository(User);
		const eligibleRecipients = await studentRepository.find({
			where: {
				email: In(allRecipients),
				suspended: false,
			},
			select: ['email'],
		});

		const emails = eligibleRecipients.map((student) => student.email);

		return ApiResponseModel.toSuccess(res, { recipients: emails });
	} catch (error) {
		console.log(error);

		return ApiResponseModel.toInternalServer(res, correlationId);
	}
};

function extractEmailsFromString(value: string): string[] {
	return Array.from(
		value.matchAll(/@([\w.+-]+@[\w-]+\.[\w.-]+)/g),
		(m: string[]) => m[1]
	);
}

export default {
	register,
	getCommonStudents,
	suspend,
	getNotificationReceipents,
	extractEmailsFromString,
};
