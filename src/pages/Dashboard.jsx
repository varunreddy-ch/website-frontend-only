import { useState, Fragment } from "react";
import API from "../api";
import PDFPreview from "../components/PDFPreview";
import { getUser } from "../auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/legacy/build/pdf.worker.min.js",
	import.meta.url
).toString();

export default function Dashboard() {
	const Spinner = () => (
		<div className="typewriter">
			<div className="slide">
				<i></i>
			</div>
			<div className="paper"></div>
			<div className="keyboard"></div>
		</div>
	);

	const spinnerCSS = `
	.spinner-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.typewriter {
  --blue: #5C86FF;
  --blue-dark: #275EFE;
  --key: #fff;
  --paper: #EEF0FD;
  --text: #D3D4EC;
  --tool: #FBC56C;
  --duration: 3s;
  position: relative;
  -webkit-animation: bounce05 var(--duration) linear infinite;
  animation: bounce05 var(--duration) linear infinite;
}

.typewriter .slide {
  width: 92px;
  height: 20px;
  border-radius: 3px;
  margin-left: 14px;
  transform: translateX(14px);
  background: linear-gradient(var(--blue), var(--blue-dark));
  -webkit-animation: slide05 var(--duration) ease infinite;
  animation: slide05 var(--duration) ease infinite;
}

.typewriter .slide:before, .typewriter .slide:after,
.typewriter .slide i:before {
  content: "";
  position: absolute;
  background: var(--tool);
}

.typewriter .slide:before {
  width: 2px;
  height: 8px;
  top: 6px;
  left: 100%;
}

.typewriter .slide:after {
  left: 94px;
  top: 3px;
  height: 14px;
  width: 6px;
  border-radius: 3px;
}

.typewriter .slide i {
  display: block;
  position: absolute;
  right: 100%;
  width: 6px;
  height: 4px;
  top: 4px;
  background: var(--tool);
}

.typewriter .slide i:before {
  right: 100%;
  top: -2px;
  width: 4px;
  border-radius: 2px;
  height: 14px;
}

.typewriter .paper {
  position: absolute;
  left: 24px;
  top: -26px;
  width: 40px;
  height: 46px;
  border-radius: 5px;
  background: var(--paper);
  transform: translateY(46px);
  -webkit-animation: paper05 var(--duration) linear infinite;
  animation: paper05 var(--duration) linear infinite;
}

.typewriter .paper:before {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 7px;
  border-radius: 2px;
  height: 4px;
  transform: scaleY(0.8);
  background: var(--text);
  box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text);
}

.typewriter .keyboard {
  width: 120px;
  height: 56px;
  margin-top: -10px;
  z-index: 1;
  position: relative;
}

.typewriter .keyboard:before, .typewriter .keyboard:after {
  content: "";
  position: absolute;
}

.typewriter .keyboard:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  transform: perspective(10px) rotateX(2deg);
  transform-origin: 50% 100%;
}

.typewriter .keyboard:after {
  left: 2px;
  top: 25px;
  width: 11px;
  height: 4px;
  border-radius: 2px;
  box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  -webkit-animation: keyboard05 var(--duration) linear infinite;
  animation: keyboard05 var(--duration) linear infinite;
}

@keyframes bounce05 {
  85%, 92%, 100% {
    transform: translateY(0);
  }

  89% {
    transform: translateY(-4px);
  }

  95% {
    transform: translateY(2px);
  }
}

@keyframes slide05 {
  5% {
    transform: translateX(14px);
  }

  15%, 30% {
    transform: translateX(6px);
  }

  40%, 55% {
    transform: translateX(0);
  }

  65%, 70% {
    transform: translateX(-4px);
  }

  80%, 89% {
    transform: translateX(-12px);
  }

  100% {
    transform: translateX(14px);
  }
}

@keyframes paper05 {
  5% {
    transform: translateY(46px);
  }

  20%, 30% {
    transform: translateY(34px);
  }

  40%, 55% {
    transform: translateY(22px);
  }

  65%, 70% {
    transform: translateY(10px);
  }

  80%, 85% {
    transform: translateY(0);
  }

  92%, 100% {
    transform: translateY(46px);
  }
}

@keyframes keyboard05 {
  5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  9% {
    box-shadow: 15px 2px 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  18% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 2px 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  27% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 12px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  36% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 12px 0 var(--key), 60px 12px 0 var(--key), 68px 12px 0 var(--key), 83px 10px 0 var(--key);
  }

  45% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 2px 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  54% {
    box-shadow: 15px 0 0 var(--key), 30px 2px 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  63% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 12px 0 var(--key);
  }

  72% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 2px 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  81% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 12px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }
}
  `;

	// --- State/hooks ---
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

	const navigate = useNavigate();
	const nameParts = getUser().firstname.split(" ");
	const fullName = nameParts.filter(Boolean).join("_");

	// Download JD text
	const handleDownloadJobDesc = () => {
		const a = document.createElement("a");
		const file = new Blob([jobDesc], { type: "text/plain" });
		a.href = URL.createObjectURL(file);
		a.download = `${fullName}_${companyName || ""}_JD.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	// Generate resume
	const handleGenerate = () => {
		setResumeMessage("");
		setResumeError("");
		setAnswer("");
		setQuestion("");
		setPdfBlob(null);
		if (!jobDesc.trim())
			return setResumeError("Please enter a job description.");
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
				{ job_description: jobDesc, company_name: companyName },
				{ responseType: "blob" }
			);
			const blob = new Blob([res.data], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);
			setPdfBlob(url);

			const arrayBuffer = await blob.arrayBuffer();
			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer })
				.promise;
			let text = "";
			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const content = await page.getTextContent();
				text +=
					content.items.map((item) => item.str).join(" ") + "\n\n";
			}
			setGeneratedResume(text);
			setResumeMessage("Resume generated successfully!");
		} catch (err) {
			console.error(err);
			setResumeError("Failed to generate resume.");
		} finally {
			setLoading(false);
		}
	};

	// Ask question
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
				question,
			});
			setAnswer(res.data.generated_answer);
			setQuestionMessage("Answer received!");
		} catch (err) {
			console.error(err);
			setQuestionError("Failed to get an answer.");
		} finally {
			setAsking(false);
		}
	};

	// Copy answer
	const handleCopy = () => {
		navigator.clipboard.writeText(answer);
		setQuestionMessage("Answer copied to clipboard!");
	};

	return (
		<Fragment>
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
					<h1 className="text-2xl font-bold text-gray-800">
						Dashboard
					</h1>

					{/* Job Description Section */}
					<div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
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
							value={jobDesc}
							onChange={(e) => setJobDesc(e.target.value)}
							placeholder="Paste or write a job description here..."
						/>
						<div className="text-center">
							<button
								disabled={loading}
								onClick={handleGenerate}
								className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition ${
									loading && "opacity-50 cursor-not-allowed"
								}`}
							>
								{loading ? "Generating..." : "Proceed"}
							</button>
						</div>
					</div>

					{/* Resume Preview */}
					{pdfBlob ? (
						<div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
							<h2 className="text-lg font-semibold text-center text-gray-700">
								Resume Preview
							</h2>
							<PDFPreview pdfUrl={pdfBlob} />
							<div className="flex flex-col sm:flex-row justify-center gap-4">
								<a
									href={pdfBlob}
									download={`${fullName}.pdf`}
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
							clicking “Proceed”
						</div>
					)}

					{/* Ask About Resume */}
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
							placeholder="e.g., What are the candidate’s strengths?"
							className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
						<div className="text-center">
							<button
								disabled={asking}
								onClick={handleAsk}
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

				{/* Company Name Modal */}
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
		</Fragment>
	);
}
