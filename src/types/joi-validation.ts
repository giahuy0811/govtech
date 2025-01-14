export type JoiError = {
	error: {
		isJoi: boolean;
		details: { message: string }[];
	};
};