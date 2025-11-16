import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import PageFooter from "@/components/PageFooter";
import {
	User,
	FileText,
	TrendingUp,
	BarChart3,
	CheckCircle,
	Briefcase,
} from "lucide-react";
import API from "@/api";
import { DateTime } from "luxon";
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

export default function PublicProfile() {
	const [searchParams] = useSearchParams();
	const username = searchParams.get("username");

	const [userInfo, setUserInfo] = useState({
		firstname: "",
		lastname: "",
		email: "",
		role: "",
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [generatedResumes, setGeneratedResumes] = useState([]);
	const [appliedResumes, setAppliedResumes] = useState([]);

	useEffect(() => {
		if (username) {
			fetchData();
		} else {
			setError("Username is required");
			setLoading(false);
		}
	}, [username]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError("");

			// Call the public endpoint
			const { data } = await API.get(`/profile-public`, {
				params: { username },
			});

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
		} catch (err: any) {
			console.error("Failed to load profile:", err);
			setError(
				err.response?.data?.error ||
					err.message ||
					"Failed to load profile"
			);
		} finally {
			setLoading(false);
		}
	};

	const downloadResume = async (url: string) => {
		if (!url) {
			return false;
		}

		try {
			const link = document.createElement("a");
			link.href = url; // direct R2 public URL
			link.target = "_blank";

			// Extract company name from URL and create filename
			const urlParts = url.split("/");
			const companyName = urlParts[urlParts.length - 2] || "resume"; // Get the company name
			const userFirstName = userInfo.firstname || "User";
			const userLastName = userInfo.lastname || "";
			const fileName = `${userFirstName}_${userLastName}_${companyName}.pdf`;

			link.download = fileName;
			link.click();
		} catch (err) {
			console.error("Failed to download resume:", err);
			return false;
		}
	};

	const calculateMonthlyStats = (appliedResumes: any[], generatedResumes: any[]) => {
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
	};

	const calculateLast30DaysStats = (appliedResumes: any[], generatedResumes: any[]) => {
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
	};

	const MonthlyTrendsChart = ({ data }: { data: any[] }) => {
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
						generateLabels: (chart: any) => {
							const datasets = chart.data.datasets;
							return datasets.map((dataset: any, index: number) => ({
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
						label: (context: any) =>
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

	const DailyActivityChart = ({ data }: { data: any[] }) => {
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
						generateLabels: (chart: any) => {
							const datasets = chart.data.datasets;
							return datasets.map((dataset: any, index: number) => ({
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
						label: (context: any) =>
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

	const getStatusBadge = (status: string) => {
		const variants: Record<string, string> = {
			downloaded: "bg-green-100 text-green-800",
			generated: "bg-blue-100 text-blue-800",
			Applied: "bg-green-200 text-green-900",
			Generated: "bg-blue-100 text-blue-800",
			Manual: "bg-purple-100 text-purple-800",
		};

		const icons: Record<string, string> = {
			downloaded: "🌊",
			generated: "🏳️",
			Applied: "✅",
			Generated: "📄",
			Manual: "✍️",
		};

		const label =
			status === "downloaded"
				? "Downloaded"
				: status === "generated"
				? "Generated"
				: status;

		return (
			<Badge
				className={`${variants[status] || "bg-gray-100 text-gray-800"} px-3 py-1 text-sm rounded-full`}
			>
				<span className="mr-1">{icons[status] || "📋"}</span> {label}
			</Badge>
		);
	};

	const getRelativeTime = (date: DateTime) => {
		const now = DateTime.now().setZone("America/New_York");
		const diff = now.diff(date, ["days", "hours", "minutes"]);

		if (diff.days > 0) {
			return `${Math.floor(diff.days)}d ago`;
		} else if (diff.hours > 0) {
			return `${Math.floor(diff.hours)}h ago`;
		} else if (diff.minutes > 0) {
			return `${Math.floor(diff.minutes)}m ago`;
		} else {
			return "Just now";
		}
	};

	const StatCard = ({
		title,
		value,
		icon: Icon,
		color,
		subtitle,
	}: {
		title: string;
		value: number;
		icon: any;
		color: string;
		subtitle?: string;
	}) => (
		<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-muted-foreground">{title}</p>
						<p className="text-2xl font-bold text-gray-800">{value}</p>
						{subtitle && (
							<p className="text-xs text-gray-500 mt-1">{subtitle}</p>
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

	if (loading) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
				<Navbar />
				<main className="flex-1 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
				</main>
				<PageFooter />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
				<Navbar />
				<main className="flex-1">
					<div className="max-w-2xl mx-auto p-6 mt-16">
					<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
						<CardContent className="p-8 text-center">
							<div className="text-red-500 mb-4">
								<FileText className="w-16 h-16 mx-auto" />
							</div>
							<h2 className="text-2xl font-bold text-gray-800 mb-2">
								Error Loading Profile
							</h2>
							<p className="text-gray-600">{error}</p>
						</CardContent>
					</Card>
					</div>
				</main>
				<PageFooter />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<Navbar />
			<main className="flex-1">

			<div className="max-w-6xl mx-auto p-6 mt-16 space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						📊 Profile Dashboard
					</h1>
					<p className="text-gray-600">
						Job application performance and resume history
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
									{userInfo.firstname} {userInfo.lastname}
								</h2>
								<p className="text-gray-600 text-sm">{userInfo.email}</p>
								<Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
									🙋 {userInfo.role || "User"}
								</Badge>
							</CardContent>
						</Card>

						{/* Stats Cards Row */}
						<div className="grid grid-cols-2 gap-4">
							<StatCard
								title="Total Applied"
								value={appliedResumes.length}
								icon={CheckCircle}
								color="bg-gradient-to-r from-green-500 to-green-600"
								subtitle="All time applications"
							/>
							<StatCard
								title="Generated"
								value={generatedResumes.length}
								icon={FileText}
								color="bg-gradient-to-r from-blue-500 to-blue-600"
								subtitle="Total generated"
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
									data={calculateMonthlyStats(appliedResumes, generatedResumes)}
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
							data={calculateLast30DaysStats(appliedResumes, generatedResumes)}
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
									Applied Resumes ({appliedResumes.length})
								</h3>
								<div className="bg-green-50 rounded-lg border border-green-200 p-4 h-80 overflow-y-auto custom-scrollbar resume-section">
									{appliedResumes.length > 0 ? (
										<div className="space-y-3">
											{appliedResumes.map((resume, index) => (
												<div
													key={resume.id}
													className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 hover:shadow transition-all relative group cursor-pointer"
													onClick={() => downloadResume(resume.resume_url)}
												>
													{/* Chronological indicator */}
													<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

													<div className="flex items-center gap-3 flex-1 min-w-0">
														<div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
															<FileText className="w-4 h-4 text-white" />
														</div>
														<div className="min-w-0 flex-1">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs text-gray-400 font-mono">
																	#{index + 1}
																</span>
																<h4 className="font-semibold text-gray-800 text-sm truncate">
																	{resume.job_title === "Unknown Title"
																		? resume.company_name
																		: `${resume.company_name} - ${resume.job_title}`}
																</h4>
															</div>
															<p className="text-xs text-gray-500">
																Applied:{" "}
																{resume.updatedAtEST.toFormat("MMM d, yyyy")}
																<span className="text-gray-400 ml-1">
																	({getRelativeTime(resume.updatedAtEST)})
																</span>
															</p>
															<p className="text-xs text-gray-400">
																Generated:{" "}
																{resume.createdAtEST.toFormat("MMM d, yyyy")}
															</p>
														</div>
													</div>
													<div className="flex-shrink-0 ml-2">
														{getStatusBadge(resume.status)}
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center text-gray-500 py-8">
											<CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-300" />
											<p className="text-sm">No applied resumes yet</p>
										</div>
									)}
								</div>
							</div>

							{/* Generated Resumes */}
							<div className="space-y-3">
								<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<FileText className="w-5 h-5 text-blue-600" />
									Generated Resumes ({generatedResumes.length})
								</h3>
								<div className="bg-blue-50 rounded-lg border border-blue-200 p-4 h-80 overflow-y-auto custom-scrollbar resume-section">
									{generatedResumes.length > 0 ? (
										<div className="space-y-3">
											{generatedResumes.map((resume, index) => (
												<div
													key={resume.id}
													className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:shadow transition-all relative group cursor-pointer"
													onClick={() =>
														downloadResume(resume.jd_link || resume.resume_url)
													}
												>
													{/* Chronological indicator */}
													<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

													<div className="flex items-center gap-3 flex-1 min-w-0">
														<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
															<FileText className="w-4 h-4 text-white" />
														</div>
														<div className="min-w-0 flex-1">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs text-gray-400 font-mono">
																	#{index + 1}
																</span>
																<h4 className="font-semibold text-gray-800 text-sm truncate">
																	{resume.job_title === "Unknown Title"
																		? resume.company_name
																		: `${resume.company_name} - ${resume.job_title}`}
																</h4>
															</div>
															<p className="text-xs text-gray-500">
																Generated:{" "}
																{resume.createdAtEST.toFormat("MMM d, yyyy")}
																<span className="text-gray-400 ml-1">
																	({getRelativeTime(resume.createdAtEST)})
																</span>
															</p>
															{resume.status === "Applied" && (
																<p className="text-xs text-green-600 font-medium">
																	✓ Also Applied
																</p>
															)}
														</div>
													</div>
													<div className="flex-shrink-0 ml-2">
														{getStatusBadge(resume.status)}
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center text-gray-500 py-8">
											<FileText className="w-12 h-12 mx-auto mb-2 text-blue-300" />
											<p className="text-sm">No generated resumes yet</p>
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
									<p className="text-lg font-medium">No resumes generated yet</p>
									<p className="text-sm text-gray-400">
										Start creating resumes to see your history here
									</p>
								</div>
							)}
					</CardContent>
				</Card>
			</div>
			</main>

			<PageFooter />
		</div>
	);
}
