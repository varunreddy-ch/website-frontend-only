import { useState, useEffect, useRef } from "react";
import API from "../api";
import { getUser } from "../auth";
import { extractTextFromPdfBase64 } from "../utils/pdfUtils";
import {
	Download,
	Copy,
	FileText,
	Building,
	Calendar,
	ExternalLink,
	AlertTriangle,
	CheckCircle,
	Clock,
	Briefcase,
	MapPin,
	DollarSign,
	Eye,
	EyeOff,
} from "lucide-react";

export default function GeneratedResumes({ userId, fullName }) {
	// Use fullName if available, otherwise use empty string for company-only naming
	const safeFullName = fullName || "";

	const [userResumes, setUserResumes] = useState([]);
	const [resumesLoading, setResumesLoading] = useState(false);
	const [copiedIndex, setCopiedIndex] = useState(-1);
	const [copiedAddressPart, setCopiedAddressPart] = useState({ resumeId: "", part: "" });

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

	// NEW: reporting state
	const [pendingReportJobId, setPendingReportJobId] = useState("");
	const [reportingId, setReportingId] = useState("");
	const [reportMessage, setReportMessage] = useState("");
	const [reportError, setReportError] = useState("");
	const [reportReason, setReportReason] = useState("");
	const REPORT_MAX = 500;
	const reportTextareaRef = useRef(null);

	const user = getUser();
	const isApplier = user.role === "applier";

	// Use userId prop if provided, otherwise use authenticated user
	const effectiveUserId = userId || user?.user;

	const fetchResumes = async () => {
		setResumesLoading(true);
		try {
			// If userId is provided, use the old endpoint, otherwise use the new private endpoint
			let res = await API.get("/user-generated-resumes");
			// console.log(res);
			setUserResumes(res.data || []);
		} catch (err) {
			console.error("Failed to fetch resumes:", err);
			setUserResumes([]);
		} finally {
			setResumesLoading(false);
		}
	};

	useEffect(() => {
		if (effectiveUserId) fetchResumes();
	}, [effectiveUserId]);

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

	// NEW: auto-clear report messages
	useEffect(() => {
		if (reportMessage || reportError) {
			const t = setTimeout(() => {
				setReportMessage("");
				setReportError("");
			}, 5000); // Increased timeout to reduce re-renders
			return () => clearTimeout(t);
		}
	}, [reportMessage, reportError]);

	const handleDownloadJD = (jd, companyName) => {
		const a = document.createElement("a");
		const file = new Blob([jd], { type: "text/plain" });
		a.href = URL.createObjectURL(file);
		// If fullName is available, use it; otherwise just use company name
		const fileName = safeFullName
			? `${safeFullName}_${companyName || "JobDesc"}_JD.txt`
			: `${companyName || "JobDesc"}_JD.txt`;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

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

	const handleCopyAddressPart = async (resumeId, part, value) => {
		if (!value) return;
		try {
			await navigator.clipboard.writeText(value);
			setCopiedAddressPart({ resumeId, part });
			setTimeout(() => setCopiedAddressPart({ resumeId: "", part: "" }), 1200);
		} catch (err) {
			console.error("Failed to copy address part:", err);
		}
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

	const requestDeleteJob = (jobId) => setPendingDeleteJobId(jobId);

	const confirmDeleteJob = async () => {
		setDeletingId(pendingDeleteJobId);
		setDeleteError("");
		setDeleteMessage("");
		try {
			await API.delete(`/jobs/${pendingDeleteJobId}`);
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

		contentToCopy += `You are simulating a job application assistant. For each question, generate a response written in the first person, as if the candidate is filling out a job application form. Each answer should be concise, approximately 100 words, and must be based only on the candidate's resume and the job description
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

	const requestExpire = (jobId) => setPendingExpireJobId(jobId);
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

	// ====== REPORT JOB ======
	const requestReport = (jobId) => {
		setPendingReportJobId(jobId);
		setReportReason(""); // clear previous input
		// Focus the textarea after the modal opens
		setTimeout(() => {
			if (reportTextareaRef.current) {
				reportTextareaRef.current.focus();
			}
		}, 100);
	};
	const cancelReport = () => {
		setPendingReportJobId("");
		setReportReason("");
	};

	const confirmReportJob = async () => {
		if (!reportReason.trim()) {
			setReportError("Please provide a brief reason for reporting.");
			return;
		}
		if (reportReason.length > REPORT_MAX) {
			setReportError(`Report is too long (max ${REPORT_MAX} chars).`);
			return;
		}

		setReportingId(pendingReportJobId);
		setReportMessage("");
		setReportError("");

		try {
			// Adjust endpoint if your server differs (e.g. /admin/jobs/:id/report)
			await API.patch(
				`/jobs/report/${pendingReportJobId}`,
				{ reason: reportReason.trim() },
				{ headers: { "Content-Type": "application/json" } }
			);

			// Optimistic: remove the job's resumes from this list
			setUserResumes((prev) =>
				prev.filter((r) => r.jobId !== pendingReportJobId)
			);
			setReportMessage("Thanks! Job has been reported for review.");
		} catch (err) {
			console.error("Failed to report job:", err);
			setReportError("Could not report job. Please try again.");
		} finally {
			setReportingId("");
			setPendingReportJobId("");
			setReportReason("");
		}
	};

	// Message component for consistent styling
	const MessageBanner = ({ type, message, onClose }) => {
		const styles = {
			success: "bg-emerald-50 border-emerald-200 text-emerald-800",
			error: "bg-red-50 border-red-200 text-red-800",
			warning: "bg-amber-50 border-amber-200 text-amber-800",
			info: "bg-blue-50 border-blue-200 text-blue-800",
		};

		return (
			<div
				className={`mb-6 p-4 border rounded-xl flex items-center justify-between ${styles[type]}`}
			>
				<p className="text-sm font-medium">{message}</p>
				{onClose && (
					<button
						onClick={onClose}
						className="ml-4 text-current hover:opacity-70 transition-opacity"
					>
						×
					</button>
				)}
			</div>
		);
	};

	const handleAutoFillResume = (resume) => {
		console.log("🟢 Auto Fill clicked", resume);
	  
		const jobUrl = resume.company_link;
		if (!jobUrl) {
		  alert("No job application link found for this resume");
		  return;
		}
	  
		const fileName = safeFullName
		  ? `${safeFullName}_${resume.company_name || "Company"}.pdf`
		  : `${resume.company_name || "Company"}.pdf`;
	  
		const payload = {
		  type: "RESUMEVAR_AUTOFILL",
		  userData: {
			firstName: resume.user_raw_firstname || "",
			lastName: resume.user_raw_lastname || "",
			phone: resume.user_raw_phone || "",
			email: resume.user_raw_email || "",
			linkedin: resume.user_raw_linkedin || "",
			github: resume.user_raw_github || "",
			website: "",
			address: {
			  street: resume.street || "",
			  city: resume.city || "",
			  state: resume.state || "",
			  zip: resume.zip || "",
			  country: "United States",
			},
		  },
		  // ✅ NEW: send resume base64
		  resumeFile: {
			base64: resume.resume || "",          // this is your PDF base64 (you already use it for download)
			mimeType: "application/pdf",
			fileName,
		  },
		  jobUrl,
		};
	  
		console.log("📤 Posting message to extension");
		window.postMessage(payload, "*");
	  };
	  
	  

	// Modal component for consistent styling
	const Modal = ({
		isOpen,
		onClose,
		children,
		title,
		icon: Icon,
		iconColor = "text-blue-500",
	}) => {
		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
					<div className="p-8 space-y-6">
						<div className="text-center">
							{Icon && (
								<Icon
									className={`h-16 w-16 ${iconColor} mx-auto mb-4`}
								/>
							)}
							<h3 className="text-2xl font-bold text-gray-900 mb-2">
								{title}
							</h3>
						</div>
						{children}
					</div>
				</div>

				{/* Custom Scrollbar Styles */}
				<style>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: #f1f5f9;
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #cbd5e1;
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}
			`}</style>
			</div>
		);
	};

	// Button component for consistent styling
	const Button = ({
		children,
		variant = "primary",
		size = "md",
		onClick,
		disabled,
		className = "",
		...props
	}) => {
		const baseStyles =
			"inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

		const variants = {
			primary:
				"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
			secondary:
				"bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-gray-400 shadow-sm",
			success:
				"bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl",
			danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
			warning:
				"bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl",
		};

		const sizes = {
			sm: "px-3 py-2 text-sm",
			md: "px-4 py-2.5 text-sm",
			lg: "px-6 py-3 text-base",
		};

		return (
			<button
				className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
				onClick={onClick}
				disabled={disabled}
				{...props}
			>
				{children}
			</button>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header Section */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Your Generated Resumes
					</h1>
					<p className="text-gray-600 text-lg">
						Track and manage all your job applications in one place
					</p>
				</div>

				{/* Messages */}
				{applyError && (
					<MessageBanner type="error" message={applyError} />
				)}
				{applyMessage && (
					<MessageBanner type="success" message={applyMessage} />
				)}
				{expireError && (
					<MessageBanner type="error" message={expireError} />
				)}
				{expireMessage && (
					<MessageBanner type="warning" message={expireMessage} />
				)}
				{deleteError && (
					<MessageBanner type="error" message={deleteError} />
				)}
				{deleteMessage && (
					<MessageBanner type="success" message={deleteMessage} />
				)}
				{reportError && (
					<MessageBanner type="error" message={reportError} />
				)}
				{reportMessage && (
					<MessageBanner type="success" message={reportMessage} />
				)}

				{/* Apply Modal */}
				<Modal
					isOpen={!!pendingApplyResumeId}
					onClose={cancelApply}
					title="Confirm Application"
					icon={CheckCircle}
					iconColor="text-emerald-500"
				>
					<p className="text-gray-600 text-center mb-6">
						Are you sure you want to mark this resume as applied? It
						will no longer appear on your dashboard.
					</p>
					<div className="flex justify-end gap-3">
						<Button variant="secondary" onClick={cancelApply}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={confirmApply}
							disabled={applyingId === pendingApplyResumeId}
						>
							{applyingId === pendingApplyResumeId
								? "Applying..."
								: "Confirm"}
						</Button>
					</div>
				</Modal>

				{/* Delete Modal */}
				<Modal
					isOpen={!!pendingDeleteJobId}
					onClose={cancelDelete}
					title="Confirm Delete"
					icon={AlertTriangle}
					iconColor="text-red-500"
				>
					<p className="text-gray-600 text-center mb-6">
						This will delete the job and <strong>all</strong>{" "}
						associated resumes. Are you sure?
					</p>
					<div className="flex justify-end gap-3">
						<Button variant="secondary" onClick={cancelDelete}>
							Cancel
						</Button>
						<Button
							variant="danger"
							onClick={confirmDeleteJob}
							disabled={deletingId === pendingDeleteJobId}
						>
							{deletingId === pendingDeleteJobId
								? "Deleting..."
								: "Delete"}
						</Button>
					</div>
				</Modal>

				{/* Expire Modal */}
				<Modal
					isOpen={!!pendingExpireJobId}
					onClose={cancelExpire}
					title="Mark Job as Expired"
					icon={Clock}
					iconColor="text-amber-500"
				>
					<p className="text-gray-600 text-center mb-6">
						This will mark the job as expired and remove associated
						resumes. Are you sure?
					</p>
					<div className="flex justify-end gap-3">
						<Button variant="secondary" onClick={cancelExpire}>
							Cancel
						</Button>
						<Button
							variant="warning"
							onClick={confirmExpireJob}
							disabled={expiringId === pendingExpireJobId}
						>
							{expiringId === pendingExpireJobId
								? "Processing..."
								: "Confirm"}
						</Button>
					</div>
				</Modal>

				{/* Report Modal */}
				{!!pendingReportJobId && (
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
							<div className="p-8 space-y-6">
								<div className="text-center">
									<AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
									<h3 className="text-2xl font-bold text-gray-900 mb-2">
										Report this Job
									</h3>
								</div>
								<p className="text-gray-600 text-center mb-6">
									Tell us what's wrong so the admins can
									review it quickly.
								</p>
								<div className="space-y-4">
									<div>
										<label
											htmlFor="report-reason"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Reason (required)
										</label>
										<textarea
											ref={reportTextareaRef}
											id="report-reason"
											value={reportReason}
											onChange={(e) =>
												setReportReason(e.target.value)
											}
											maxLength={REPORT_MAX}
											rows={4}
											placeholder="e.g. Broken link, duplicate posting, misleading description, scam, etc."
											className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
										/>
										<div className="mt-2 text-xs text-gray-500 text-right">
											{reportReason.length}/{REPORT_MAX}
										</div>
									</div>
									<div className="flex justify-end gap-3">
										<Button
											variant="secondary"
											onClick={cancelReport}
										>
											Cancel
										</Button>
										<Button
											variant="danger"
											onClick={confirmReportJob}
											disabled={
												reportingId ===
												pendingReportJobId
											}
										>
											{reportingId === pendingReportJobId
												? "Reporting..."
												: "Submit Report"}
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Content */}
				{resumesLoading ? (
					<div className="text-center py-16">
						<div className="inline-flex items-center justify-center w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
						<p className="text-gray-600 text-lg font-medium">
							Loading your job applications...
						</p>
						<p className="text-gray-400 text-sm mt-2">
							This may take a few moments
						</p>
					</div>
				) : userResumes.length === 0 ? (
					<div className="text-center py-16">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
							<FileText className="h-10 w-10 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No resumes generated yet
						</h3>
						<p className="text-gray-500 mb-6">
							Start by generating your first resume from the
							Generate page
						</p>
						<Button variant="primary" size="lg">
							<Briefcase className="h-5 w-5" />
							Generate Resume
						</Button>
					</div>
				) : (
					<div className="grid gap-6">
						{userResumes.map((resume, idx) => (
							<div
								key={resume._id || idx}
								className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
							>
								{/* Header Section */}
								<div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
									<div className="flex flex-col lg:flex-row justify-between items-start gap-4">
										<div className="flex-1 min-w-0">
											<div className="flex items-start gap-3 mb-3">
												<div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
													<Briefcase className="h-6 w-6 text-blue-600" />
												</div>
												<div className="min-w-0 flex-1">
													<h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
														{resume.company_name ||
															"Company"}
													</h3>
													<div className="flex items-center gap-4 text-sm text-gray-600">
														<div className="flex items-center gap-1.5">
															<Briefcase className="h-4 w-4 text-gray-500" />
															<span className="font-medium">
																{resume.job_title ===
																"Unknown Title"
																	? "Unknown Title"
																	: resume.job_title}
															</span>
														</div>
														<div className="flex items-center gap-1.5">
															<Calendar className="h-4 w-4 text-gray-500" />
															<span>
																{resume.created_at
																	? new Date(
																			resume.created_at
																	  ).toLocaleDateString()
																	: "Unknown"}
															</span>
														</div>
													</div>

													{/* Location */}
													{resume.location && (
														<div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
															<MapPin className="h-4 w-4 text-gray-400" />
															<span>
																Job location: {
																	resume.location
																}
															</span>
														</div>
													)}

													{/* Address Details */}
													{(resume.street || resume.city || resume.state || resume.zip) && (
														<div className="flex items-start gap-1.5 text-sm text-gray-500 mt-2">
															<MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
															<div className="flex flex-col gap-0.5">
																<span>
																	Candidate's location:{" "}
																	{resume.street && (
																		<span
																			onClick={() =>
																				handleCopyAddressPart(
																					resume._id,
																					"street",
																					resume.street
																				)
																			}
																			className="cursor-pointer hover:text-gray-700 hover:underline transition-colors"
																			title="Click to copy street"
																		>
																			{copiedAddressPart.resumeId === resume._id &&
																			copiedAddressPart.part === "street"
																				? "✓ Copied!"
																				: resume.street}
																		</span>
																	)}
																	{resume.street && (resume.city || resume.state || resume.zip) && ", "}
																	{resume.city && (
																		<span
																			onClick={() =>
																				handleCopyAddressPart(
																					resume._id,
																					"city",
																					resume.city
																				)
																			}
																			className="cursor-pointer hover:text-gray-700 hover:underline transition-colors"
																			title="Click to copy city"
																		>
																			{copiedAddressPart.resumeId === resume._id &&
																			copiedAddressPart.part === "city"
																				? "✓ Copied!"
																				: resume.city}
																		</span>
																	)}
																	{resume.city && (resume.state || resume.zip) && ", "}
																	{resume.state && (
																		<span
																			onClick={() =>
																				handleCopyAddressPart(
																					resume._id,
																					"state",
																					resume.state
																				)
																			}
																			className="cursor-pointer hover:text-gray-700 hover:underline transition-colors"
																			title="Click to copy state"
																		>
																			{copiedAddressPart.resumeId === resume._id &&
																			copiedAddressPart.part === "state"
																				? "✓ Copied!"
																				: resume.state}
																		</span>
																	)}
																	{resume.state && resume.zip && ", "}
																	{resume.zip && (
																		<span
																			onClick={() =>
																				handleCopyAddressPart(
																					resume._id,
																					"zip",
																					resume.zip
																				)
																			}
																			className="cursor-pointer hover:text-gray-700 hover:underline transition-colors"
																			title="Click to copy zip"
																		>
																			{copiedAddressPart.resumeId === resume._id &&
																			copiedAddressPart.part === "zip"
																				? "✓ Copied!"
																				: resume.zip}
																		</span>
																	)}
																</span>
															</div>
														</div>
													)}
												</div>
											</div>

											{/* Company Link */}
											{resume.company_link && (
												<div className="flex items-center gap-2 text-sm">
													<ExternalLink className="h-4 w-4 text-blue-600" />
													<a
														href={
															resume.company_link
														}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-xs font-medium"
													>
														{resume.company_link}
													</a>
													<button
														className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors border border-blue-200 font-medium"
														onClick={() =>
															navigator.clipboard.writeText(
																resume.company_link
															)
														}
														title="Copy link"
													>
														Copy
													</button>
												</div>
											)}
										</div>

										{/* Salary Badge */}
										{resume.salary &&
											resume.salary !== "" && (
												<div className="flex-shrink-0">
													<div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200">
														<DollarSign className="h-4 w-4" />
														<span className="font-semibold text-sm">
															{resume.salary}
														</span>
													</div>
												</div>
											)}
									</div>
								</div>

								{/* Content Section */}
								<div className="p-6">
									{/* Action Buttons */}
									{/* Make the buttons center aligned */}
									<div className="flex flex-wrap gap-3 mb-6 justify-center">
										<Button
											onClick={() => handleAutoFillResume(resume)}
											variant="primary"
											size="sm"
										>
											<Copy className="h-4 w-4" />
											Auto Fill Resume
										</Button>
										
										<Button
											onClick={() =>
												handleCopyJDAndResume(
													resume.JD,
													resume.resume,
													resume.company_name
												)
											}
											variant="primary"
											size="sm"
										>
											<Copy className="h-4 w-4" />
											Copy JD + Resume
										</Button>
										{/* Download PDF color should be same as Download JD */}
										{resume.resume && (
											<a
												href={`data:application/pdf;base64,${resume.resume}`}
												download={`${
													safeFullName
														? `${safeFullName}_${
																resume.company_name ||
																"Resume"
														  }`
														: `${
																resume.company_name ||
																"Resume"
														  }`
												}.pdf`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Button
													variant="primary"
													size="sm"
												>
													<Download className="h-4 w-4" />
													Download PDF
												</Button>
											</a>
										)}

										{/* Download DOCX for tier3 users if available */}
										{user?.role === "tier3" &&
											resume.docx && (
												<a
													href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${resume.docx}`}
													download={`${
														safeFullName
															? `${safeFullName}_${
																	resume.company_name ||
																	"Resume"
															  }`
															: `${
																	resume.company_name ||
																	"Resume"
															  }`
													}.docx`}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Button
														variant="primary"
														size="sm"
													>
														<Download className="h-4 w-4" />
														Download DOCX
													</Button>
												</a>
											)}

										{resume.JD && resume.JD.trim() && (
											<Button
												onClick={() =>
													handleDownloadJD(
														resume.JD,
														resume.company_name
													)
												}
												variant="primary"
												size="sm"
											>
												<FileText className="h-4 w-4" />
												Download JD
											</Button>
										)}

										{/* Report Job — available to all users */}
										{resume.jobId && (
											<Button
												onClick={() =>
													requestReport(resume.jobId)
												}
												disabled={
													reportingId === resume.jobId
												}
												variant="danger"
												size="sm"
											>
												<AlertTriangle className="h-4 w-4" />
												{reportingId === resume.jobId
													? "Reporting..."
													: "Report Job"}
											</Button>
										)}

										{/* Applier tools */}
										{isApplier &&
											resume.jobId &&
											resume.JD.trim() && (
												<Button
													onClick={() =>
														requestExpire(
															resume.jobId
														)
													}
													variant="secondary"
													size="sm"
													className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
												>
													<Clock className="h-4 w-4" />
													Mark as Expired
												</Button>
											)}

										{isApplier &&
											resume.jobId &&
											resume.JD.trim() && (
												<Button
													onClick={() =>
														requestDeleteJob(
															resume.jobId
														)
													}
													variant="danger"
													size="sm"
												>
													<AlertTriangle className="h-4 w-4" />
													Delete Job
												</Button>
											)}

										<Button
											onClick={() =>
												requestApply(resume._id)
											}
											disabled={applyingId === resume._id}
											variant="primary"
											size="sm"
										>
											<CheckCircle className="h-4 w-4" />
											{applyingId === resume._id
												? "Applying..."
												: "Mark as Applied"}
										</Button>
									</div>

									{/* Job Description */}
									{resume.JD && (
										<div className="mb-6">
											<details className="group">
												<summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-3">
													<FileText className="h-4 w-4" />
													Job Description
													<Eye className="h-4 w-4 group-open:hidden" />
													<EyeOff className="h-4 w-4 hidden group-open:block" />
												</summary>
												<div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
													<div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
														<p className="whitespace-pre-wrap leading-relaxed">
															{resume.JD}
														</p>
													</div>
												</div>
											</details>
										</div>
									)}

									{/* Job Q&A */}
									{Array.isArray(resume.answers) &&
										resume.answers.length > 0 && (
											<div>
												<details className="group">
													<summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-3">
														<FileText className="h-4 w-4" />
														Job Q & A (
														{resume.answers.length})
														<Eye className="h-4 w-4 group-open:hidden" />
														<EyeOff className="h-4 w-4 hidden group-open:block" />
													</summary>
													<div className="mt-3 space-y-3">
														{resume.answers.map(
															(qa, i) => (
																<div
																	key={i}
																	className="bg-gray-50 rounded-xl p-4 text-sm space-y-3 border border-gray-200"
																>
																	{qa.question && (
																		<div className="flex items-start gap-2">
																			<div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
																				<span className="text-blue-600 text-xs font-bold">
																					Q
																				</span>
																			</div>
																			<p className="text-blue-900 font-medium flex-1">
																				{
																					qa.question
																				}
																			</p>
																		</div>
																	)}
																	{qa.answer && (
																		<div className="flex items-start gap-2">
																			<div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
																				<span className="text-emerald-600 text-xs font-bold">
																					A
																				</span>
																			</div>
																			<div className="flex-1">
																				<p className="text-gray-800 whitespace-pre-wrap mb-2">
																					{
																						qa.answer
																					}
																				</p>
																				<Button
																					onClick={() =>
																						handleCopyAnswer(
																							qa.answer,
																							i
																						)
																					}
																					variant="secondary"
																					size="sm"
																				>
																					<Copy className="h-3 w-3" />
																					{copiedIndex ===
																					i
																						? "Copied!"
																						: "Copy Answer"}
																				</Button>
																			</div>
																		</div>
																	)}
																</div>
															)
														)}
													</div>
												</details>
											</div>
										)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Custom Scrollbar Styles */}
			<style>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: #f1f5f9;
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #cbd5e1;
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}
			`}</style>
		</div>
	);
}
