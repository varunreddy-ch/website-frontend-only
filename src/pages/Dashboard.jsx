import { useState, useRef, useEffect } from "react";
import API from "../api";
import PDFPreview from "../components/PDFPreview";
import { getUser, logout } from "../auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ResumeForm from "../components/ResumeForm";

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
	const [resumeData, setResumeData] = useState(null);
	const [resumeCompleted, setResumeCompleted] = useState(false);
	const [showResumeForm, setShowResumeForm] = useState(true);
	const [resumeGenerated, setResumeGenerated] = useState(false);

	const navigate = useNavigate();
	const jdRef = useRef(null);

	useEffect(() => {
		if (resumeCompleted && jdRef.current) {
			jdRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [resumeCompleted]);

	const handleDownloadJobDesc = () => {
		const element = document.createElement("a");
		const file = new Blob([jobDesc], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `${getUser().user}_${companyName}_JD.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const handleGenerate = async () => {
		setResumeMessage("");
		setResumeError("");
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
			const res = await API.post("/generate-resume", {
				job_description: jobDesc,
				company_name: companyName,
				resume_data: resumeData,
			});
			const base64 = res.data.pdf;
			const binary = atob(base64);
			const byteArray = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				byteArray[i] = binary.charCodeAt(i);
			}
			const blob = new Blob([byteArray], { type: "application/pdf" });
			setPdfBlob(URL.createObjectURL(blob));
			setGeneratedResume(res.data.generated_resume);
			setResumeMessage("Resume generated successfully!");
			setResumeGenerated(true);
		} catch {
			setResumeError("Failed to generate resume.");
		} finally {
			setLoading(false);
		}
	};

	const handleAsk = async () => {
		setQuestionMessage("");
		setQuestionError("");
		if (!question.trim()) {
			setQuestionError("Please enter a question.");
			return;
		}
		if (!jobDesc || !generatedResume) {
			setQuestionError("Please generate a resume first.");
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
		} catch {
			setQuestionError("Failed to get an answer.");
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(answer);
		setQuestionMessage("Answer copied to clipboard!");
	};

	return (
		<div className="bg-gray-100 min-h-screen">
			<Navbar />

			<div className="max-w-4xl mx-auto p-4 space-y-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-800">
						Dashboard
					</h1>
					<button
						onClick={() => {
							logout();
							navigate("/");
						}}
						className="text-red-500 text-sm hover:underline"
					>
						Logout
					</button>
				</div>

				{(!resumeCompleted || showResumeForm) && (
					<ResumeForm
						formData={resumeData}
						hidden={!showResumeForm}
						onSubmit={(data) => {
							setResumeData(data);
							setResumeCompleted(true);
							setShowResumeForm(false);
						}}
					/>
				)}

				{resumeCompleted && (
					<div className="text-center">
						<button
							onClick={() => {
								setShowResumeForm(true),
									setResumeCompleted(false);
							}}
							className="text-blue-600 hover:underline text-sm"
						>
							{"Open Resume Builder"}
						</button>
					</div>
				)}

				{/* Job Description Section */}
				{resumeCompleted && (
					<div
						ref={jdRef}
						className="bg-white rounded-lg shadow-lg p-4 space-y-4"
					>
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
				)}

				{/* Resume Preview */}
				{resumeGenerated && (
					<div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
						<h2 className="text-lg font-semibold text-center text-gray-700">
							Resume Preview
						</h2>
						<PDFPreview pdfUrl={pdfBlob} />
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<a
								href={pdfBlob}
								download={`${
									getUser().user
								}_${companyName}.pdf`}
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
				)}

				{/* Ask Question Section */}
				{resumeGenerated && (
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
							placeholder="e.g., What are the candidate’s strengths?"
						/>
						<div className="text-center">
							<button
								onClick={handleAsk}
								className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
							>
								Ask
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
				)}
			</div>

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
								disabled={!companyName.trim()}
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
							>
								Generate
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
