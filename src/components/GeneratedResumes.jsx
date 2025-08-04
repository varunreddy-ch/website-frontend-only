import { useState, useEffect } from "react";
import API from "../api";
import { getUser } from "../auth";
import { extractTextFromPdfBase64 } from "../utils/pdfUtils";

export default function GeneratedResumes({ userId, fullName }) {
	const [userResumes, setUserResumes] = useState([]);
	const [resumesLoading, setResumesLoading] = useState(false);
	const [copiedIndex, setCopiedIndex] = useState(-1);
	const [pendingApplyResumeId, setPendingApplyResumeId] = useState("");
	const [applyMessage, setApplyMessage] = useState("");
	const [applyError, setApplyError] = useState("");
	const [applyingId, setApplyingId] = useState("");

	const [pendingDeleteJobId, setPendingDeleteJobId] = useState("");
	const [deletingId, setDeletingId] = useState("");
	const [deleteError, setDeleteError] = useState("");
	const [deleteMessage, setDeleteMessage] = useState("");

	const [pendingExpireJobId, setPendingExpireJobId] = useState("");
	const [expiringId, setExpiringId] = useState("");
	const [expireError, setExpireError] = useState("");
	const [expireMessage, setExpireMessage] = useState("");

	const user = getUser();

	const isApplier = user.role === "applier";

	const fetchResumes = async () => {
		setResumesLoading(true);
		try {
			const res = await API.get(
				`/get_generated_resumes?user_id=${userId}`
			);
			setUserResumes(res.data || []);
		} catch (err) {
			console.error("Failed to fetch resumes:", err);
			setUserResumes([]);
		} finally {
			setResumesLoading(false);
		}
	};

	useEffect(() => {
		if (userId) fetchResumes();
	}, [userId]);

	useEffect(() => {
		if (expireMessage || expireError) {
			const timeout = setTimeout(() => {
				setExpireMessage("");
				setExpireError("");
			}, 2500);
			return () => clearTimeout(timeout);
		}
	}, [expireMessage, expireError]);

	useEffect(() => {
		if (applyMessage || applyError) {
			const timeout = setTimeout(() => {
				setApplyMessage("");
				setApplyError("");
			}, 2500);
			return () => clearTimeout(timeout);
		}
	}, [applyMessage, applyError]);

	const handleDownloadJD = (jd, companyName) => {
		const a = document.createElement("a");
		const file = new Blob([jd], { type: "text/plain" });
		a.href = URL.createObjectURL(file);
		a.download = `${fullName}_${companyName || "JobDesc"}_JD.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	// Clear messages after a short time
	useEffect(() => {
		if (deleteMessage || deleteError) {
			const t = setTimeout(() => {
				setDeleteMessage("");
				setDeleteError("");
			}, 2500);
			return () => clearTimeout(t);
		}
	}, [deleteMessage, deleteError]);

	const handleCopyAnswer = (answer, idx) => {
		navigator.clipboard.writeText(answer);
		setCopiedIndex(idx);
		setTimeout(() => setCopiedIndex(-1), 1200);
	};

	const requestApply = (resumeId) => setPendingApplyResumeId(resumeId);

	const confirmApply = async () => {
		setApplyingId(pendingApplyResumeId);
		setApplyMessage("");
		setApplyError("");
		setPendingApplyResumeId("");
		try {
			await API.post(`/mark_applied/${pendingApplyResumeId}`);
			setUserResumes((prev) =>
				prev.filter((r) => r._id !== pendingApplyResumeId)
			);
			setApplyMessage("Marked as applied!");
		} catch (err) {
			console.error("Failed to mark as applied:", err);
			setApplyError("Failed to mark as applied.");
		} finally {
			setApplyingId("");
		}
	};

	const cancelApply = () => setPendingApplyResumeId("");

	// Trigger the confirmation modal
	const requestDeleteJob = (jobId) => {
		setPendingDeleteJobId(jobId);
	};

	// On confirm, call backend and prune list
	const confirmDeleteJob = async () => {
		setDeletingId(pendingDeleteJobId);
		setDeleteError("");
		setDeleteMessage("");
		try {
			await API.delete(`/jobs/${pendingDeleteJobId}`);
			// Remove all resumes for this job
			setUserResumes((prev) =>
				prev.filter((r) => r.jobId !== pendingDeleteJobId)
			);
			setDeleteMessage("Job and its resumes deleted.");
		} catch (err) {
			console.error("Failed to delete job:", err);
			setDeleteError("Could not delete job. Try again.");
		} finally {
			setDeletingId("");
			setPendingDeleteJobId("");
		}
	};

	const cancelDelete = () => setPendingDeleteJobId("");

	const handleCopyJDAndResume = async (jd, resumeBase64, companyName) => {
		if (!jd && !resumeBase64) {
			alert("Nothing to copy.");
			return;
		}

		let resumeText = "";
		if (resumeBase64) {
			resumeText = await extractTextFromPdfBase64(resumeBase64);
		}

		let contentToCopy = `Job Description for ${
			companyName || "Company"
		}:\n\n${jd || "N/A"}\n\n`;

		contentToCopy += `You are simulating a job application assistant. For each question, generate a response written in the first person, as if the candidate is filling out a job application form. Each answer should be concise, approximately 100 words, and must be based only on the candidate’s resume and the job description
				Here is the resume text:\n\n`;

		if (resumeText) {
			contentToCopy += `\n\n--- Resume ---\n${resumeText}`;
		}

		try {
			await navigator.clipboard.writeText(contentToCopy);
			setApplyMessage("JD and resume copied to clipboard!");
		} catch (err) {
			console.error("Copy failed:", err);
			setApplyError("Failed to copy to clipboard.");
		}
	};

	const requestExpireJob = (jobId) => {
		setPendingExpireJobId(jobId);
	};

	const cancelExpire = () => setPendingExpireJobId("");

	const confirmExpireJob = async () => {
		setExpiringId(pendingExpireJobId);
		setExpireMessage("");
		setExpireError("");

		try {
			await API.delete(`/jobs/expire/${pendingExpireJobId}`);
			setUserResumes((prev) =>
				prev.filter((r) => r.jobId !== pendingExpireJobId)
			);
			setExpireMessage("Job marked as expired.");
		} catch (err) {
			console.error("Failed to mark job as expired:", err);
			setExpireError("Could not mark job as expired. Try again.");
		} finally {
			setExpiringId("");
			setPendingExpireJobId("");
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-md p-6 mt-8">
			<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
				💼 TOP JOB PICKS FOR YOU 💼
			</h2>

			<div className="flex justify-end mb-6 px-4">
				<button
					onClick={fetchResumes}
					disabled={resumesLoading}
					className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow disabled:opacity-50 ml-4"
				>
					{resumesLoading ? "Refreshing..." : "Refresh"}
				</button>
			</div>

			{applyError && (
				<p className="text-center text-sm text-red-600 bg-red-100 py-2 rounded mb-4">
					{applyError}
				</p>
			)}
			{applyMessage && (
				<p className="text-center text-sm text-blue-600 bg-blue-100 py-2 rounded mb-4">
					{applyMessage}
				</p>
			)}

			{expireError && (
				<p className="text-red-600 text-center">{expireError}</p>
			)}
			{expireMessage && (
				<p className="text-yellow-700 text-center">{expireMessage}</p>
			)}

			{deleteError && (
				<p className="text-red-600 text-center">{deleteError}</p>
			)}
			{deleteMessage && (
				<p className="text-blue-600 text-center">{deleteMessage}</p>
			)}

			{/* Soft Confirmation Modal */}
			{pendingApplyResumeId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl">
						<h3 className="text-lg font-bold text-center text-gray-800">
							Confirm Apply
						</h3>
						<p className="text-center text-gray-600">
							Are you sure you want to mark this resume as
							applied? It will no longer appear on your dashboard.
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={cancelApply}
								className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={confirmApply}
								disabled={applyingId === pendingApplyResumeId}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								{applyingId === pendingApplyResumeId
									? "Applying..."
									: "Confirm"}
							</button>
						</div>
					</div>
				</div>
			)}

			{pendingDeleteJobId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl">
						<h3 className="text-lg font-bold text-center">
							Confirm Delete
						</h3>
						<p className="text-center">
							This will delete the job and <strong>all</strong>{" "}
							associated resumes. Are you sure?
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={cancelDelete}
								className="px-4 py-2 rounded border"
							>
								Cancel
							</button>
							<button
								onClick={confirmDeleteJob}
								disabled={deletingId === pendingDeleteJobId}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
							>
								{deletingId === pendingDeleteJobId
									? "Deleting..."
									: "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{pendingExpireJobId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl">
						<h3 className="text-lg font-bold text-center">
							Mark Job as Expired
						</h3>
						<p className="text-center">
							This will mark the job as expired and remove
							associated resumes. Are you sure?
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={cancelExpire}
								className="px-4 py-2 rounded border"
							>
								Cancel
							</button>
							<button
								onClick={confirmExpireJob}
								disabled={expiringId === pendingExpireJobId}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
							>
								{expiringId === pendingExpireJobId
									? "Processing..."
									: "Confirm"}
							</button>
						</div>
					</div>
				</div>
			)}

			{resumesLoading ? (
				<div className="text-center text-gray-400">
					Loading resumes...
				</div>
			) : userResumes.length === 0 ? (
				<div className="text-center text-gray-400 italic">
					No resumes generated yet.
				</div>
			) : (
				<div className="space-y-6">
					{userResumes.map((resume, idx) => (
						<div
							key={resume._id || idx}
							className="bg-gray-50 border border-gray-200 rounded-lg p-4"
						>
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
								<div className="min-w-0 flex-1">
									<p className="text-lg font-semibold text-gray-800">
										{resume.job_title == "Unknown Title"
											? resume.company_name
											: `${resume.job_title} at ${resume.company_name}`}
									</p>
									<p className="text-sm text-gray-500">
										Generated:{" "}
										{resume.created_at
											? new Date(
													resume.created_at
											  ).toLocaleString()
											: "Unknown"}
									</p>
									{resume.company_link && (
										<div className="mt-1 flex items-center gap-2 text-sm text-blue-600 sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden">
											<a
												href={resume.company_link}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline truncate"
												style={{ maxWidth: "16rem" }}
											>
												{resume.company_link}
											</a>
											<button
												className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap"
												onClick={() =>
													navigator.clipboard.writeText(
														resume.company_link
													)
												}
											>
												Copy
											</button>
										</div>
									)}
									<button
										onClick={() =>
											handleCopyJDAndResume(
												resume.JD,
												resume.resume,
												resume.company_name
											)
										}
										className="inline-flex items-center justify-center min-w-[140px] h-9 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 rounded-md shadow-sm transition-all"
									>
										Copy JD + Resume
									</button>
								</div>

								<div className="flex flex-wrap justify-end gap-2 mt-2 sm:mt-0">
									{resume.resume && (
										<a
											href={`data:application/pdf;base64,${resume.resume}`}
											download={`${fullName}_${
												resume.company_name || "Resume"
											}.pdf`}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center justify-center min-w-[140px] h-9 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 rounded-md shadow-sm"
										>
											Download PDF
										</a>
									)}

									{resume.JD && resume.JD.trim() && (
										<button
											onClick={() =>
												handleDownloadJD(
													resume.JD,
													resume.company_name
												)
											}
											className="inline-flex items-center justify-center min-w-[140px] h-9 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 rounded-md shadow-sm"
										>
											Download JD
										</button>
									)}

									{isApplier &&
										resume.jobId &&
										resume.JD.trim() && (
											<button
												onClick={() =>
													requestExpireJob(
														resume.jobId
													)
												}
												className="inline-flex items-center justify-center min-w-[140px] h-9 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 rounded-md shadow-sm"
											>
												Mark as Expired
											</button>
										)}

									{isApplier &&
										resume.jobId &&
										resume.JD.trim() && (
											<button
												onClick={() =>
													requestDeleteJob(
														resume.jobId
													)
												}
												className="inline-flex items-center justify-center min-w-[140px] h-9 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 rounded-md shadow-sm"
											>
												Delete JOB
											</button>
										)}

									<button
										onClick={() => requestApply(resume._id)}
										disabled={applyingId === resume._id}
										className={`inline-flex items-center justify-center min-w-[140px] h-9 text-sm font-medium px-4 rounded-md shadow-sm ${
											applyingId === resume._id
												? "bg-blue-100 text-blue-800 opacity-50 cursor-not-allowed"
												: "bg-blue-100 hover:bg-blue-200 text-blue-800"
										}`}
									>
										{applyingId === resume._id
											? "Applying..."
											: "Mark as Applied"}
									</button>
								</div>
							</div>
							{resume.JD && (
								<details className="mt-3">
									<summary className="cursor-pointer text-sm font-medium text-gray-700">
										Show Job Description
									</summary>
									<div className="mt-2 bg-white border rounded p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
										{resume.JD}
									</div>
								</details>
							)}

							{Array.isArray(resume.answers) &&
								resume.answers.length > 0 && (
									<details className="mt-4">
										<summary className="cursor-pointer font-semibold text-gray-700">
											Job Q &amp; A
										</summary>
										<div className="mt-3 space-y-3">
											{resume.answers.map((qa, i) => (
												<div
													key={i}
													className="bg-gray-100 rounded p-3 text-sm space-y-1"
												>
													{qa.question && (
														<p className="text-blue-900 font-medium">
															Q: {qa.question}
														</p>
													)}
													{qa.answer && (
														<div className="flex justify-between items-start">
															<p className="text-gray-800 whitespace-pre-wrap">
																<strong>
																	A:
																</strong>{" "}
																{qa.answer}
															</p>
															<button
																onClick={() =>
																	handleCopyAnswer(
																		qa.answer,
																		i
																	)
																}
																className="ml-4 bg-green-200 hover:bg-green-300 text-green-800 text-xs px-3 py-1 rounded"
															>
																{copiedIndex ===
																i
																	? "Copied!"
																	: "Copy"}
															</button>
														</div>
													)}
												</div>
											))}
										</div>
									</details>
								)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
