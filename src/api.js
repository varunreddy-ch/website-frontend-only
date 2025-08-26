import axios from "axios";

const API = axios.create({
	baseURL: "https://api.resumevar.com/api",
	// baseURL: "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor to include auth token
API.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor for error handling
API.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Remove expired/invalid token
			localStorage.removeItem("token");

			// Check if the error message indicates token expiration
			const errorMessage = error.response?.data;
			if (
				errorMessage === "Token expired" ||
				errorMessage === "Invalid token"
			) {
				// Redirect to signin page for expired/invalid tokens
				// Only redirect if we're not already on the signin page
				if (window.location.pathname !== "/signin") {
					window.location.href = "/signin";
				}
			}
		}
		return Promise.reject(error);
	}
);

export default API;
