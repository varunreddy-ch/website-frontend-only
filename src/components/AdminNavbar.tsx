// src/components/AdminNavbar.tsx (or .jsx – remove types)
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, FileText, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, logout } from "@/auth";

const AdminNavbar = () => {
	const [open, setOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const user = getUser();

	const path = location.pathname;
	const isActive = (target: string) => path === target;

	const handleSignOut = () => {
		logout();
		navigate("/signin");
	};

	const displayName = user?.firstname ?? "User";

	const AdminLink = ({ to, label }: { to: string; label: string }) => (
		<Link to={to} onClick={() => setOpen(false)}>
			<Button
				variant="outline" // valid variant
				className={`font-medium w-full md:w-auto ${
					isActive(to)
						? "bg-white shadow-sm border border-gray-200"
						: "hover:bg-gray-50"
				}`}
			>
				{label}
			</Button>
		</Link>
	);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
			<div className="container mx-auto px-4 md:px-6">
				{/* Desktop: 3-column grid. Mobile: logo + menu button */}
				<div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center h-16 gap-x-8">
					{/* Left: Logo */}
					<Link to="/" className="flex items-center space-x-3 group">
						<div className="relative">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-transform group-hover:scale-105">
								<FileText className="h-5 w-5 text-white" />
							</div>
						</div>
						<div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								ResumeVar
							</h1>
							<p className="text-xs text-gray-500 -mt-1">
								Admin Panel
							</p>
						</div>
					</Link>

					{/* Center: Admin nav */}
					<div className="flex items-center justify-center">
						<div className="flex items-center gap-3 p-1 rounded-lg border border-gray-200 bg-white/70 backdrop-blur">
							<AdminLink
								to="/admin/dashboard"
								label="Dashboard"
							/>
							<AdminLink to="/admin" label="Users" />
							<AdminLink to="/admin/jobs" label="Jobs" />
						</div>
					</div>

					{/* Right: User menu */}
					<div className="flex items-center justify-end">
						<div className="relative">
							<Button
								variant="outline"
								className="flex items-center gap-2 px-4"
								onClick={() => setUserMenuOpen((v) => !v)}
								aria-expanded={userMenuOpen}
								aria-haspopup="menu"
							>
								<div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
									<User className="h-3 w-3 text-white" />
								</div>
								<div className="text-left">
									<div className="text-sm font-medium">
										{displayName}
									</div>
									<div className="text-xs text-gray-500">
										{user?.role}
									</div>
								</div>
								<ChevronDown
									className={`h-4 w-4 transition-transform ${
										userMenuOpen ? "rotate-180" : ""
									}`}
								/>
							</Button>

							{/* Dropdown */}
							{userMenuOpen && (
								<div
									role="menu"
									className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-[70]"
								>
									<Button
										variant="destructive"
										onClick={handleSignOut}
										className="w-full justify-start gap-2"
									>
										<LogOut className="h-4 w-4" />
										Sign Out
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Mobile header */}
				<div className="flex md:hidden items-center justify-between h-16">
					<Link to="/" className="flex items-center space-x-3">
						<div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
							<FileText className="h-5 w-5 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								ResumeVar
							</h1>
							<p className="text-xs text-gray-500 -mt-1">
								Admin Panel
							</p>
						</div>
					</Link>

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setOpen((v) => !v)}
						className="text-gray-700"
						aria-label="Toggle menu"
						aria-expanded={open}
					>
						{open ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</Button>
				</div>

				{/* Mobile menu */}
				{open && (
					<div className="md:hidden border-t border-gray-200 bg-white">
						<div className="p-4 space-y-4">
							<div className="space-y-2">
								<AdminLink
									to="/admin/dashboard"
									label="Dashboard"
								/>
								<AdminLink to="/admin/users" label="Users" />
								<AdminLink to="/admin/jobs" label="Jobs" />
							</div>

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
									variant="destructive"
									onClick={handleSignOut}
									className="w-full justify-start gap-2"
								>
									<LogOut className="h-4 w-4" />
									Sign Out
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Click-away overlay for user menu (above navbar, below dropdown) */}
			{userMenuOpen && (
				<button
					aria-label="Close user menu"
					className="fixed inset-0 z-[60] cursor-default"
					onClick={() => setUserMenuOpen(false)}
				/>
			)}
		</nav>
	);
};

export default AdminNavbar;
