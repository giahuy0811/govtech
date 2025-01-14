export type RegisterStudentResponse = {
	success: boolean;
};

export type GetCommonStudentsResponse = {
	students: string[];
};

export type SuspendStudentResponse = {
	suspended: boolean;
};

export type GetNotificationRecipentsResponse = {
	recipients: string[];
};
