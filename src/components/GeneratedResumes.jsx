import { useState, useEffect } from "react";
import API from "../api";

export default function GeneratedResumes({ userId, fullName }) {
	const [userResumes, setUserResumes] = useState([]);
	const [resumesLoading, setResumesLoading] = useState(false);
	const [copiedIndex, setCopiedIndex] = useState(-1);
	const [deletingId, setDeletingId] = useState("");
	const [pendingDeleteResumeId, setPendingDeleteResumeId] = useState(""); // New for soft warning
	const [deleteMessage, setDeleteMessage] = useState("");
	const [deleteError, setDeleteError] = useState("");

	useEffect(() => {
		async function fetchResumes() {
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
		}
		if (userId) fetchResumes();
	}, [userId]);

	useEffect(() => {
		if (deleteMessage || deleteError) {
			const timeout = setTimeout(() => {
				setDeleteMessage("");
				setDeleteError("");
			}, 2500);
			return () => clearTimeout(timeout);
		}
	}, [deleteMessage, deleteError]);

	const handleDownloadJD = (jd, companyName) => {
		const a = document.createElement("a");
		const file = new Blob([jd], { type: "text/plain" });
		a.href = URL.createObjectURL(file);
		a.download = `${fullName}_${companyName || "JobDesc"}_JD.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const handleCopyAnswer = (answer, idx) => {
		navigator.clipboard.writeText(answer);
		setCopiedIndex(idx);
		setTimeout(() => setCopiedIndex(-1), 1200);
	};

	const requestDelete = (resumeId) => {
		setPendingDeleteResumeId(resumeId); // Show custom warning
	};

	const confirmDelete = async () => {
		const resumeId = pendingDeleteResumeId;
		setDeletingId(resumeId);
		setDeleteError("");
		setDeleteMessage("");
		setPendingDeleteResumeId(""); // Hide modal
		try {
			await API.delete(`/delete_generated_resume/${resumeId}`);
			setUserResumes((prev) => prev.filter((r) => r._id !== resumeId));
			setDeleteMessage("Resume deleted successfully.");
		} catch (err) {
			console.error("Failed to delete resume:", err);
			setDeleteError("Failed to delete resume.");
		} finally {
			setDeletingId("");
		}
	};

	const cancelDelete = () => setPendingDeleteResumeId("");

	return (
		<div className="bg-white rounded-lg shadow-lg p-4 mt-8">
			<h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
				Your Generated Resumes
			</h2>
			{deleteError && (
				<div className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded text-sm text-center mb-2">
					{deleteError}
				</div>
			)}
			{deleteMessage && (
				<div className="text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded text-sm text-center mb-2">
					{deleteMessage}
				</div>
			)}

			{/* SOFT CONFIRM DELETE MODAL */}
			{pendingDeleteResumeId && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs space-y-4">
						<h3 className="text-lg font-semibold text-gray-800 text-center">
							Delete Resume
						</h3>
						<p className="text-gray-700 text-center">
							Are you sure you want to delete this resume?
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={cancelDelete}
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
							>
								Cancel
							</button>
							<button
								onClick={confirmDelete}
								className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
								disabled={deletingId === pendingDeleteResumeId}
							>
								{deletingId === pendingDeleteResumeId
									? "Deleting..."
									: "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{resumesLoading ? (
				<div className="text-center text-gray-400">Loading...</div>
			) : userResumes.length === 0 ? (
				<div className="text-center text-gray-400 italic">
					No resumes generated yet.
				</div>
			) : (
				<div className="space-y-6">
					{userResumes.map((resume, idx) => (
						<div
							key={resume._id || idx}
							className="border border-gray-200 rounded-lg p-4 bg-gray-50"
						>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
								<div>
									<div className="font-bold text-gray-800 text-lg">
										{resume.company_name ||
											"Unknown Company"}
									</div>
									<div className="text-gray-500 text-xs mb-1">
										Generated:{" "}
										{resume.created_at
											? new Date(
													resume.created_at
											  ).toLocaleString()
											: "Unknown"}
									</div>
									{resume.company_link && (
										<div className="flex items-center gap-2 mb-1">
											<a
												href={resume.company_link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline text-sm"
											>
												{resume.company_link}
											</a>
											<button
												className="bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 text-xs"
												onClick={() => {
													navigator.clipboard.writeText(
														resume.company_link
													);
												}}
											>
												Copy Link
											</button>
										</div>
									)}
								</div>
								<div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
									{resume.resume && (
										<a
											href={`data:application/pdf;base64,${resume.resume}`}
											download={`${fullName}_${
												resume.company_name || "Resume"
											}.pdf`}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
										>
											Download PDF
										</a>
									)}
									{resume.JD && (
										<button
											onClick={() =>
												handleDownloadJD(
													resume.JD,
													resume.company_name
												)
											}
											className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded"
										>
											Download JD
										</button>
									)}
									<button
										onClick={() =>
											requestDelete(resume._id)
										}
										className={`bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1 rounded ${
											deletingId === resume._id
												? "opacity-60 cursor-not-allowed"
												: ""
										}`}
										disabled={deletingId === resume._id}
									>
										{deletingId === resume._id
											? "Deleting..."
											: "Delete"}
									</button>
								</div>
							</div>
							{resume.JD && (
								<details className="mt-3">
									<summary className="text-sm cursor-pointer text-gray-700 font-medium">
										Show Job Description
									</summary>
									<div className="bg-white border mt-2 p-2 rounded text-xs text-gray-700 whitespace-pre-wrap max-h-40 overflow-auto">
										{resume.JD}
									</div>
								</details>
							)}
							{Array.isArray(resume.answers) &&
								resume.answers.length > 0 && (
									<details className="mt-4">
										<summary className="font-semibold text-gray-700 cursor-pointer">
											Job Q &amp; A
										</summary>
										<div className="mt-3 space-y-2">
											{resume.answers.map((qa, i) => (
												<div
													key={i}
													className="bg-gray-100 rounded p-2"
												>
													<div className="flex justify-between items-start">
														<div>
															{qa.question && (
																<div className="text-sm text-blue-900 font-medium">
																	Q:{" "}
																	{
																		qa.question
																	}
																</div>
															)}
															{qa.answer && (
																<div className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
																	<strong>
																		A:
																	</strong>{" "}
																	{qa.answer}
																</div>
															)}
														</div>
														{qa.answer && (
															<button
																className="ml-2 bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 text-xs rounded transition"
																onClick={() =>
																	handleCopyAnswer(
																		qa.answer,
																		i
																	)
																}
															>
																{copiedIndex ===
																i
																	? "Copied!"
																	: "Copy"}
															</button>
														)}
													</div>
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
