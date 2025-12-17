import { useState, useEffect, useRef } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import UserWithResumeForm from "../components/UserWithResumeForm";
import TemplatePreviewSection from "@/components/TemplatePreviewSection";
import PageFooter from "@/components/PageFooter";
import { Edit, Trash2 } from "lucide-react";

import { getUser } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
	const [users, setUsers] = useState([]);
	const [filterRole, setFilterRole] = useState("all");
	const [userToRemove, setUserToRemove] = useState(null);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const user = getUser();
	const navigate = useNavigate();

	const [userToEdit, setUserToEdit] = useState(null);
	const editFormRef = useRef(null);

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/signin");
		}
	}, [user, navigate]);

	// Scroll to edit form when userToEdit changes
	useEffect(() => {
		if (userToEdit && editFormRef.current) {
			setTimeout(() => {
				editFormRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 100); // Small delay to ensure form is rendered
		}
	}, [userToEdit]);

	const fetchUsers = async () => {
		try {
			const res = await API.get("/users");
			setUsers(res.data.users);
		} catch {
			setError("❌ Failed to fetch users.");
		}
	};

	const validateField = (key, value, isUpdate = false) => {
		if (key === "password") {
			// Password is optional when updating, but if provided must be at least 8 characters
			if (isUpdate) {
				if (value && value.length > 0 && value.length < 8)
					return "Password must be at least 8 characters.";
			} else {
				// Required when creating
				if (!value || value.length < 8)
					return "Password must be at least 8 characters.";
			}
		} else {
			if (!value || !value.trim()) return "This field is required.";
		}
		return "";
	};

	const validateFullForm = (form, isUpdate = false) => {
		const requiredFields = [
			"firstname",
			"lastname",
			"username",
			...(isUpdate ? [] : ["password"]), // Password only required when creating
			"job_role",
			"role",
			"template",
		];

		for (const key of requiredFields) {
			const error = validateField(key, form[key], isUpdate);
			if (error) {
				return `❌ ${
					key.charAt(0).toUpperCase() + key.slice(1)
				}: ${error}`;
			}
		}
		
		// Validate password separately if it's provided during update
		if (isUpdate && form.password) {
			const passwordError = validateField("password", form.password, true);
			if (passwordError) {
				return `❌ Password: ${passwordError}`;
			}
		}

		const resume = form.resume;
		if (!resume) return "❌ Resume data is missing.";

		// Flat resume fields
		const flatResumeFields = [
			"full_name",
			"job_title",
			"professional_summary",
			"technical_skills",
		];
		for (const key of flatResumeFields) {
			const error = validateField(key, resume[key]);
			if (error) return `❌ ${key.replace(/_/g, " ")}: ${error}`;
		}

		return ""; // All good
	};

	const handleCreate = async (fullForm) => {
		const validationError = validateFullForm(fullForm, false);
		if (validationError) {
			setError(validationError);
			setMessage("");
			return;
		}

		try {
			await API.post("/create-user", fullForm);
			setMessage(`✅ User "${fullForm.username}" created successfully.`);
			setError("");
			fetchUsers();
			setTimeout(() => setMessage(""), 3000);
		} catch (err) {
			const errorMsg = "❌ Failed to create user.";
			setError(`❌ ${errorMsg}`);
			setMessage("");
		}
	};

	const handleUpdate = async (updatedUser) => {
		const validationError = validateFullForm(updatedUser, true);
		if (validationError) {
			setError(validationError);
			setMessage("");
			return;
		}

		// Remove empty password and guest_password fields so backend doesn't update them
		const fieldsToUpdate = { ...updatedUser };
		if (!fieldsToUpdate.password || fieldsToUpdate.password.trim() === "") {
			delete fieldsToUpdate.password;
		}
		if (!fieldsToUpdate.guest_password || fieldsToUpdate.guest_password.trim() === "") {
			delete fieldsToUpdate.guest_password;
		}

		try {
			await API.post("/update-user", {
				username: updatedUser.username,
				updatedFields: fieldsToUpdate,
			});
			setMessage(`✏️ User "${updatedUser.username}" updated.`);
			setError("");
			setUserToEdit(null);
			fetchUsers();
			setTimeout(() => setMessage(""), 3000);
		} catch (err) {
			const errorMsg =
				err?.response?.data || err.message || "Failed to update user";
			setError(`❌ ${errorMsg}`);
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

	const roleBadge = (role) => (
		<span
			className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
				role === "admin"
					? "bg-blue-100 text-blue-800"
					: "bg-gray-100 text-gray-700"
			}`}
		>
			{role === "admin" ? "👑 Admin" : `🙋 ${role}`}
		</span>
	);

	const verifiedBadge = (user) => {
		if (user.role === "applier" && user.verified_applier) {
			return (
				<span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
					✓ Verified Applier
				</span>
			);
		}
		return null;
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />

			<main className="flex-1">
				{message && (
					<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
						<div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
							{message}
						</div>
					</div>
				)}
				{error && (
					<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
						<div className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
							{error}
						</div>
					</div>
				)}

				<div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow rounded-xl mt-20">
				<div className="text-left mb-4">
					<button
						onClick={() => navigate("/admin/dashboard")}
						className="px-4 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
					>
						← Back to Dashboard
					</button>
				</div>
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

				{/* Template Preview Section */}
				<TemplatePreviewSection />

				{/* ✅ Unified Form */}
				<UserWithResumeForm onSubmit={handleCreate} />

				{/* User List */}
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
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
								<option value="tier1">Tier1</option>
								<option value="tier2">Tier2</option>
								<option value="tier3">Tier3</option>
								<option value="tier4">Tier4</option>
								<option value="applier">Applier</option>
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
										{verifiedBadge(u)}
									</span>

									<div className="flex gap-4 items-center text-sm">
										<button
											onClick={() => setUserToEdit(u)}
											className="flex items-center text-blue-600 hover:underline"
										>
											<Edit className="w-4 h-4 mr-1" />
											<span>Edit</span>
										</button>
										<button
											onClick={() =>
												setUserToRemove(u.username)
											}
											className="flex items-center text-red-500 hover:underline"
										>
											<Trash2 className="w-4 h-4 mr-1" />
											<span>Remove</span>
										</button>
									</div>
								</li>
							))}
						{userToEdit && (
							<div ref={editFormRef} className="border-t pt-6 mt-6">
								<h3 className="text-xl font-semibold mb-2 text-indigo-800">
									Update User: {userToEdit.username}
								</h3>
								<UserWithResumeForm
									onSubmit={handleUpdate}
									initialData={userToEdit}
								/>
								<div className="text-right">
									<button
										onClick={() => setUserToEdit(null)}
										className="text-sm text-gray-600 underline"
									>
										Cancel Editing
									</button>
								</div>
							</div>
						)}
					</ul>
				</div>
				</div>
			</main>

			{/* Confirm Modal */}
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
			<PageFooter />
		</div>
	);
}
