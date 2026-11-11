import axios from "axios";
import { ErrorResponseModel } from "../types/models";

export function handleAxiosRequestErrors(error: any): never {
	if (axios.isAxiosError<ErrorResponseModel>(error)) {
		const message = error.response?.data?.message ?? error.message;
		const text = `Failed to ${error.config?.method} ${error.config?.url}: ${message}`;

		console.error(text);
		throw new Error(text);
	}
	
	console.error("Unexpected error:", error);
	throw error;
}