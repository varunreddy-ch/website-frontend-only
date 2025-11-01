import { getUser, logout } from "@/auth";
import { useState } from "react";
import { Menu, X, FileText, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const UserNavbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const user = getUser();

	const handleSignOut = () => {
		logout();
		navigate("/signin");
	};

	const displayName = user?.firstname ?? "User";

	// Get current user ID for profile link
	const getProfileLink = () => {
		return user?.user ? `/profile/${user.user}` : "/profile";
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
			<div className="container mx-auto px-6">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						to="/dashboard"
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
						{user?.role !== "applier" && (
							<Link to="/dashboard">
								<Button
									variant={
										location.pathname === "/dashboard"
											? "default"
											: "ghost"
									}
									className={`transition-colors duration-200 font-medium text-sm ${
										location.pathname === "/dashboard"
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "text-gray-700 hover:text-blue-600"
									}`}
								>
									Generate
								</Button>
							</Link>
						)}
						{user?.role === "tier2" && (
							<Link to="/jobs">
								<Button
									variant={
										location.pathname === "/jobs"
											? "default"
											: "ghost"
									}
									className={`transition-colors duration-200 font-medium text-sm ${
										location.pathname === "/jobs"
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "text-gray-700 hover:text-blue-600"
									}`}
								>
									Jobs
								</Button>
							</Link>
						)}
						{user?.role === "applier" && (
							<Link to="/jobs">
								<Button
									variant={
										location.pathname === "/jobs"
											? "default"
											: "ghost"
									}
									className={`transition-colors duration-200 font-medium text-sm ${
										location.pathname === "/jobs"
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "text-gray-700 hover:text-blue-600"
									}`}
								>
									Jobs
								</Button>
							</Link>
						)}
						{(user?.role === "tier1" || user?.role === "user") && (
							<Button
								variant="ghost"
								className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm relative group"
								onClick={() => navigate("/jobs")}
							>
								Jobs
								<Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5">
									Premium
								</Badge>
							</Button>
						)}
						{user?.role === "applier" && (
							<Link to="/applier-form">
								<Button
									variant={
										location.pathname === "/applier-form"
											? "default"
											: "ghost"
									}
									className={`transition-colors duration-200 font-medium text-sm ${
										location.pathname === "/applier-form"
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "text-gray-700 hover:text-blue-600"
									}`}
								>
									Submit Job
								</Button>
							</Link>
						)}
						{user?.role === "tier2" && (
							<Link to={getProfileLink()}>
								<Button
									variant={
										location.pathname.startsWith("/profile")
											? "default"
											: "ghost"
									}
									className={`transition-colors duration-200 font-medium text-sm ${
										location.pathname.startsWith("/profile")
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "text-gray-700 hover:text-blue-600"
									}`}
								>
									Profile
								</Button>
							</Link>
						)}
						{(user?.role === "tier1" || user?.role === "user") && (
							<Button
								variant="ghost"
								className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm relative group"
								onClick={() => navigate(getProfileLink())}
							>
								Profile
								<Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5">
									Premium
								</Badge>
							</Button>
						)}
					</div>

					{/* Desktop User Section */}
					<div className="hidden md:flex items-center space-x-4">
						<span className="text-gray-600 text-sm">
							Welcome back, <strong>{displayName}</strong>
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
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-600 hover:text-blue-600"
						>
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-100 bg-white">
						<div className="flex flex-col space-y-3">
							{user?.role !== "applier" && (
								<Link to="/dashboard">
									<Button
										variant={
											location.pathname === "/dashboard"
												? "default"
												: "ghost"
										}
										className={`transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
											location.pathname === "/dashboard"
												? "bg-blue-600 text-white hover:bg-blue-700"
												: "text-gray-700 hover:text-blue-600"
										}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Generate
									</Button>
								</Link>
							)}
							{user?.role === "tier2" && (
								<Link to="/jobs">
									<Button
										variant={
											location.pathname === "/jobs"
												? "default"
												: "ghost"
										}
										className={`transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
											location.pathname === "/jobs"
												? "bg-blue-600 text-white hover:bg-blue-700"
												: "text-gray-700 hover:text-blue-600"
										}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Jobs
									</Button>
								</Link>
							)}
							{user?.role === "applier" && (
								<Link to="/jobs">
									<Button
										variant={
											location.pathname === "/jobs"
												? "default"
												: "ghost"
										}
										className={`transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
											location.pathname === "/jobs"
												? "bg-blue-600 text-white hover:bg-blue-700"
												: "text-gray-700 hover:text-blue-600"
										}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Jobs
									</Button>
								</Link>
							)}
							{(user?.role === "tier1" ||
								user?.role === "user") && (
								<Button
									variant="ghost"
									className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm relative group"
									onClick={() => {
										navigate("/jobs");
										setIsMenuOpen(false);
									}}
								>
									Jobs
									<Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5">
										Premium
									</Badge>
								</Button>
							)}
							{user?.role === "applier" && (
								<Link to="/applier-form">
									<Button
										variant={
											location.pathname ===
											"/applier-form"
												? "default"
												: "ghost"
										}
										className={`transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
											location.pathname ===
											"/applier-form"
												? "bg-blue-600 text-white hover:bg-blue-700"
												: "text-gray-700 hover:text-blue-600"
										}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Submit Job
									</Button>
								</Link>
							)}
							{user?.role === "tier2" && (
								<Link to={getProfileLink()}>
									<Button
										variant={
											location.pathname.startsWith(
												"/profile"
											)
												? "default"
												: "ghost"
										}
										className={`transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left w-full justify-start ${
											location.pathname.startsWith(
												"/profile"
											)
												? "bg-blue-600 text-white hover:bg-blue-700"
												: "text-gray-700 hover:text-blue-600"
										}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Profile
									</Button>
								</Link>
							)}
							{(user?.role === "tier1" ||
								user?.role === "user") && (
								<Button
									variant="ghost"
									className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm relative group"
									onClick={() => {
										navigate(getProfileLink());
										setIsMenuOpen(false);
									}}
								>
									Profile
									<Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5">
										Premium
									</Badge>
								</Button>
							)}

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

export default UserNavbar;
