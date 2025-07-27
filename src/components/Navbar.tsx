import { getUser, logout } from "@/auth";
import { useState, useEffect } from "react";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const user = getUser();

	const isDashboard = location.pathname === "/dashboard";
	const isAdmin = location.pathname === "/admin";

	const handleSignOut = () => {
		logout();
		navigate("/signin");
	};

	const handleNavClick = (href: string) => {
		if (location.pathname === "/") {
			document
				.querySelector(href)
				?.scrollIntoView({ behavior: "smooth" });
		} else {
			navigate("/");
			setTimeout(() => {
				document
					.querySelector(href)
					?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
			<div className="container mx-auto px-6">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center space-x-2 cursor-pointer"
					>
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<FileText className="h-5 w-5 text-white" />
						</div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							ResumeVar
						</h1>
					</Link>

					{/* Dashboard-only: Show Sign Out */}
					{isDashboard || isAdmin ? (
						<div className="flex items-center space-x-4">
							<span className="text-gray-600 text-sm">
								Logged in as <strong>{user?.firstname}</strong>{" "}
								({user?.role})
							</span>

							<Button
								variant="outline"
								onClick={handleSignOut}
								className="text-red-600 border-red-500 hover:bg-red-50"
							>
								Sign Out
							</Button>
						</div>
					) : (
						<>
							{/* Desktop Navigation */}
							<div className="hidden md:flex items-center space-x-8">
								{[
									{ name: "Home", href: "#home" },
									{ name: "Features", href: "#features" },
									// { name: "Pricing", href: "#pricing" },
									{ name: "FAQs", href: "#faqs" },
									// { name: "Contact", href: "#contact" },
								].map((link) => (
									<button
										key={link.name}
										onClick={() =>
											handleNavClick(link.href)
										}
										className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
									>
										{link.name}
									</button>
								))}
							</div>

							{/* Desktop CTA Buttons */}
							<div className="hidden md:flex items-center space-x-3">
								<Link to="/signin">
									<Button
										variant="outline"
										className="border-blue-500 text-blue-600 hover:bg-blue-50 font-medium"
									>
										Sign In
									</Button>
								</Link>
								<Link to="/signup">
									<Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
										Create Resume
									</Button>
								</Link>
							</div>
						</>
					)}

					{/* Mobile Menu Button – Hidden on dashboard */}
					{!isDashboard && !isAdmin && (
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
					)}
				</div>

				{/* Mobile Menu – Hidden on dashboard */}
				{!isDashboard && !isAdmin && isMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-100 bg-white">
						<div className="flex flex-col space-y-3">
							{[
								{ name: "Home", href: "#home" },
								{ name: "Features", href: "#features" },
								// { name: "Pricing", href: "#pricing" },
								{ name: "FAQs", href: "#faqs" },
								{ name: "Contact", href: "#contact" },
							].map((link) => (
								<button
									key={link.name}
									onClick={() => {
										handleNavClick(link.href);
										setIsMenuOpen(false);
									}}
									className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-left"
								>
									{link.name}
								</button>
							))}
							<div className="flex flex-col space-y-3 px-4 pt-4 border-t border-gray-100">
								<Link to="/signin">
									<Button
										variant="outline"
										className="border-blue-500 text-blue-600 hover:bg-blue-50 font-medium w-full"
									>
										Sign In
									</Button>
								</Link>
								<Link to="/signup">
									<Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium w-full">
										Create Resume
									</Button>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
