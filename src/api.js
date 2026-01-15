import axios from "axios";

const API = axios.create({
	baseURL: "https://api.resvar.com/api",
	// baseURL: "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Flag to prevent multiple redirects
let isRedirecting = false;

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

			// Redirect to signin page for any 401 unauthorized errors
			// This handles: Token expired, Invalid token, No token, etc.
			// Only redirect if we're not already on the signin or signup page and not already redirecting
			const currentPath = window.location.pathname;
			if (
				currentPath !== "/signin" &&
				currentPath !== "/signup" &&
				!isRedirecting
			) {
				isRedirecting = true;
				// Use window.location.replace to prevent back button issues
				window.location.replace("/signin");
			}
		}
		return Promise.reject(error);
	}
);

export default API;
