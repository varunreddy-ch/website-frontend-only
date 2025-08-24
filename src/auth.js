// Authentication utilities
export const setToken = (token) => {
	localStorage.setItem("token", token);
};

export const getToken = () => {
	return localStorage.getItem("token");
};

export const removeToken = () => {
	localStorage.removeItem("token");
};

export const isAuthenticated = () => {
	const token = getToken();
	if (!token) return false;

	try {
		const user = getUser();
		return !!user;
	} catch (error) {
		// Token is invalid, remove it
		removeToken();
		return false;
	}
};

export const getUser = () => {
	const token = getToken();
	if (!token) return null;

	try {
		// Decode JWT token to get user info
		const payload = JSON.parse(atob(token.split(".")[1]));

		// Check if token has expired
		if (payload.exp && payload.exp < Date.now() / 1000) {
			// Token has expired, remove it
			removeToken();
			return null;
		}

		return payload;
	} catch (error) {
		console.error("Error decoding token:", error);
		// Remove invalid token
		removeToken();
		return null;
	}
};

export const logout = () => {
	removeToken();
	window.location.href = "/signin";
};

// Check if token is expired
export const isTokenExpired = () => {
	const user = getUser();
	if (!user) return true;

	if (user.exp && user.exp < Date.now() / 1000) {
		removeToken();
		return true;
	}

	return false;
};
