export function setToken(token) {
	localStorage.setItem("token", token);
}
export function getUser() {
	const token = localStorage.getItem("token");
	if (!token) return null;
	const payload = JSON.parse(atob(token.split(".")[1]));
	return payload;
}

export function logout() {
	localStorage.removeItem("token");
}
