export interface ApiResponse<T> {
	correlationId: string;
	data: T;
}
