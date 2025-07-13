import { useState } from "react";

export default function ResumeForm({ onSubmit, formData = null }) {
	const initialState = {
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

	// 👇 Use existing data if passed, fallback to empty initial state
	const [form, setForm] = useState(() => formData || initialState);

	const [errors, setErrors] = useState({});

	const handleExperienceChange = (i, field, value) => {
		const updated = [...form.experience];
		updated[i][field] = value;
		setForm((prev) => ({ ...prev, experience: updated }));
	};

	const handleResponsibilityChange = (i, j, value) => {
		const updated = [...form.experience];
		updated[i].responsibilities[j] = value;
		setForm((prev) => ({ ...prev, experience: updated }));
	};

	const addResponsibility = (i) => {
		const updated = [...form.experience];
		updated[i].responsibilities.push("");
		setForm((prev) => ({ ...prev, experience: updated }));
	};

	const removeResponsibility = (i, j) => {
		const updated = [...form.experience];
		updated[i].responsibilities.splice(j, 1);
		setForm((prev) => ({ ...prev, experience: updated }));
	};

	const addExperience = () => {
		setForm((prev) => ({
			...prev,
			experience: [
				...prev.experience,
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
		}));
	};

	const removeExperience = (index) => {
		const updated = [...form.experience];
		updated.splice(index, 1);
		setForm((prev) => ({ ...prev, experience: updated }));
	};

	const validateForm = () => {
		const newErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!form.full_name.trim())
			newErrors.full_name = "Full name is required.";
		if (!form.job_title.trim())
			newErrors.job_title = "Job title is required.";
		if (!form.contact.phone.trim()) newErrors.phone = "Phone is required.";
		// if (!form.contact.email.match(emailRegex))
		if (!form.contact.email.trim())
			newErrors.email = "Valid email is required.";
		if (!form.professional_summary.trim())
			newErrors.professional_summary = "Summary is required.";
		if (!form.technical_skills.trim())
			newErrors.technical_skills = "Technical skills are required.";
		if (!form.education.degree.trim())
			newErrors.degree = "Degree is required.";
		if (!form.education.university.trim())
			newErrors.university = "University is required.";
		if (!form.education.gpa.trim()) newErrors.gpa = "GPA is required.";

		form.experience.forEach((exp, i) => {
			if (!exp.company.trim())
				newErrors[`exp_${i}_company`] = "Company is required.";
			if (!exp.location.trim())
				newErrors[`exp_${i}_location`] = "Location is required.";
			if (!exp.job_title.trim())
				newErrors[`exp_${i}_job_title`] = "Job title is required.";
			if (!exp.environment.trim())
				newErrors[`exp_${i}_environment`] = "Environment is required.";
			if (!exp.start_date.trim())
				newErrors[`exp_${i}_start`] = "Start date is required.";
			if (!exp.end_date.trim())
				newErrors[`exp_${i}_end`] = "End date is required.";
			if (
				exp.start_date &&
				exp.end_date &&
				new Date(exp.start_date) > new Date(exp.end_date)
			) {
				newErrors[`exp_${i}_end`] =
					"End date must be after start date.";
			}
			const validResps = exp.responsibilities.filter((r) => r.trim());
			if (validResps.length === 0) {
				newErrors[`exp_${i}_responsibilities`] =
					"At least one responsibility required.";
			}
			exp.responsibilities.forEach((resp, j) => {
				if (!resp.trim()) {
					newErrors[`exp_${i}_resp_${j}`] =
						"Responsibility cannot be empty.";
				}
			});
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			const cleaned = {
				...form,
				experience: form.experience.map((exp) => ({
					...exp,
					responsibilities: exp.responsibilities.filter((r) =>
						r.trim()
					),
				})),
			};
			onSubmit(cleaned);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white shadow-xl rounded-xl p-6 space-y-4 max-w-5xl mx-auto border border-gray-200"
		>
			<h2 className="text-2xl font-bold text-blue-800 border-b pb-2">
				Resume Builder
			</h2>

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
							value={section ? form[section][key] : form[key]}
							onChange={(e) =>
								section
									? setForm({
											...form,
											[section]: {
												...form[section],
												[key]: e.target.value,
											},
									  })
									: setForm({
											...form,
											[key]: e.target.value,
									  })
							}
						/>
						{errors[key] && (
							<p className="text-sm text-red-600">
								{errors[key]}
							</p>
						)}
					</div>
				))}
			</div>

			{/* Summary */}
			<div>
				<label className="block text-sm font-semibold mb-1">
					Professional Summary
				</label>
				<textarea
					className="w-full border p-2.5 rounded-md"
					rows={3}
					value={form.professional_summary}
					onChange={(e) =>
						setForm({
							...form,
							professional_summary: e.target.value,
						})
					}
				/>
				{errors.professional_summary && (
					<p className="text-sm text-red-600">
						{errors.professional_summary}
					</p>
				)}
			</div>

			{/* Skills */}
			<div>
				<label className="block text-sm font-semibold mb-1">
					Technical Skills
				</label>
				<textarea
					className="w-full border p-2.5 rounded-md"
					rows={3}
					value={form.technical_skills}
					onChange={(e) =>
						setForm({ ...form, technical_skills: e.target.value })
					}
				/>
				{errors.technical_skills && (
					<p className="text-sm text-red-600">
						{errors.technical_skills}
					</p>
				)}
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
							value={form.education[key]}
							onChange={(e) =>
								setForm({
									...form,
									education: {
										...form.education,
										[key]: e.target.value,
									},
								})
							}
						/>
						{errors[key] && (
							<p className="text-sm text-red-600">
								{errors[key]}
							</p>
						)}
					</div>
				))}
			</div>

			{/* Experience Sections */}
			{form.experience.map((exp, i) => (
				<div
					key={i}
					className="bg-gray-50 p-4 border rounded-lg space-y-3"
				>
					<div className="flex justify-between items-center">
						<h3 className="font-bold text-blue-700">
							Experience #{i + 1}
						</h3>
						{form.experience.length > 1 && (
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
								/>
								{errors[`exp_${i}_${key}`] && (
									<p className="text-sm text-red-600">
										{errors[`exp_${i}_${key}`]}
									</p>
								)}
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
						{errors[`exp_${i}_responsibilities`] && (
							<p className="text-sm text-red-600">
								{errors[`exp_${i}_responsibilities`]}
							</p>
						)}
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

			{/* Submit */}
			<div className="flex justify-center pt-2">
				<button
					type="submit"
					className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
				>
					Save Resume Details
				</button>
			</div>
		</form>
	);
}
