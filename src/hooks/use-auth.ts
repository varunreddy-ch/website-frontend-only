import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, removeToken } from "../auth";

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = () => {
			const token = getToken();
			if (token) {
				try {
					const userData = getUser();
					if (userData) {
						setIsAuthenticated(true);
						setUser(userData);
					} else {
						// Invalid token, clear it
						removeToken();
						setIsAuthenticated(false);
						setUser(null);
					}
				} catch (error) {
					// Token is invalid, clear it
					removeToken();
					setIsAuthenticated(false);
					setUser(null);
				}
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
			setIsLoading(false);
		};

		checkAuth();

		// Check authentication every 30 seconds to catch expired tokens
		const interval = setInterval(checkAuth, 30000);

		return () => clearInterval(interval);
	}, []);

	const logout = () => {
		removeToken();
		setIsAuthenticated(false);
		setUser(null);
		navigate("/signin");
	};

	const checkTokenExpiration = () => {
		const token = getToken();
		if (token) {
			try {
				const userData = getUser();
				if (!userData) {
					logout();
				}
			} catch (error) {
				logout();
			}
		}
	};

	return {
		isAuthenticated,
		user,
		isLoading,
		logout,
		checkTokenExpiration,
	};
};
