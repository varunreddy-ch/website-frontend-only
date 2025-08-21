import { getUser } from "@/auth";
import { useLocation } from "react-router-dom";
import HomepageNavbar from "./HomepageNavbar";
import UserNavbar from "./UserNavbar";
import AdminNavbar from "./AdminNavbar";

const Navbar = () => {
	const location = useLocation();
	const user = getUser();

	// Determine which navbar to show based on route and user role
	const isHomepage = location.pathname === "/";
	const isAuthenticatedRoute =
		location.pathname === "/dashboard" ||
		location.pathname === "/profile" ||
		location.pathname === "/jobs" ||
		location.pathname.startsWith("/profile/");
	const isAdmin = location.pathname.startsWith("/admin");

	// Show AdminNavbar for admin routes
	if (isAdmin && user?.role === "admin") {
		return <AdminNavbar />;
	}

	// Show UserNavbar for authenticated user routes
	if (isAuthenticatedRoute && user) {
		return <UserNavbar />;
	}

	// Show HomepageNavbar for landing page and other routes
	return <HomepageNavbar />;
};

export default Navbar;
