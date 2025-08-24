import { useState, useEffect, Fragment } from "react";
import API from "../api";
import PDFPreview from "../components/PDFPreview";
import { getUser, logout, isTokenExpired } from "../auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageFooter from "@/components/PageFooter";

import Spinner, { spinnerCSS } from "../components/Spinner";
import { Copy, Star } from "lucide-react";
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

	const [resumeMessage, setResumeMessage] = useState("");
	const [resumeError, setResumeError] = useState("");

	const [companyName, setCompanyName] = useState("");
	const [showCompanyModal, setShowCompanyModal] = useState(false);

	const [copyMessage, setCopyMessage] = useState("");

	const user = getUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/signin");
			return;
		}

		// Check if token is expired
		if (isTokenExpired()) {
			logout();
			return;
		}

		// All users (tier1, tier2, user) can access dashboard for resume generation
		// No additional checks needed here
	}, [user, navigate]);

	// Check token expiration periodically
	useEffect(() => {
		const checkTokenInterval = setInterval(() => {
			if (isTokenExpired()) {
				logout();
			}
		}, 5000); // Check every 5 seconds

		return () => clearInterval(checkTokenInterval);
	}, []);

	const fullName = user.firstname
		? user.firstname.split(" ").filter(Boolean).join("_")
		: "user";

	const handleDownloadJobDesc = () => {
		const element = document.createElement("a");
		const file = new Blob([jobDesc], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `${fullName}_${companyName || ""}_JD.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const handleCopyJDAndResume = async () => {
		if (!jobDesc.trim() && !generatedResume.trim()) {
			setCopyMessage("Nothing to copy.");
			return;
		}

		let contentToCopy = `Job Description for ${
			companyName || "Company"
		}:\n\n${jobDesc || "N/A"}\n\n`;

		if (generatedResume.trim()) {
			contentToCopy += `--- Resume ---\n${generatedResume}`;
		}

		try {
			await navigator.clipboard.writeText(contentToCopy);
			setCopyMessage("JD and resume copied to clipboard!");
			// Clear the message after 2.5 seconds
			setTimeout(() => setCopyMessage(""), 2500);
		} catch (err) {
			console.error("Copy failed:", err);
			setCopyMessage("Failed to copy to clipboard.");
			// Clear the error message after 2.5 seconds
			setTimeout(() => setCopyMessage(""), 2500);
		}
	};

	const handleGenerate = async () => {
		setResumeMessage("");
		setResumeError("");
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

	return (
		<>
			{/* Spinner CSS */}
			<style>{spinnerCSS}</style>

			{/* Fullscreen overlay during resume generation */}
			{loading && (
				<div className="spinner-overlay">
					<Spinner />
				</div>
			)}
			<div className="bg-gray-100 min-h-screen">
				<Navbar />

				<div className="max-w-4xl mx-auto p-4 space-y-4">
					{/* Header Section */}
					<div className="text-center mt-20 mb-8">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							Generate Your Resume
						</h1>
						<p className="text-gray-600">
							Paste a job description and get a tailored resume in
							seconds
						</p>

						{/* Premium features note for tier1 users */}
						{(user?.role === "tier1" || user?.role === "user") && (
							<div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
								<div className="flex items-center gap-2 text-yellow-800">
									<Star className="w-5 h-5 text-yellow-600" />
									<span className="font-medium">
										Premium Features Available
									</span>
								</div>
								<p className="text-sm text-yellow-700 mt-1">
									Upgrade to access Jobs and Profile Analytics
								</p>
							</div>
						)}
					</div>

					{/* Job Description Section */}
					<div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
						<h2 className="text-xl font-semibold text-gray-700 mb-4">
							📋 Job Description
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
							className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 resize-none"
							rows={6}
							placeholder="Paste or write a job description here... Make sure to include key requirements, responsibilities, and company details for the best results."
							value={jobDesc}
							onChange={(e) => setJobDesc(e.target.value)}
						/>
						<div className="text-center">
							<button
								disabled={loading}
								className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 ${
									loading && "opacity-50 cursor-not-allowed"
								}`}
								onClick={handleGenerate}
							>
								{loading ? "Generating..." : "Generate Resume"}
							</button>
						</div>
					</div>

					{/* Resume Preview Section */}
					{pdfBlob ? (
						<div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
							<h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
								📄 Resume Preview
							</h2>

							<PDFPreview pdfUrl={pdfBlob} />

							{/* Copy Message */}
							{copyMessage && (
								<div
									className={`text-center px-4 py-2 rounded text-sm ${
										copyMessage.includes("Failed")
											? "text-red-600 bg-red-50 border border-red-200"
											: "text-blue-600 bg-blue-50 border border-blue-200"
									}`}
								>
									{copyMessage}
								</div>
							)}

							<div className="flex flex-col sm:flex-row justify-center gap-4">
								<a
									href={pdfBlob}
									download={`${fullName}_${companyName
										.split(" ")
										.filter(Boolean)
										.join("_")}.pdf`}
									className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
								>
									📥 Download PDF
								</a>
								<button
									onClick={handleDownloadJobDesc}
									className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
								>
									📋 Download Job Description
								</button>
								<button
									onClick={handleCopyJDAndResume}
									className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
								>
									<Copy className="h-4 w-4" />
									Copy JD+Resume
								</button>
							</div>
						</div>
					) : (
						<div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-400 border border-dashed border-gray-300">
							<div className="text-6xl mb-4">📄</div>
							<p className="text-lg font-medium mb-2">
								Ready to Generate
							</p>
							<p className="text-sm">
								Your generated resume will appear here after
								clicking "Generate Resume"
							</p>
						</div>
					)}
				</div>

				{/* Company Modal */}
				{showCompanyModal && (
					<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
							<h3 className="text-lg font-semibold text-gray-800 text-center">
								🏢 Enter Company Name
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

				{/* Footer */}
				<PageFooter />
			</div>
		</>
	);
}
