import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await API.post("/login", form);
			setToken(res.data.token);
			const role = getUser()?.role;
			navigate(role === "admin" ? "/admin" : "/dashboard");
		} catch (err) {
			setError("Invalid username or password.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 relative overflow-hidden">
			{/* Blurred background blob */}

			<div className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse -z-10 top-10 right-10"></div>

			<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
				<h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
					ResumeVAR
				</h1>
				<p className="text-sm text-center text-gray-500 mb-6">
					Sign in to continue
				</p>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
						<div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2 text-center">
							{error}
						</div>
					)}
					<button
						type="submit"
						className={`w-full ${
							loading
								? "bg-blue-300 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700"
						} text-white font-semibold py-2 rounded-md transition duration-200`}
						disabled={loading}
					>
						{loading ? "Signing In..." : "Sign In"}
					</button>
				</form>

				<p className="text-sm text-center text-gray-500 mt-6">
					Don't have an account? Send your resume to{" "}
					<a
						href="mailto:support@resumevar.com"
						className="text-blue-600 underline"
					>
						support@resumevar.com
					</a>{" "}
					to get your credentials today.
				</p>
			</div>
		</div>
	);
}
