// src/components/AdminNavbar.tsx (or .jsx – remove types)
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, FileText, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, logout } from "@/auth";

const AdminNavbar = () => {
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const user = getUser();

	const path = location.pathname;
	const isActive = (target: string) => path === target;

	const handleSignOut = () => {
		logout();
		navigate("/signin");
	};

	const displayName = user?.firstname ?? "Admin";

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
			<div className="container mx-auto px-6">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						to="/admin/dashboard"
						className="flex items-center space-x-2 cursor-pointer"
					>
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<FileText className="h-5 w-5 text-white" />
						</div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							ResumeVar
						</h1>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<Link to="/admin/dashboard">
							<Button
								variant="ghost"
								className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm ${
									isActive("/admin/dashboard")
										? "text-blue-600"
										: ""
								}`}
							>
								Dashboard
							</Button>
						</Link>
						<Link to="/admin">
							<Button
								variant="ghost"
								className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm ${
									isActive("/admin") ? "text-blue-600" : ""
								}`}
							>
								Users
							</Button>
						</Link>
						<Link to="/admin/jobs">
							<Button
								variant="ghost"
								className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm ${
									isActive("/admin/jobs")
										? "text-blue-600"
										: ""
								}`}
							>
								Jobs
							</Button>
						</Link>
						<Link to="/admin/demos">
							<Button
								variant="ghost"
								className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm ${
									isActive("/admin/demos")
										? "text-blue-600"
										: ""
								}`}
							>
								Demos
							</Button>
						</Link>
					</div>

					{/* Desktop User Section */}
					<div className="hidden md:flex items-center space-x-4">
						<span className="text-gray-600 text-sm">
							Admin: <strong>{displayName}</strong>
						</span>
						<Button
							variant="outline"
							onClick={handleSignOut}
							className="flex items-center gap-2 px-4 py-2 border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all duration-200"
						>
							<LogOut className="h-4 w-4" />
							Sign Out
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setOpen((v) => !v)}
							className="text-gray-600 hover:text-blue-600"
						>
							{open ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{open && (
					<div className="md:hidden py-4 border-t border-gray-100 bg-white">
						<div className="flex flex-col space-y-3">
							<Link to="/admin/dashboard">
								<Button
									variant="ghost"
									className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
										isActive("/admin/dashboard")
											? "text-blue-600 bg-blue-50"
											: ""
									}`}
									onClick={() => setOpen(false)}
								>
									Dashboard
								</Button>
							</Link>
							<Link to="/admin">
								<Button
									variant="ghost"
									className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
										isActive("/admin")
											? "text-blue-600 bg-blue-50"
											: ""
									}`}
									onClick={() => setOpen(false)}
								>
									Users
								</Button>
							</Link>
							<Link to="/admin/jobs">
								<Button
									variant="ghost"
									className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
										isActive("/admin/jobs")
											? "text-blue-600 bg-blue-50"
											: ""
									}`}
									onClick={() => setOpen(false)}
								>
									Jobs
								</Button>
							</Link>
							<Link to="/admin/demos">
								<Button
									variant="ghost"
									className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
										isActive("/admin/demos")
											? "text-blue-600 bg-blue-600"
											: ""
									}`}
									onClick={() => setOpen(false)}
								>
									Demos
								</Button>
							</Link>

							<div className="pt-4 border-t border-gray-100 space-y-3">
								<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
									<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
										<User className="h-4 w-4 text-white" />
									</div>
									<div>
										<div className="font-medium text-sm">
											{displayName}
										</div>
										<div className="text-xs text-gray-500">
											{user?.role}
										</div>
									</div>
								</div>

								<Button
									variant="outline"
									onClick={handleSignOut}
									className="w-full justify-start gap-2 border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-700"
								>
									<LogOut className="h-4 w-4" />
									Sign Out
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default AdminNavbar;
