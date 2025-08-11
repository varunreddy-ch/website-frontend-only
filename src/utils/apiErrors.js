// utils/apiError.js
export function getAPIErrorMessage(error, fallback = "Something went wrong.") {
	console.log(error);
	if (error?.response?.data?.message) return error.response.data.message;
	if (error?.response?.data?.error) return error.response.data.error;
	if (typeof error?.response?.data === "string") return error.response.data;
	if (error?.response?.status === 403)
		return "You do not have permission to perform this action.";
	if (error?.response?.status === 404)
		return "Resource not found. Please check and try again.";
	if (error?.response?.status === 429)
		return "Rate Limit Reached for the minute or the entire day";
	if (error?.message) return error.message;
	return fallback;
}
