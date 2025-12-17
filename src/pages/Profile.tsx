import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import TierRouteGuard from "@/components/TierRouteGuard";
import PageFooter from "@/components/PageFooter";
import {
	User,
	FileText,
	TrendingUp,
	Calendar,
	BarChart3,
	CheckCircle,
	Briefcase,
	Lock,
	Upload,
	X,
	Image as ImageIcon,
} from "lucide-react";
import API from "@/api";
import { DateTime } from "luxon";
import { getUser } from "@/auth";
import { useToast } from "@/hooks/use-toast";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement,
	Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import PremiumUpgrade from "@/components/PremiumUpgrade";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement,
	Filler
);

export default function Profile() {
	const [userInfo, setUserInfo] = useState({
		firstname: "",
		lastname: "",
		email: "",
		role: "",
	});

	const [loading, setLoading] = useState(true);
	const [generatedResumes, setGeneratedResumes] = useState([]);
	const [appliedResumes, setAppliedResumes] = useState([]);
	const [stats, setStats] = useState({
		totalApplied: 0,
		availableJobs: 0,
	});

	const [accessRequestDialog, setAccessRequestDialog] = useState({
		open: false,
		companyName: "",
		fileType: "", // "resume" or "jd"
		resumeId: null,
	});

	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [filePreviews, setFilePreviews] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();
	const currentUser = getUser();
	const { toast } = useToast();

	// Create Maps for O(1) resume lookup by ID
	const appliedResumesMap = useMemo(() => {
		const map = new Map();
		appliedResumes.forEach((resume) => {
			map.set(resume.id, resume);
		});
		return map;
	}, [appliedResumes]);

	const generatedResumesMap = useMemo(() => {
		const map = new Map();
		generatedResumes.forEach((resume) => {
			map.set(resume.id, resume);
		});
		return map;
	}, [generatedResumes]);

	useEffect(() => {
		if (!currentUser) {
			navigate("/signin");
			return;
		}

		// Fetch data for tier2, tier3, tier4, and guest users
		if (currentUser.role === "tier2" || currentUser.role === "tier3" || currentUser.role === "tier4" || currentUser.role === "guest") {
			fetchData();
		}
	}, []);

	const downloadResume = useCallback(async (resumeId, type = "resume", resume = null) => {
		if (!resumeId) {
			return false;
		}

		// Use Map for O(1) lookup if resume not provided
		if (!resume) {
			resume = type === "resume" 
				? appliedResumesMap.get(resumeId)
				: generatedResumesMap.get(resumeId);
		}

		// For guest users, check if they have access
		if (currentUser && currentUser.role === "guest") {
			const hasAccess = type === "resume" 
				? resume?.hasResumeUrl 
				: resume?.hasJdLink;
			
			if (!hasAccess) {
				// Show access request dialog immediately
				setAccessRequestDialog({
					open: true,
					companyName: resume?.company_name || "this company",
					fileType: type,
					resumeId: resumeId,
				});
				return false;
			}
		}

		try {
			// Call secure backend endpoint instead of direct URL
			const response = await API.get(
				`/resume/download/${type}/${resumeId}`,
				{
					responseType: "blob", // Important: receive as blob for file download
				}
			);

			// Extract filename from headers
			// Axios with blob responseType may return headers as Headers object or plain object
			let filename = `${type === "resume" ? "resume" : "jd"}_${resumeId}.${type === "resume" ? "pdf" : "txt"}`;
			
			// Helper to get header value (handles both Headers object and plain object)
			const getHeader = (name) => {
				if (!response.headers) return "";
				// If it's a Headers object (has get method)
				if (typeof response.headers.get === "function") {
					return response.headers.get(name) || response.headers.get(name.toLowerCase()) || "";
				}
				// If it's a plain object
				return response.headers[name] || response.headers[name.toLowerCase()] || "";
			};
			
			// Try X-Filename custom header first (easier to parse)
			const customFilename = getHeader("x-filename") || getHeader("X-Filename");
			
			if (customFilename) {
				filename = customFilename;
			} else {
				// Fall back to Content-Disposition header parsing
				const contentDisposition = getHeader("content-disposition") || getHeader("Content-Disposition");
				
				if (contentDisposition) {
					// Parse: attachment; filename="filename.pdf" or attachment; filename=filename.pdf
					// Also handle filename*=UTF-8''encoded format
					let filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
					if (filenameMatch && filenameMatch[1]) {
						try {
							filename = decodeURIComponent(filenameMatch[1]);
						} catch (e) {
							// Fall back to regular filename parsing
							filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
							if (filenameMatch && filenameMatch[1]) {
								filename = filenameMatch[1].replace(/['"]/g, "").trim();
							}
						}
					} else {
						filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
						if (filenameMatch && filenameMatch[1]) {
							filename = filenameMatch[1].replace(/['"]/g, "").trim();
						}
					}
				}
			}
			
			console.log("Download - Filename:", filename, "Headers:", response.headers);

			// Create a blob URL from the response
			const blob = new Blob([response.data], {
				type: type === "resume" ? "application/pdf" : "text/plain",
			});
			const url = window.URL.createObjectURL(blob);

			// Create a temporary link and trigger download
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up the blob URL
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Failed to download file:", err);
			if (err.response?.status === 403) {
				toast({
					title: "Access Denied",
					description: "You don't have permission to download this file.",
					variant: "destructive",
				});
			} else if (err.response?.status === 404) {
				toast({
					title: "File Not Found",
					description: "The requested file could not be found.",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Download Failed",
					description: "Failed to download file. Please try again.",
					variant: "destructive",
				});
			}
			return false;
		}
	}, [currentUser, appliedResumesMap, generatedResumesMap, toast]);

	const fetchData = async () => {
		try {
			setLoading(true);

			// Use the new private endpoint
			const { data } = await API.get(`/profile-private`);
			setUserInfo(data.user || {});

			const appliedResumesData = data.appliedResumes || [];
			const generatedResumesData = data.generatedResumes || [];

			// Parse resume dates with EST zone
			const parsedAppliedResumes = appliedResumesData.map((r) => ({
				...r,
				updatedAtEST: DateTime.fromISO(r.updatedAt).setZone(
					"America/New_York"
				),
				createdAtEST: DateTime.fromISO(r.createdAt).setZone(
					"America/New_York"
				),
			}));

			const parsedGeneratedResumes = generatedResumesData.map((r) => ({
				...r,
				updatedAtEST: DateTime.fromISO(r.updatedAt).setZone(
					"America/New_York"
				),
				createdAtEST: DateTime.fromISO(r.createdAt).setZone(
					"America/New_York"
				),
			}));

			setAppliedResumes(
				parsedAppliedResumes.sort(
					(a, b) =>
						b.updatedAtEST.toMillis() - a.updatedAtEST.toMillis()
				)
			);

			setGeneratedResumes(
				parsedGeneratedResumes.sort(
					(a, b) =>
						b.createdAtEST.toMillis() - a.createdAtEST.toMillis()
				)
			);

			// Get job stats
			const jobStatsResponse = await API.get("/user-job-stats");
			if (jobStatsResponse.data.success) {
				const { availableJobs, appliedToday } =
					jobStatsResponse.data.data;
				setStats({
					totalApplied: appliedResumesData.length,
					availableJobs,
				});
			}
		} catch (err) {
			console.error("Failed to load profile:", err);
			// Set default values if API fails
			setUserInfo({
				firstname: "User",
				lastname: "",
				email: "user@example.com",
				role: "user",
			});
			setStats({ totalApplied: 0, availableJobs: 0 });
		} finally {
			setLoading(false);
		}
	};

	const calculateMonthlyStats = useCallback((appliedResumes, generatedResumes) => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const currentMonth = new Date().getMonth();
		const startIndex = Math.max(0, currentMonth - 5);
		const endIndex = currentMonth + 1;

		return months.slice(startIndex, endIndex).map((month, index) => {
			const monthIndex = (currentMonth - 5 + index + 12) % 12;

			// Count applied resumes based on updatedAt
			const monthApplied = appliedResumes.filter((r) => {
				const resumeMonth = new Date(r.updatedAt).getMonth();
				return resumeMonth === monthIndex;
			});

			// Count generated resumes based on createdAt
			const monthGenerated = generatedResumes.filter((r) => {
				const resumeMonth = new Date(r.createdAt).getMonth();
				return resumeMonth === monthIndex;
			});

			return {
				month,
				applied: monthApplied.length,
				generated: monthGenerated.length,
			};
		});
	}, []);

	const calculateLast30DaysStats = useCallback((appliedResumes, generatedResumes) => {
		const days = [];
		const estNow = DateTime.now().setZone("America/New_York");

		for (let i = 29; i >= 0; i--) {
			const date = estNow.minus({ days: i });

			// Count applied resumes based on updatedAt
			const dayApplied = appliedResumes.filter((r) => {
				const resumeDate = DateTime.fromISO(r.updatedAt).setZone(
					"America/New_York"
				);
				return resumeDate.startOf("day").equals(date.startOf("day"));
			});

			// Count generated resumes based on createdAt
			const dayGenerated = generatedResumes.filter((r) => {
				const resumeDate = DateTime.fromISO(r.createdAt).setZone(
					"America/New_York"
				);
				return resumeDate.startOf("day").equals(date.startOf("day"));
			});

			days.push({
				day: date.toFormat("MMM d"),
				applied: dayApplied.length,
				generated: dayGenerated.length,
			});
		}

		return days;
	}, []);

	const MonthlyTrendsChart = ({ data }) => {
		if (!data || data.length === 0) {
			return (
				<div className="flex items-center justify-center h-[400px] text-gray-500">
					<div className="text-center">
						<BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<p className="text-lg font-medium">
							No monthly data available
						</p>
						<p className="text-sm text-gray-400">
							Start generating resumes to see trends
						</p>
					</div>
				</div>
			);
		}

		const chartData = {
			labels: data.map((d) => d.month),
			datasets: [
				{
					label: "Applied",
					data: data.map((d) => d.applied),
					backgroundColor: "rgba(59, 130, 246, 0.8)",
					borderColor: "rgba(59, 130, 246, 1)",
					borderWidth: 2,
					borderRadius: 8,
					borderSkipped: false,
					hoverBackgroundColor: "rgba(59, 130, 246, 1)",
					hoverBorderColor: "rgba(59, 130, 246, 1)",
				},
				{
					label: "Generated",
					data: data.map((d) => d.generated),
					backgroundColor: "rgba(139, 92, 246, 0.8)",
					borderColor: "rgba(139, 92, 246, 1)",
					borderWidth: 2,
					borderRadius: 8,
					borderSkipped: false,
					hoverBackgroundColor: "rgba(139, 92, 246, 1)",
					hoverBorderColor: "rgba(139, 92, 246, 1)",
				},
			],
		};

		const options = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "top" as const,
					labels: {
						usePointStyle: true,
						padding: 20,
						font: {
							size: 12,
							weight: 600,
						},
						generateLabels: (chart) => {
							const datasets = chart.data.datasets;
							return datasets.map((dataset, index) => ({
								text: dataset.label,
								fillStyle: dataset.backgroundColor,
								strokeStyle: dataset.borderColor,
								lineWidth: 2,
								pointStyle: "circle",
								hidden: false,
								index: index,
							}));
						},
					},
				},
				tooltip: {
					backgroundColor: "rgba(255, 255, 255, 0.95)",
					titleColor: "#1f2937",
					bodyColor: "#374151",
					borderColor: "#e5e7eb",
					borderWidth: 1,
					cornerRadius: 8,
					displayColors: true,
					padding: 12,
					titleFont: {
						size: 14,
						weight: 600,
					},
					bodyFont: {
						size: 13,
					},
					callbacks: {
						label: (context) =>
							`${context.dataset.label}: ${context.parsed.y}`,
					},
				},
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
					ticks: {
						font: {
							size: 12,
							weight: 500,
						},
						color: "#6b7280",
					},
				},
				y: {
					beginAtZero: true,
					grid: {
						color: "rgba(229, 231, 235, 0.5)",
						drawBorder: false,
					},
					ticks: {
						font: {
							size: 12,
							weight: 500,
						},
						color: "#6b7280",
						padding: 8,
					},
					border: {
						display: false,
					},
				},
			},
			interaction: {
				intersect: false,
				mode: "index" as const,
			},
			animation: {
				duration: 1000,
				easing: "easeInOutQuart" as const,
			},
		};

		return <Bar data={chartData} options={options} height={400} />;
	};

	const DailyActivityChart = ({ data }) => {
		if (!data || data.length === 0) {
			return (
				<div className="flex items-center justify-center h-[400px] text-gray-500">
					<div className="text-center">
						<TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
						<p className="text-lg font-medium">
							No daily activity data
						</p>
						<p className="text-sm text-gray-400">
							Start applying to jobs to see your activity
						</p>
					</div>
				</div>
			);
		}

		const chartData = {
			labels: data.map((d) => d.day),
			datasets: [
				{
					label: "Applied",
					data: data.map((d) => d.applied),
					borderColor: "rgba(59, 130, 246, 1)",
					backgroundColor: "rgba(59, 130, 246, 0.1)",
					borderWidth: 3,
					tension: 0.4,
					fill: true,
					pointBackgroundColor: "rgba(59, 130, 246, 1)",
					pointBorderColor: "#ffffff",
					pointBorderWidth: 2,
					pointRadius: 6,
					pointHoverRadius: 8,
					pointHoverBorderWidth: 3,
				},
				{
					label: "Generated",
					data: data.map((d) => d.generated),
					borderColor: "rgba(139, 92, 246, 1)",
					backgroundColor: "rgba(139, 92, 246, 0.1)",
					borderWidth: 3,
					tension: 0.4,
					fill: true,
					pointBackgroundColor: "rgba(139, 92, 246, 1)",
					pointBorderColor: "#ffffff",
					pointBorderWidth: 2,
					pointRadius: 6,
					pointHoverRadius: 8,
					pointHoverBorderWidth: 3,
				},
			],
		};

		const options = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "top" as const,
					labels: {
						usePointStyle: true,
						padding: 20,
						font: {
							size: 12,
							weight: 600,
						},
						generateLabels: (chart) => {
							const datasets = chart.data.datasets;
							return datasets.map((dataset, index) => ({
								text: dataset.label,
								fillStyle: dataset.backgroundColor,
								strokeStyle: dataset.borderColor,
								lineWidth: 2,
								pointStyle: "circle",
								hidden: false,
								index: index,
							}));
						},
					},
				},
				tooltip: {
					backgroundColor: "rgba(255, 255, 255, 0.95)",
					titleColor: "#1f2937",
					bodyColor: "#374151",
					borderColor: "#e5e7eb",
					borderWidth: 1,
					cornerRadius: 8,
					displayColors: true,
					padding: 12,
					titleFont: {
						size: 14,
						weight: 600,
					},
					bodyFont: {
						size: 13,
					},
					callbacks: {
						label: (context) =>
							`${context.dataset.label}: ${context.parsed.y}`,
					},
				},
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
					ticks: {
						font: {
							size: 11,
							weight: 500,
						},
						color: "#6b7280",
						maxRotation: 45,
						minRotation: 45,
					},
				},
				y: {
					beginAtZero: true,
					grid: {
						color: "rgba(229, 231, 235, 0.5)",
						drawBorder: false,
					},
					ticks: {
						font: {
							size: 12,
							weight: 500,
						},
						color: "#6b7280",
						padding: 8,
					},
					border: {
						display: false,
					},
				},
			},
			interaction: {
				intersect: false,
				mode: "index" as const,
			},
			animation: {
				duration: 1000,
				easing: "easeInOutQuart" as const,
			},
		};

		return <Line data={chartData} options={options} height={400} />;
	};

	const getStatusBadge = useCallback((status) => {
		const variants = {
			downloaded: "bg-green-100 text-green-800",
			generated: "bg-blue-100 text-blue-800",
			Applied: "bg-green-200 text-green-900",
		};

		const icons = {
			downloaded: "🌊",
			generated: "🏳️",
			Applied: "✅",
		};

		const label =
			status === "downloaded"
				? "Downloaded"
				: status === "generated"
				? "Generated"
				: status;

		return (
			<Badge
				className={`${variants[status]} px-3 py-1 text-sm rounded-full`}
			>
				<span className="mr-1">{icons[status]}</span> {label}
			</Badge>
		);
	}, []);

	const getRelativeTime = useCallback((date) => {
		const now = DateTime.now().setZone("America/New_York");
		const diff = now.diff(date, ["days", "hours", "minutes"]);

		if (diff.days > 0) {
			return `${diff.days}d ago`;
		} else if (diff.hours > 0) {
			return `${diff.hours}h ago`;
		} else if (diff.minutes > 0) {
			return `${diff.minutes}m ago`;
		} else {
			return "Just now";
		}
	}, []);

	const handleFileSelect = useCallback((e) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		// Limit to 5 files max
		const newFiles = [...uploadedFiles, ...files].slice(0, 5);
		setUploadedFiles(newFiles);

		// Create previews for image files
		const previewPromises = newFiles.map((file, index) => {
			return new Promise((resolve) => {
				if (file.type.startsWith("image/")) {
					const reader = new FileReader();
					reader.onload = (e) => {
						resolve({ index, preview: e.target?.result });
					};
					reader.onerror = () => resolve({ index, preview: null });
					reader.readAsDataURL(file);
				} else {
					resolve({ index, preview: null });
				}
			});
		});

		Promise.all(previewPromises).then((results) => {
			const previews = new Array(newFiles.length).fill(null);
			results.forEach(({ index, preview }) => {
				if (preview) {
					previews[index] = preview;
				}
			});
			setFilePreviews(previews);
		});

		// Reset input
		e.target.value = "";
	}, [uploadedFiles]);

	const handleRemoveFile = useCallback((index) => {
		setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
		setFilePreviews((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleRequestAccess = useCallback(async () => {
		if (uploadedFiles.length === 0) {
			toast({
				title: "Files Required",
				description: "Please upload at least one screenshot or proof document.",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("resumeId", String(accessRequestDialog.resumeId));
			formData.append("fileType", accessRequestDialog.fileType);
			formData.append("companyName", accessRequestDialog.companyName);

			// Append all files
			uploadedFiles.forEach((file, index) => {
				formData.append(`files`, file);
			});

			const response = await API.post("/resume/request-download-access", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data.success) {
				toast({
					title: "Request Submitted",
					description: `Your request for ${accessRequestDialog.fileType === "resume" ? "resume" : "job description"} access for ${accessRequestDialog.companyName} has been submitted with ${uploadedFiles.length} file(s). Check back later to download the file if access is approved.`,
				});
				// Reset dialog and files
				setAccessRequestDialog({ open: false, companyName: "", fileType: "", resumeId: null });
				setUploadedFiles([]);
				setFilePreviews([]);
			} else {
				throw new Error(response.data.message || "Failed to submit request");
			}
		} catch (err) {
			console.error("Failed to request access:", err);
			toast({
				title: "Request Failed",
				description: err.response?.data?.message || "Failed to submit access request. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	}, [accessRequestDialog, uploadedFiles, toast]);

	// Memoize chart data calculations for performance
	const monthlyStatsData = useMemo(
		() => calculateMonthlyStats(appliedResumes, generatedResumes),
		[appliedResumes, generatedResumes, calculateMonthlyStats]
	);

	const dailyStatsData = useMemo(
		() => calculateLast30DaysStats(appliedResumes, generatedResumes),
		[appliedResumes, generatedResumes, calculateLast30DaysStats]
	);

	const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
		<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-muted-foreground">{title}</p>
						<p className="text-2xl font-bold text-gray-800">
							{value}
						</p>
						{subtitle && (
							<p className="text-xs text-gray-500 mt-1">
								{subtitle}
							</p>
						)}
					</div>
					<div
						className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
					>
						<Icon className="w-6 h-6 text-white" />
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// If user is tier1 or regular user, show premium upgrade
	// Guest users can access profile, so they're not redirected here
	if (
		currentUser &&
		(currentUser.role === "tier1" || currentUser.role === "user")
	) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
				<Navbar />
				<div className="pt-16">
					<PremiumUpgrade feature="profile" />
				</div>
			</div>
		);
	}

	if (!currentUser) {
		return null;
	}

	// Guest users can access profile without tier guard, others need tier guard
	const profileContent = (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<Navbar />

			<main className="flex-1">
				{loading ? (
				<div className="flex items-center justify-center h-[80vh]">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
				</div>
			) : (
				<div className="max-w-6xl mx-auto p-6 mt-16 space-y-8">
					{/* Header */}
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							📊 Profile Dashboard
						</h1>
						<p className="text-gray-600">
							Your job application performance and resume
							history
						</p>
					</div>

					{/* First Row: User Info + Stats Container and Monthly Trends */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* First Container: User Info and Stats */}
						<div className="space-y-6 flex flex-col">
							{/* User Info Card */}
							<Card className="shadow-md bg-white/80 backdrop-blur-sm flex-1">
								<CardContent className="p-6 text-center space-y-4">
									<div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
										<User className="w-10 h-10 text-white" />
									</div>
									<h2 className="text-xl font-semibold">
										{userInfo.firstname}{" "}
										{userInfo.lastname}
									</h2>
									<p className="text-gray-600 text-sm">
										{userInfo.email}
									</p>
									<Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
										🙋 {userInfo.role || "User"}
									</Badge>
								</CardContent>
							</Card>

							{/* Stats Cards Row */}
							<div className="grid grid-cols-2 gap-4">
								<StatCard
									title="Total Applied"
									value={stats.totalApplied}
									icon={CheckCircle}
									color="bg-gradient-to-r from-green-500 to-green-600"
									subtitle="All time applications"
								/>
								<StatCard
									title="Available Jobs"
									value={stats.availableJobs}
									icon={Briefcase}
									color="bg-gradient-to-r from-blue-500 to-blue-600"
									subtitle="New opportunities"
								/>
							</div>
						</div>

						{/* Second Container: Monthly Trends Chart */}
						<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 flex flex-col">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<BarChart3 className="w-5 h-5 text-blue-600" />
									Monthly Trends
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-1 flex flex-col">
								<div className="flex-1">
									<MonthlyTrendsChart
										data={monthlyStatsData}
									/>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* 30-Day Activity Chart - Full Width */}
					<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								<TrendingUp className="w-5 h-5 text-green-600" />
								30-Day Activity
							</CardTitle>
						</CardHeader>
						<CardContent>
							<DailyActivityChart
								data={dailyStatsData}
							/>
						</CardContent>
					</Card>

					{/* Resume History */}
					<Card className="shadow-md bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Resume History
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Resume History Container with Grid Layout */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Applied Resumes */}
								<div className="space-y-3">
									<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
										<CheckCircle className="w-5 h-5 text-green-600" />
										Applied Resumes (
										{appliedResumes.length})
									</h3>
									<div className="bg-green-50 rounded-lg border border-green-200 p-4 h-80 overflow-y-auto custom-scrollbar resume-section">
										{appliedResumes.length > 0 ? (
											<div className="space-y-3">
												{appliedResumes.map(
													(resume, index) => (
														<div
															key={resume.id}
															className={`flex items-center justify-between p-3 rounded-lg border transition-all relative group ${
																currentUser?.role === "guest" && !resume.hasResumeUrl
																	? "bg-gray-50 border-gray-300 hover:border-gray-400 cursor-pointer"
																	: resume.hasResumeUrl
																	? "bg-white border-green-300 hover:border-green-400 hover:shadow-md cursor-pointer"
																	: "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed"
															}`}
															onClick={() => {
																if (currentUser?.role === "guest" || resume.hasResumeUrl) {
																	downloadResume(resume.id, "resume", resume);
																}
															}}
														>
															{/* Chronological indicator */}
															<div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity ${
																currentUser?.role === "guest" && !resume.hasResumeUrl
																	? "bg-gradient-to-b from-gray-400 to-gray-500"
																	: resume.hasResumeUrl
																	? "bg-gradient-to-b from-green-400 to-green-600"
																	: "bg-gradient-to-b from-gray-300 to-gray-400"
															}`}></div>

															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
																	currentUser?.role === "guest" && !resume.hasResumeUrl
																		? "bg-gradient-to-r from-gray-400 to-gray-500"
																		: resume.hasResumeUrl
																		? "bg-gradient-to-r from-green-500 to-green-600"
																		: "bg-gradient-to-r from-gray-300 to-gray-400"
																}`}>
																	<FileText className="w-4 h-4 text-white" />
																</div>
																<div className="min-w-0 flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<span className="text-xs text-gray-400 font-mono">
																			#
																			{index +
																				1}
																		</span>
																		<h4 className="font-semibold text-gray-800 text-sm truncate">
																			{resume.job_title ===
																			"Unknown Title"
																				? resume.company_name
																				: `${resume.company_name} - ${resume.job_title}`}
																		</h4>
																	</div>
																	<p className="text-xs text-gray-500">
																		Applied:{" "}
																		{resume.updatedAtEST.toFormat(
																			"MMM d, yyyy"
																		)}
																		<span className="text-gray-400 ml-1">
																			(
																			{getRelativeTime(
																				resume.updatedAtEST
																			)}

																			)
																		</span>
																	</p>
																	<p className="text-xs text-gray-400">
																		Generated:{" "}
																		{resume.createdAtEST.toFormat(
																			"MMM d, yyyy"
																		)}
																	</p>
																</div>
															</div>
															<div className="flex-shrink-0 ml-2">
																{getStatusBadge(
																	resume.status
																)}
															</div>
														</div>
													)
												)}
											</div>
										) : (
											<div className="text-center text-gray-500 py-8">
												<CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-300" />
												<p className="text-sm">
													No applied resumes yet
												</p>
											</div>
										)}
									</div>
								</div>

								{/* Generated Resumes */}
								<div className="space-y-3">
									<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
										<FileText className="w-5 h-5 text-blue-600" />
										Generated Resumes (
										{generatedResumes.length})
									</h3>
									<div className="bg-blue-50 rounded-lg border border-blue-200 p-4 h-80 overflow-y-auto custom-scrollbar resume-section">
										{generatedResumes.length > 0 ? (
											<div className="space-y-3">
												{generatedResumes.map(
													(resume, index) => (
														<div
															key={resume.id}
															className={`flex items-center justify-between p-3 rounded-lg border transition-all relative group ${
																currentUser?.role === "guest" && !resume.hasJdLink
																	? "bg-gray-50 border-gray-300 hover:border-gray-400 cursor-pointer"
																	: resume.hasJdLink
																	? "bg-white border-blue-300 hover:border-blue-400 hover:shadow-md cursor-pointer"
																	: "bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed"
															}`}
															onClick={() => {
																if (currentUser?.role === "guest" || resume.hasJdLink) {
																	downloadResume(resume.id, "jd", resume);
																}
															}}
														>
															{/* Chronological indicator */}
															<div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity ${
																currentUser?.role === "guest" && !resume.hasJdLink
																	? "bg-gradient-to-b from-gray-400 to-gray-500"
																	: resume.hasJdLink
																	? "bg-gradient-to-b from-blue-400 to-blue-600"
																	: "bg-gradient-to-b from-gray-300 to-gray-400"
															}`}></div>

															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
																	currentUser?.role === "guest" && !resume.hasJdLink
																		? "bg-gradient-to-r from-gray-400 to-gray-500"
																		: resume.hasJdLink
																		? "bg-gradient-to-r from-blue-500 to-blue-600"
																		: "bg-gradient-to-r from-gray-300 to-gray-400"
																}`}>
																	<FileText className="w-4 h-4 text-white" />
																</div>
																<div className="min-w-0 flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<span className="text-xs text-gray-400 font-mono">
																			#
																			{index +
																				1}
																		</span>
																		<h4 className="font-semibold text-gray-800 text-sm truncate">
																			{resume.job_title ===
																			"Unknown Title"
																				? resume.company_name
																				: `${resume.company_name} - ${resume.job_title}`}
																		</h4>
																	</div>
																	<p className="text-xs text-gray-500">
																		Generated:{" "}
																		{resume.createdAtEST.toFormat(
																			"MMM d, yyyy"
																		)}
																		<span className="text-gray-400 ml-1">
																			(
																			{getRelativeTime(
																				resume.createdAtEST
																			)}

																			)
																		</span>
																	</p>
																	{resume.status ===
																		"Applied" && (
																		<p className="text-xs text-green-600 font-medium">
																			✓
																			Also
																			Applied
																		</p>
																	)}
																</div>
															</div>
															<div className="flex-shrink-0 ml-2">
																{getStatusBadge(
																	resume.status
																)}
															</div>
														</div>
													)
												)}
											</div>
										) : (
											<div className="text-center text-gray-500 py-8">
												<FileText className="w-12 h-12 mx-auto mb-2 text-blue-300" />
												<p className="text-sm">
													No generated resumes yet
												</p>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* No resumes message */}
							{appliedResumes.length === 0 &&
								generatedResumes.length === 0 && (
									<div className="text-center text-gray-500 py-8">
										<FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
										<p className="text-lg font-medium">
											No resumes generated yet
										</p>
										<p className="text-sm text-gray-400">
											Start creating resumes to see
											your history here
										</p>
									</div>
								)}
						</CardContent>
					</Card>
				</div>
				)}
			</main>

			<PageFooter />

			{/* Access Request Dialog for Guest Users - Instant Animation */}
			<Dialog
				open={accessRequestDialog.open}
				onOpenChange={(open) =>
					setAccessRequestDialog({
						...accessRequestDialog,
						open,
					})
				}
			>
				<DialogContent 
					className="sm:max-w-[500px]"
					fastAnimation={true}
				>
					<DialogHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
								<Lock className="w-6 h-6 text-white" />
							</div>
							<DialogTitle className="text-xl">
								Request Download Access
							</DialogTitle>
						</div>
						<DialogDescription className="text-base pt-2">
							You don't have download access for the{" "}
							<span className="font-semibold text-gray-800">
								{accessRequestDialog.fileType === "resume"
									? "resume"
									: "job description"}
							</span>{" "}
							for{" "}
							<span className="font-semibold text-gray-800">
								{accessRequestDialog.companyName}
							</span>
							.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<p className="text-sm text-gray-600">
							Please upload screenshots of screening calls or proof documents to request download access. Your request will be reviewed. Check back later to download the file if access is approved.
						</p>

						{/* File Upload Section */}
						<div className="space-y-3">
							<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<Upload className="w-8 h-8 mb-2 text-gray-400" />
									<p className="mb-2 text-sm text-gray-500">
										<span className="font-semibold">Click to upload</span> or drag and drop
									</p>
									<p className="text-xs text-gray-500">
										PNG, JPG, PDF up to 10MB (Max 5 files)
									</p>
								</div>
								<input
									type="file"
									className="hidden"
									multiple
									accept="image/*,.pdf"
									onChange={handleFileSelect}
									disabled={isSubmitting || uploadedFiles.length >= 5}
								/>
							</label>

							{/* File List */}
							{uploadedFiles.length > 0 && (
								<div className="space-y-2">
									<p className="text-xs font-medium text-gray-700">
										Uploaded Files ({uploadedFiles.length}/5):
									</p>
									<div className="space-y-2 max-h-40 overflow-y-auto">
										{uploadedFiles.map((file, index) => (
											<div
												key={index}
												className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
											>
												{file.type.startsWith("image/") && filePreviews[index] ? (
													<img
														src={filePreviews[index]}
														alt={file.name}
														className="w-10 h-10 object-cover rounded"
													/>
												) : (
													<div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
														<FileText className="w-5 h-5 text-blue-600" />
													</div>
												)}
												<div className="flex-1 min-w-0">
													<p className="text-xs font-medium text-gray-800 truncate">
														{file.name}
													</p>
													<p className="text-xs text-gray-500">
														{(file.size / 1024 / 1024).toFixed(2)} MB
													</p>
												</div>
												<button
													type="button"
													onClick={() => handleRemoveFile(index)}
													disabled={isSubmitting}
													className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() => {
								setAccessRequestDialog({
									open: false,
									companyName: "",
									fileType: "",
									resumeId: null,
								});
								setUploadedFiles([]);
								setFilePreviews([]);
							}}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							onClick={handleRequestAccess}
							disabled={isSubmitting || uploadedFiles.length === 0}
							className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Submitting..." : "Request Access"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);

	// Guest users can access profile without tier guard, others need tier guard
	if (currentUser && currentUser.role === "guest") {
		return profileContent;
	}

	return (
		<TierRouteGuard requiredTier="tier2" feature="profile">
			{profileContent}
		</TierRouteGuard>
	);
}
