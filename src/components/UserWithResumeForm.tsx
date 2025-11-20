import { useState, useEffect } from "react";

export default function UserWithResumeForm({ onSubmit, initialData = null }) {
	const initialResume = {
		full_name: "",
		job_title: "",
		contact: { phone: "", email: "" },
		professional_summary: "",
		technical_skills: "",
		education: { degree: "", university: "", gpa: "" },
		experience: [
			{
				company: "",
				location: "",
				start_date: "",
				end_date: "",
				job_title: "",
				environment: "",
				responsibilities: "", // Changed from array to string
			},
		],
	};

	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		username: "",
		password: "",
		job_role: "",
		role: "user",
		summary_points: 0,
		experience_points: 0,
		complete_change: false,
		verified_applier: false,
		template: "",
		resume: initialResume,
	});

	useEffect(() => {
		if (initialData) {
			setForm((prev) => ({
				...prev,
				...initialData,
				resume: {
					...initialResume,
					...(initialData.resume || {}),
					contact: {
						...initialResume.contact,
						...(initialData.resume?.contact || {}),
					},
					education: {
						...initialResume.education,
						...(initialData.resume?.education || {}),
					},
					experience:
						initialData.resume?.experience?.length > 0
							? initialData.resume.experience
							: initialResume.experience,
				},
			}));
		}
	}, [initialData]);

	const handleChange = (section, key, value) => {
		if (section === "root") {
			// Reset verified_applier if role changes away from "applier"
			if (key === "role" && value !== "applier") {
				setForm({ ...form, [key]: value, verified_applier: false });
			} else {
				setForm({ ...form, [key]: value });
			}
		} else if (section === "contact" || section === "education") {
			setForm({
				...form,
				resume: {
					...form.resume,
					[section]: {
						...form.resume[section],
						[key]: value,
					},
				},
			});
		} else {
			setForm({
				...form,
				resume: {
					...form.resume,
					[key]: value,
				},
			});
		}
	};

	const handleExperienceChange = (i, key, value) => {
		const updated = [...form.resume.experience];
		updated[i][key] = value;
		setForm((prev) => ({
			...prev,
			resume: {
				...prev.resume,
				experience: updated,
			},
		}));
	};

	const addExperience = () => {
		setForm((prev) => ({
			...prev,
			resume: {
				...prev.resume,
				experience: [
					...prev.resume.experience,
					{
						company: "",
						location: "",
						start_date: "",
						end_date: "",
						job_title: "",
						environment: "",
						responsibilities: "",
					},
				],
			},
		}));
	};

	const removeExperience = (i) => {
		const updated = [...form.resume.experience];
		updated.splice(i, 1);
		setForm((prev) => ({
			...prev,
			resume: {
				...prev.resume,
				experience: updated,
			},
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white shadow-xl rounded-xl p-6 space-y-6 max-w-5xl mx-auto border border-gray-200"
		>
			<h2 className="text-2xl font-bold text-blue-800 border-b pb-2">
				Create User + Resume
			</h2>

			{/* User Account Fields */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{[
					["Firstname", "firstname"],
					["Lastname", "lastname"],
					["Username", "username"],
					["Password", "password"],
					["Template", "template"],
				].map(([label, key]) => (
					<div key={key}>
						<label className="block text-sm font-semibold mb-1">
							{label}
						</label>
						<input
							type={key === "password" ? "password" : "text"}
							className="w-full border p-2.5 rounded-md"
							value={form[key]}
							onChange={(e) =>
								handleChange("root", key, e.target.value)
							}
							required
						/>
					</div>
				))}

				<div>
					<label className="block text-sm font-semibold mb-1">
						Job Role
					</label>
					<select
						className="w-full border p-2.5 rounded-md"
						value={form.job_role}
						onChange={(e) =>
							handleChange("root", "job_role", e.target.value)
						}
						required
					>
					<option value="" disabled>
						Select Job Role
					</option>
					<option value="SDE">Software Developer</option>
					<option value="SDE_beta">Software Developer (Beta)</option>
					<option value="DATA ENGINEER">Data Engineer</option>
					<option value=".NET">.NET</option>
					<option value="DevOps">DevOps</option>
					<option value="AIML">AI/ML</option>
					<option value="DataAnalyst">Data Analyst</option>
					<option value="default">default</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-semibold mb-1">
						Summary Points
					</label>
					<input
						type="number"
						min={0}
						className="w-full border p-2.5 rounded-md"
						value={form.summary_points}
						onChange={(e) =>
							handleChange(
								"root",
								"summary_points",
								parseInt(e.target.value) || 0
							)
						}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-semibold mb-1">
						Experience Points
					</label>
					<input
						type="number"
						min={0}
						className="w-full border p-2.5 rounded-md"
						value={form.experience_points}
						onChange={(e) =>
							handleChange(
								"root",
								"experience_points",
								parseInt(e.target.value) || 0
							)
						}
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold mb-1">
						Role
					</label>
					<select
						className="w-full border p-2.5 rounded-md"
						value={form.role}
						onChange={(e) =>
							handleChange("root", "role", e.target.value)
						}
						required
					>
						<option value="user">User</option>
						<option value="tier1">Tier 1</option>
						<option value="tier2">Tier 2</option>
						<option value="tier3">Tier 3</option>
						<option value="tier4">Tier 4</option>
						<option value="applier">Applier</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<div className="flex items-center justify-center col-span-1 md:col-span-2">
					<input
						type="checkbox"
						id="complete_change"
						className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
						checked={form.complete_change}
						onChange={(e) =>
							handleChange(
								"root",
								"complete_change",
								e.target.checked
							)
						}
					/>
					<label
						htmlFor="complete_change"
						className="ml-2 text-sm font-semibold text-gray-900"
					>
						Enable Complete Change
					</label>
				</div>

				<div className="flex items-center justify-center col-span-1 md:col-span-2">
					<input
						type="checkbox"
						id="verified_applier"
						className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
						checked={form.verified_applier}
						onChange={(e) =>
							handleChange(
								"root",
								"verified_applier",
								e.target.checked
							)
						}
						disabled={form.role !== "applier"}
					/>
					<label
						htmlFor="verified_applier"
						className={`ml-2 text-sm font-semibold ${
							form.role !== "applier"
								? "text-gray-400"
								: "text-gray-900"
						}`}
					>
						Verified Applier (Auto-verify jobs)
					</label>
				</div>
			</div>

			{/* Contact Fields */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{[
					["Full Name", "full_name"],
					["Job Title", "job_title"],
					["Phone", "phone", "contact"],
					["Email", "email", "contact"],
				].map(([label, key, section]) => (
					<div key={key}>
						<label className="block text-sm font-semibold mb-1">
							{label}
						</label>
						<input
							className="w-full border p-2.5 rounded-md"
							value={
								section
									? form.resume[section][key]
									: form.resume[key]
							}
							onChange={(e) =>
								section
									? handleChange(section, key, e.target.value)
									: handleChange(null, key, e.target.value)
							}
							required
						/>
					</div>
				))}
			</div>

			{/* Summary and Skills */}
			<div>
				<label className="block text-sm font-semibold mb-1">
					Professional Summary
				</label>
				<textarea
					className="w-full border p-2.5 rounded-md"
					rows={3}
					value={form.resume.professional_summary}
					onChange={(e) =>
						handleChange(
							null,
							"professional_summary",
							e.target.value
						)
					}
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-semibold mb-1">
					Technical Skills
				</label>
				<textarea
					className="w-full border p-2.5 rounded-md"
					rows={3}
					value={form.resume.technical_skills}
					onChange={(e) =>
						handleChange(null, "technical_skills", e.target.value)
					}
					required
				/>
			</div>

			{/* Education */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{["degree", "university", "gpa"].map((key) => (
					<div key={key}>
						<label className="block text-sm font-semibold mb-1">
							{key === "gpa"
								? "GPA"
								: key.charAt(0).toUpperCase() + key.slice(1)}
						</label>
						<input
							className="w-full border p-2.5 rounded-md"
							value={form.resume.education[key]}
							onChange={(e) =>
								handleChange("education", key, e.target.value)
							}
							required
						/>
					</div>
				))}
			</div>

			{/* Experience */}
			{form.resume.experience.map((exp, i) => (
				<div
					key={i}
					className="bg-gray-50 p-4 border rounded-lg space-y-3"
				>
					<div className="flex justify-between items-center">
						<h3 className="font-bold text-blue-700">
							Experience #{i + 1}
						</h3>
						{form.resume.experience.length > 1 && (
							<button
								type="button"
								onClick={() => removeExperience(i)}
								className="text-red-600 text-sm hover:underline"
							>
								Remove
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[
							["Company", "company"],
							["Location", "location"],
							["Job Title", "job_title"],
							["Environment", "environment"],
							["Start Date", "start_date"],
							["End Date", "end_date"],
						].map(([label, key]) => (
							<div key={key}>
								<label className="block text-sm font-semibold mb-1">
									{label}
								</label>
								<input
									className="w-full border p-2.5 rounded-md"
									value={exp[key]}
									onChange={(e) =>
										handleExperienceChange(
											i,
											key,
											e.target.value
										)
									}
									required
								/>
							</div>
						))}
					</div>

					{/* Responsibilities */}
					<div>
						<label className="block text-sm font-semibold mb-1">
							Responsibilities
						</label>
						<textarea
							className="w-full border p-2.5 rounded-md"
							rows={3}
							value={exp.responsibilities}
							onChange={(e) =>
								handleExperienceChange(
									i,
									"responsibilities",
									e.target.value
								)
							}
							required
						/>
					</div>
				</div>
			))}

			{/* Add Experience Button */}
			<div className="flex justify-center">
				<button
					type="button"
					onClick={addExperience}
					className="text-blue-600 hover:text-blue-800 font-medium"
				>
					+ Add Experience
				</button>
			</div>

			{/* Submit Button */}
			<div className="flex justify-center pt-2">
				<button
					type="submit"
					className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
				>
					Submit User & Resume
				</button>
			</div>
		</form>
	);
}
