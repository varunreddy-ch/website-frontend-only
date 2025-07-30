import { useState } from "react";
import API from "../api";

export default function ApplierSubmissionForm() {
	const [applierData, setApplierData] = useState({
		company_name: "",
		job_description: "",
		job_link: "",
		questions: [""],
	});
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState("");
	const [message, setMessage] = useState("");

	const handleChange = (key, value) => {
		setApplierData((prev) => ({ ...prev, [key]: value }));
	};

	const handleQuestionChange = (idx, value) => {
		setApplierData((prev) => ({
			...prev,
			questions: prev.questions.map((q, i) => (i === idx ? value : q)),
		}));
	};

	const addQuestion = () => {
		setApplierData((prev) => ({
			...prev,
			questions: [...prev.questions, ""],
		}));
	};

	const removeQuestion = (idx) => {
		setApplierData((prev) => ({
			...prev,
			questions: prev.questions.filter((_, i) => i !== idx),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormError("");
		setMessage("");
		setSubmitting(true);

		if (
			!applierData.company_name.trim() ||
			!applierData.job_description.trim() ||
			!applierData.job_link.trim()
		) {
			setFormError(
				"Company name, Job description, and Link to apply are required."
			);
			setSubmitting(false);
			return;
		}

		const payload = {
			company_name: applierData.company_name.trim(),
			job_description: applierData.job_description.trim(),
			job_link: applierData.job_link.trim(),
			questions: applierData.questions
				.map((q) => q.trim())
				.filter((q) => q.length > 0),
		};

		try {
			await API.post("/add-job", payload);
			setMessage("Application info submitted!");
			setApplierData({
				company_name: "",
				job_description: "",
				job_link: "",
				questions: [""],
			});
		} catch (err) {
			const msg = err.response?.data || err.message || "Unknown error";
			setMessage("Submission failed: " + msg);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			data-lov-id="applier-form"
			className="bg-white max-w-4xl mx-auto rounded-2xl shadow-xl p-8 space-y-6"
		>
			<h2
				className="text-2xl font-bold text-center text-blue-700"
				data-lov-id="applier-form-heading"
			>
				Applier Submission
			</h2>

			{formError && (
				<div
					className="text-center rounded py-2 text-sm bg-red-100 text-red-700"
					data-lov-id="form-error"
				>
					{formError}
				</div>
			)}

			{message && (
				<div
					className={`text-center rounded py-2 text-sm ${
						message.includes("failed")
							? "bg-red-100 text-red-700"
							: "bg-green-100 text-green-700"
					}`}
					data-lov-id="form-message"
				>
					{message}
				</div>
			)}

			<div className="space-y-2">
				<label className="block text-sm font-semibold text-gray-700">
					Company Name
				</label>
				<input
					type="text"
					data-lov-id="company-name"
					className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
					value={applierData.company_name}
					onChange={(e) =>
						handleChange("company_name", e.target.value)
					}
					required
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-semibold text-gray-700">
					Job Description
				</label>
				<textarea
					data-lov-id="job-description"
					className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
					rows={4}
					value={applierData.job_description}
					onChange={(e) =>
						handleChange("job_description", e.target.value)
					}
					required
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-semibold text-gray-700">
					Link to Apply
				</label>
				<input
					type="url"
					data-lov-id="job-link"
					className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
					value={applierData.job_link}
					onChange={(e) => handleChange("job_link", e.target.value)}
					required
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-sm font-semibold text-gray-700">
					Questions <span className="text-gray-400">(optional)</span>
				</label>

				{applierData.questions.map((q, idx) => (
					<div className="w-full flex gap-2 mb-2" key={idx}>
						<input
							type="text"
							data-lov-id={`question-${idx}`}
							className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
							value={q}
							onChange={(e) =>
								handleQuestionChange(idx, e.target.value)
							}
							placeholder={`Question ${idx + 1}`}
						/>
						{applierData.questions.length > 1 && (
							<button
								type="button"
								data-lov-id={`remove-question-${idx}`}
								onClick={() => removeQuestion(idx)}
								className="text-red-500 hover:underline text-sm"
							>
								Remove
							</button>
						)}
					</div>
				))}

				<div className="flex justify-center">
					<button
						type="button"
						onClick={addQuestion}
						data-lov-id="add-question"
						className="text-blue-600 hover:text-blue-800 text-sm font-medium"
					>
						+ Add Question
					</button>
				</div>
			</div>

			<div className="pt-4">
				<button
					type="submit"
					disabled={submitting}
					data-lov-id="submit-applier"
					className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
				>
					{submitting ? "Submitting..." : "Submit Applier Info"}
				</button>
			</div>
		</form>
	);
}
