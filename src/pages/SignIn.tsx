import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageFooter from "@/components/PageFooter";
import API from "../api";
import { setToken, getUser } from "../auth";

export default function SignIn() {
	const [form, setForm] = useState({
		username: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const user = getUser();
			const role = user?.role;

			// Redirect based on user role
			if (role === "admin") {
				navigate("/admin");
			} else if (role === "tier2" || role === "tier3" || role === "tier4") {
				navigate("/jobs");
			} else if (role === "applier") {
				navigate("/applier-form");
			} else {
				// tier1 and user roles go to dashboard
				navigate("/dashboard");
			}
		}
	}, [navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await API.post("/login", form);
			setToken(res.data.token);
			const user = getUser();
			const role = user?.role;

			// Redirect based on user tier
			if (role === "admin") {
				navigate("/admin");
			} else if (role === "tier2" || role === "tier4") {
				navigate("/jobs");
			} else if (role === "applier") {
				navigate("/applier-form");
			} else {
				// tier1 and user roles go to dashboard (generate page)
				navigate("/dashboard");
			}
		} catch (err) {
			setError("Invalid username or password.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<Navbar />

			<div className="flex items-center justify-center min-h-screen px-4 pt-16">
				<Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader className="text-center">
						<div className="flex items-center gap-2 mb-4">
							<Link
								to="/"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								<ArrowLeft className="h-4 w-4" />
								<span className="text-sm">Back to Home</span>
							</Link>
						</div>
						<CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Welcome Back
						</CardTitle>
						<CardDescription className="text-muted-foreground">
							Sign in to continue to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									placeholder="Enter your username"
									value={form.username}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											username: e.target.value,
										}))
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={form.password}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											password: e.target.value,
										}))
									}
									required
								/>
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
								disabled={loading}
							>
								{loading ? "Signing In..." : "Sign In"}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm">
							<span className="text-muted-foreground">
								Don't have an account?{" "}
							</span>
							<Link
								to="/signup"
								className="text-blue-600 hover:text-purple-600 font-medium transition-colors"
							>
								Sign up
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>

			<PageFooter />
		</div>
	);
}
