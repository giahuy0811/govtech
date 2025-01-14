import { Request, Response } from 'express';
import { BUSINESS_MESSAGE } from '../../constants';
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
		console.log(error);

		return ApiResponseModel.toInternalServer(res);
	}
};

const getCommonStudents = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<GetCommonStudentsResponse>>> => {
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

		return ApiResponseModel.toInternalServer(res);
	}
};

const suspend = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<SuspendStudentResponse>>> => {
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

		return ApiResponseModel.toInternalServer(res);
	}
};

const getNotificationReceipents = async (
	req: Request,
	res: Response
): Promise<Response<ApiResponse<GetNotificationRecipentsResponse>>> => {
	try {
		const { teacher, notification } = req.body;

		const teacherEntity = await teacherService.findByEmail(teacher);

		if (teacherEntity === null)
			return ApiResponseModel.toBadRequest(
				res,
				BUSINESS_MESSAGE.INVALID_TEACHER
			);

		const mentionedEmails = extractEmailsFromString(notification);

		if (mentionedEmails.length === 0)
			return ApiResponseModel.toBadRequest(res, BUSINESS_MESSAGE.INVALID_EMAIL);

		const recipients = await studentService.getStudentsForNotification(
			teacherEntity.id,
			mentionedEmails
		);

		return ApiResponseModel.toSuccess(res, { recipients });
	} catch (error) {
		console.log(error);

		return ApiResponseModel.toInternalServer(res);
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
