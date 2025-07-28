import { useState, useEffect, Fragment } from "react";
import API from "../api";
import PDFPreview from "../components/PDFPreview";
import { getUser, logout } from "../auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ApplierSubmissionForm from "../components/ApplierSubmissionForm";
import GeneratedResumes from "../components/GeneratedResumes";
import Spinner, { spinnerCSS } from "../components/Spinner";
import { Mail, Heart } from "lucide-react";
import { getAPIErrorMessage } from "../utils/apiErrors";

// Configure PDF.js worker
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
	"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function Dashboard() {
	const [jobDesc, setJobDesc] = useState("");
	const [generatedResume, setGeneratedResume] = useState("");
	const [pdfBlob, setPdfBlob] = useState(null);
	const [loading, setLoading] = useState(false);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");

	const [resumeMessage, setResumeMessage] = useState("");
	const [resumeError, setResumeError] = useState("");
	const [questionMessage, setQuestionMessage] = useState("");
	const [questionError, setQuestionError] = useState("");

	const [companyName, setCompanyName] = useState("");
	const [showCompanyModal, setShowCompanyModal] = useState(false);

	const [asking, setAsking] = useState(false);

	const user = getUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/signin");
		}
	}, [user, navigate]);

	// if (!user) {
	// 	return null;
	// }

	const fullName = user.firstname
		? user.firstname.split(" ").filter(Boolean).join("_")
		: "user";

	const isApplier = user.role === "applier";
	const isTier2 = user.role === "tier2";
	const isAdmin = user.role === "admin";

	const handleDownloadJobDesc = () => {
		const element = document.createElement("a");
		const file = new Blob([jobDesc], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `${fullName}_${companyName || ""}_JD.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const handleGenerate = async () => {
		setResumeMessage("");
		setResumeError("");
		setAnswer("");
		setQuestion("");
		setPdfBlob(null);
		if (!jobDesc.trim()) {
			setResumeError("Please enter a job description.");
			return;
		}
		setShowCompanyModal(true);
	};

	const confirmAndGenerate = async () => {
		setShowCompanyModal(false);
		setLoading(true);
		setResumeError("");
		setResumeMessage("");
		try {
			const res = await API.post(
				"/generate-resume",
				{
					job_description: jobDesc,
					company_name: companyName,
				},
				{
					responseType: "blob",
				}
			);

			const blob = new Blob([res.data], { type: "application/pdf" });
			const blobUrl = URL.createObjectURL(blob);
			setPdfBlob(blobUrl);

			const arrayBuffer = await blob.arrayBuffer();

			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer })
				.promise;
			let text = "";

			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const content = await page.getTextContent();
				const pageText = content.items
					.map((item: any) => item.str || "")
					.join(" ");
				text += pageText + "\n\n";
			}
			// console.log(text);
			setGeneratedResume(text);
			setResumeMessage("Resume generated successfully!");
		} catch (err) {
			setResumeError(
				getAPIErrorMessage(err, "Failed to generate resume.")
			);
		} finally {
			setLoading(false);
		}
	};

	const handleAsk = async () => {
		setQuestionMessage("");
		setQuestionError("");
		setAsking(true);
		if (!question.trim()) {
			setQuestionError("Please enter a question.");
			setAsking(false);
			return;
		}
		if (!jobDesc || !generatedResume) {
			setQuestionError("Please generate a resume first.");
			setAsking(false);
			return;
		}
		try {
			const res = await API.post("/casual-question", {
				job_description: jobDesc,
				generated_resume: generatedResume,
				question: question,
			});
			setAnswer(res.data.generated_answer);
			setQuestionMessage("Answer received!");
		} catch (err) {
			setResumeError(
				getAPIErrorMessage(err, "Failed to generate resume.")
			);
		} finally {
			setAsking(false);
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(answer);
		setQuestionMessage("Answer copied to clipboard!");
	};

	return (
		<>
			{/* Spinner CSS */}
			<style>{spinnerCSS}</style>

			{/* Fullscreen overlay during resume generation */}
			{(loading || asking) && (
				<div className="spinner-overlay">
					<Spinner />
				</div>
			)}
			<div className="bg-gray-100 min-h-screen">
				<Navbar />

				<div className="max-w-4xl mx-auto p-4 space-y-4">
					<div className="bg-white rounded-lg shadow-lg p-4 space-y-4 mt-20">
						<h2 className="text-lg font-semibold text-center text-gray-700">
							Job Description
						</h2>

						{resumeError && (
							<div className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded text-sm text-center">
								{resumeError}
							</div>
						)}
						{resumeMessage && (
							<div className="text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded text-sm text-center">
								{resumeMessage}
							</div>
						)}

						<textarea
							className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
							rows={5}
							placeholder="Paste or write a job description here..."
							value={jobDesc}
							onChange={(e) => setJobDesc(e.target.value)}
						/>
						<div className="text-center">
							<button
								disabled={loading}
								className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition ${
									loading && "opacity-50 cursor-not-allowed"
								}`}
								onClick={handleGenerate}
							>
								{loading ? "Generating..." : "Proceed"}
							</button>
						</div>
					</div>

					{pdfBlob ? (
						<div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
							<h2 className="text-lg font-semibold text-center text-gray-700">
								Resume Preview
							</h2>

							<PDFPreview pdfUrl={pdfBlob} />

							<div className="flex flex-col sm:flex-row justify-center gap-4">
								<a
									href={pdfBlob}
									download={`${fullName}_${companyName
										.split(" ")
										.filter(Boolean)
										.join("_")}.pdf`}
									className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-center"
								>
									Download PDF
								</a>
								<button
									onClick={handleDownloadJobDesc}
									className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
								>
									Download Job Description
								</button>
							</div>
						</div>
					) : (
						<div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-400 italic border border-dashed border-gray-300">
							Your generated resume will appear here after
							clicking "Generate Resume"
						</div>
					)}

					{/* Applier Form */}
					{isApplier && <ApplierSubmissionForm />}

					<div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
						<h2 className="text-lg font-semibold text-center text-gray-700">
							Ask About the Resume
						</h2>

						{questionError && (
							<div className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded text-sm text-center">
								{questionError}
							</div>
						)}
						{questionMessage && (
							<div className="text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded text-sm text-center">
								{questionMessage}
							</div>
						)}

						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="e.g., What are the candidate's strengths?"
						/>
						<div className="text-center">
							<button
								onClick={handleAsk}
								disabled={asking}
								className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition ${
									asking && "opacity-50 cursor-not-allowed"
								}`}
							>
								{asking ? "Asking..." : "Ask"}
							</button>
						</div>

						{answer ? (
							<div className="border border-gray-200 rounded p-4 bg-gray-50 space-y-2 shadow-sm">
								<div className="flex justify-between items-center">
									<strong className="text-gray-800">
										Answer:
									</strong>
									<button
										onClick={handleCopy}
										className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md transition"
									>
										Copy Answer
									</button>
								</div>
								<p className="text-gray-700 whitespace-pre-line">
									{answer}
								</p>
							</div>
						) : (
							<div className="text-center text-gray-400 italic">
								Answer to your question will appear here.
							</div>
						)}
					</div>
				</div>

				{(user.role == "tier2" || user.role == "applier") && (
					<GeneratedResumes userId={user.user} fullName={fullName} />
				)}

				{showCompanyModal && (
					<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
							<h3 className="text-lg font-semibold text-gray-800 text-center">
								Enter Company Name
							</h3>

							<input
								type="text"
								placeholder="Company Name"
								className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
							/>

							<div className="flex justify-end gap-4 mt-4">
								<button
									onClick={() => setShowCompanyModal(false)}
									className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
								>
									Cancel
								</button>
								<button
									onClick={confirmAndGenerate}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
									disabled={!companyName.trim()}
								>
									Generate
								</button>
							</div>
						</div>
					</div>
				)}
				<footer className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white py-6 px-4 mt-10">
					<div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">
						{/* Left - Contact */}
						<div className="flex items-center gap-2 text-blue-200">
							<Mail className="h-4 w-4" />
							<a
								href="mailto:support@resumevar.com"
								className="hover:underline"
							>
								support@resumevar.com
							</a>
						</div>

						{/* Right - Copyright */}
						<div className="flex items-center gap-1 text-blue-200">
							<span>© {new Date().getFullYear()} ResumeVar.</span>
							<span>Made with</span>
							<Heart className="h-4 w-4 text-pink-400" />
							<span>for professionals.</span>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}
