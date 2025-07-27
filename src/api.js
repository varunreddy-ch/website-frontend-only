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
			localStorage.removeItem("token");
		}
		return Promise.reject(error);
	}
);

export default API;
