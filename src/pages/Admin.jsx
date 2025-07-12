import { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Admin() {
	const [users, setUsers] = useState([]);
	const [form, setForm] = useState({
		username: "",
		password: "",
		role: "user",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [filterRole, setFilterRole] = useState("all");
	const [userToRemove, setUserToRemove] = useState(null);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const fetchUsers = async () => {
		const res = await API.get("/users");
		setUsers(res.data.users);
	};

	const handleCreate = async () => {
		if (!form.username || !form.password) {
			setError("Please fill in all fields.");
			setMessage("");
			return;
		}
		try {
			await API.post("/create-user", form);
			setMessage(`✅ User "${form.username}" created successfully.`);
			setError("");
			setForm({ username: "", password: "", role: "user" });
			fetchUsers();
			setTimeout(() => setMessage(""), 3000);
		} catch {
			setError("❌ Failed to create user.");
			setMessage("");
		}
	};

	const handleRemove = async (username) => {
		try {
			await API.post("/remove-user", { username });
			setMessage(`🗑️ User "${username}" removed.`);
			setError("");
			fetchUsers();
			setTimeout(() => setMessage(""), 3000);
		} catch {
			setError("❌ Failed to remove user.");
			setMessage("");
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const roleBadge = (role) => (
		<span
			className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
				role === "admin"
					? "bg-blue-100 text-blue-800"
					: "bg-gray-100 text-gray-700"
			}`}
		>
			{role === "admin" ? "👑 Admin" : "🙋 User"}
		</span>
	);

	return (
		<div>
			<Navbar />
			<div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow rounded-xl mt-6">
				<h1 className="text-2xl font-bold text-gray-800">
					Admin Panel
				</h1>

				{/* Feedback */}
				{message && (
					<div className="text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded text-sm text-center">
						{message}
					</div>
				)}
				{error && (
					<div className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded text-sm text-center">
						{error}
					</div>
				)}

				{/* User Form */}
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-2">
						Create New User
					</h2>

					<div>
						<label className="text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							className="mt-1 border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Username"
							value={form.username}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									username: e.target.value,
								}))
							}
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">
							Password
						</label>
						<div className="relative mt-1">
							<input
								type={showPassword ? "text" : "password"}
								className="border border-gray-300 rounded-md px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder="Password"
								value={form.password}
								onChange={(e) =>
									setForm((f) => ({
										...f,
										password: e.target.value,
									}))
								}
							/>
							<span
								className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer text-sm select-none"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "🙈" : "👁️"}
							</span>
						</div>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">
							Role
						</label>
						<select
							className="mt-1 border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
							value={form.role}
							onChange={(e) =>
								setForm((f) => ({ ...f, role: e.target.value }))
							}
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<button
						className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
						onClick={handleCreate}
					>
						Create User
					</button>
				</div>

				{/* User List */}
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
					<div className="flex justify-between items-center mb-3">
						<h2 className="font-semibold text-lg">All Users</h2>
						<div className="flex items-center gap-2">
							<label className="text-sm text-gray-600 mr-2">
								Filter by Role:
							</label>

							<select
								className="border border-gray-300 rounded-md px-3 py-1 text-sm"
								value={filterRole}
								onChange={(e) => setFilterRole(e.target.value)}
							>
								<option value="all">All Roles</option>
								<option value="admin">Admin</option>
								<option value="user">User</option>
							</select>
						</div>
					</div>
					<ul className="divide-y text-sm">
						{users
							.filter(
								(u) =>
									filterRole === "all" ||
									u.role === filterRole
							)
							.map((u, i) => (
								<li
									key={i}
									className="flex justify-between items-center py-2 px-2 hover:bg-white rounded transition"
								>
									<span className="text-gray-800 flex items-center">
										{u.username}
										{roleBadge(u.role)}
									</span>
									<button
										onClick={() =>
											setUserToRemove(u.username)
										}
										className="text-red-500 hover:underline text-sm"
									>
										Remove
									</button>
								</li>
							))}
					</ul>
				</div>
			</div>

			{/* Confirm Delete Modal */}
			{userToRemove && (
				<div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 transition-opacity">
					<div className="bg-white p-6 rounded-xl shadow-xl w-80 space-y-4 transition transform scale-100">
						<h3 className="text-lg font-semibold text-gray-800">
							Confirm Removal
						</h3>
						<p className="text-sm text-gray-600">
							Are you sure you want to remove{" "}
							<strong>{userToRemove}</strong>?
						</p>
						<div className="flex justify-end space-x-2">
							<button
								className="px-4 py-1 rounded bg-gray-200 text-sm"
								onClick={() => setUserToRemove(null)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-1 rounded bg-red-600 text-white text-sm"
								onClick={() => {
									handleRemove(userToRemove);
									setUserToRemove(null);
								}}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
