import { useState } from "react";

export default function UserWithResumeForm({ onSubmit }) {
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
				responsibilities: [""],
			},
		],
	};

	const [form, setForm] = useState({
		username: "",
		password: "",
		role: "user",
		resume: initialResume,
	});

	const handleChange = (section, key, value) => {
		if (section === "root") {
			setForm({ ...form, [key]: value });
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

	const handleResponsibilityChange = (i, j, value) => {
		const updated = [...form.resume.experience];
		updated[i].responsibilities[j] = value;
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
						responsibilities: [""],
					},
				],
			},
		}));
	};

	const addResponsibility = (i) => {
		const updated = [...form.resume.experience];
		updated[i].responsibilities.push("");
		setForm((prev) => ({
			...prev,
			resume: {
				...prev.resume,
				experience: updated,
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

	const removeResponsibility = (i, j) => {
		const updated = [...form.resume.experience];
		updated[i].responsibilities.splice(j, 1);
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
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{[
					["Username", "username"],
					["Password", "password"],
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
						<option value="admin">Admin</option>
					</select>
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
					<div className="space-y-2">
						<label className="block text-sm font-semibold mb-1">
							Responsibilities
						</label>
						{exp.responsibilities.map((resp, j) => (
							<div key={j} className="flex gap-2">
								<textarea
									className="w-full border p-2.5 rounded-md"
									value={resp}
									placeholder={`Responsibility #${j + 1}`}
									onChange={(e) =>
										handleResponsibilityChange(
											i,
											j,
											e.target.value
										)
									}
									required
								/>
								{exp.responsibilities.length > 1 && (
									<button
										type="button"
										onClick={() =>
											removeResponsibility(i, j)
										}
										className="text-red-500 font-bold px-2"
										title="Remove"
									>
										×
									</button>
								)}
							</div>
						))}
						<button
							type="button"
							onClick={() => addResponsibility(i)}
							className="text-sm text-blue-600 hover:underline"
						>
							+ Add Responsibility
						</button>
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
