import { logout, getUser } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const user = getUser();
	const navigate = useNavigate();

	return (
		<nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
			<h1
				className="text-xl font-bold text-blue-600 cursor-pointer"
				onClick={() =>
					navigate(user?.role === "admin" ? "/admin" : "/dashboard")
				}
			>
				ResumeVAR
			</h1>

			<div className="flex items-center space-x-4">
				<span className="text-gray-600 text-sm">
					Logged in as <strong>{user?.user}</strong> ({user?.role})
				</span>
				<button
					onClick={() => {
						logout();
						navigate("/");
					}}
					className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm rounded-xl transition duration-200 ease-in-out shadow-sm"
				>
					Logout
				</button>
			</div>
		</nav>
	);
}
