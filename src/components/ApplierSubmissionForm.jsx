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

		// JS validation for required fields
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
				.filter((q) => q.length > 0), // remove empty questions
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
			setMessage("Submission failed");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white rounded-lg shadow-lg p-4 space-y-4 mt-4"
		>
			<h2 className="text-lg font-semibold text-blue-800 text-center">
				Applier Submission
			</h2>
			{formError && (
				<div className="text-center rounded py-2 text-sm bg-red-100 text-red-700">
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
				>
					{message}
				</div>
			)}
			<div>
				<label className="block text-sm font-semibold mb-1">
					Company Name
				</label>
				<input
					type="text"
					className="w-full border p-2.5 rounded-md"
					value={applierData.company_name}
					onChange={(e) =>
						handleChange("company_name", e.target.value)
					}
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-semibold mb-1">
					Job Description
				</label>
				<textarea
					className="w-full border p-2.5 rounded-md"
					rows={3}
					value={applierData.job_description}
					onChange={(e) =>
						handleChange("job_description", e.target.value)
					}
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-semibold mb-1">
					Link to Apply
				</label>
				<input
					type="url"
					className="w-full border p-2.5 rounded-md"
					value={applierData.job_link}
					onChange={(e) => handleChange("job_link", e.target.value)}
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-semibold mb-1">
					Questions (optional)
				</label>
				{applierData.questions.map((q, idx) => (
					<div className="flex items-center mb-2" key={idx}>
						<input
							type="text"
							className="w-full border p-2.5 rounded-md"
							value={q}
							onChange={(e) =>
								handleQuestionChange(idx, e.target.value)
							}
							placeholder={`Question ${idx + 1}`}
						/>
						{applierData.questions.length > 1 && (
							<button
								type="button"
								onClick={() => removeQuestion(idx)}
								className="ml-2 text-red-600 hover:underline"
							>
								Remove
							</button>
						)}
					</div>
				))}
				<button
					type="button"
					onClick={addQuestion}
					className="text-blue-600 hover:text-blue-800 text-sm mt-2"
				>
					+ Add Question
				</button>
			</div>
			<div className="flex justify-center pt-2">
				<button
					type="submit"
					disabled={submitting}
					className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-2 rounded shadow-md hover:shadow-lg transition-all duration-300"
				>
					{submitting ? "Submitting..." : "Submit Applier Info"}
				</button>
			</div>
		</form>
	);
}
