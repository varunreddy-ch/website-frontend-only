import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import PageFooter from "@/components/PageFooter";
import API from "@/api";
import { useNavigate } from "react-router-dom";
import {
	Users,
	FileText,
	CheckCircle,
	Clock,
	Briefcase,
	TrendingUp,
	Calendar,
	BarChart3,
	UserCheck,
	FileCheck,
	Video,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { DateTime } from "luxon";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Title,
	Tooltip,
	Legend
);

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		overview: null,
		activity: null,
		jobs: null,
		demos: null,
		users: null,
	});
	const [loading, setLoading] = useState({
		overview: true,
		activity: true,
		jobs: true,
		demos: true,
		users: true,
	});
	const [sortKey, setSortKey] = useState("generated");
	const [expandedUsers, setExpandedUsers] = useState(new Set());
	const [userAnalytics, setUserAnalytics] = useState({});
	const [loadingAnalytics, setLoadingAnalytics] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchAllStats() {
			// Fetch all endpoints in parallel
			const endpoints = [
				{ key: "overview", url: "/admin/dashboard/overview" },
				{ key: "activity", url: "/admin/dashboard/activity" },
				{ key: "jobs", url: "/admin/dashboard/jobs" },
				{ key: "demos", url: "/admin/dashboard/demos" },
				{ key: "users", url: "/admin/dashboard/users" },
			];

			const promises = endpoints.map(async ({ key, url }) => {
				try {
					setLoading((prev) => ({ ...prev, [key]: true }));
					const res = await API.get(url);
					if (res.data.success) {
						setStats((prev) => ({
							...prev,
							[key]: res.data,
						}));
					}
				} catch (err) {
					console.error(`Failed to load ${key}:`, err);
				} finally {
					setLoading((prev) => ({ ...prev, [key]: false }));
				}
			});

			await Promise.all(promises);
		}
		fetchAllStats();
	}, []);

	const sortedUsers = useMemo(() => {
		if (!stats?.users?.userStats) return [];
		return stats.users.userStats.slice().sort((a, b) => {
			if (sortKey === "name") {
				return `${a.firstname} ${a.lastname}`.localeCompare(
					`${b.firstname} ${b.lastname}`
				);
			} else if (sortKey === "applied") {
				return b.resumesApplied - a.resumesApplied;
			} else if (sortKey === "appliedToday") {
				return (b.appliedToday || 0) - (a.appliedToday || 0);
			} else if (sortKey === "generatedToday") {
				return (b.generatedToday || 0) - (a.generatedToday || 0);
			} else if (sortKey === "availableJobs") {
				return (b.availableJobs || 0) - (a.availableJobs || 0);
			} else {
				return b.resumesGenerated - a.resumesGenerated;
			}
		});
	}, [stats?.users?.userStats, sortKey]);

	// Calculate maxActivity once to avoid recomputing for each user
	const maxActivity = useMemo(() => {
		if (!sortedUsers || sortedUsers.length === 0) return 0;
		return Math.max(
			...sortedUsers.map(
				(u) => (u.resumesGenerated || 0) + (u.resumesApplied || 0)
			)
		);
	}, [sortedUsers]);

	const fetchUserAnalytics = async (username) => {
		if (userAnalytics[username]) {
			return; // Already fetched
		}

		setLoadingAnalytics((prev) => ({ ...prev, [username]: true }));

		try {
			// Fetch user analytics from the new endpoint
			const response = await API.get(`/admin/user-analytics/${username}`);
			if (response.data.success) {
				setUserAnalytics((prev) => ({
					...prev,
					[username]: {
						appliedResumes: response.data.appliedResumes || [],
						generatedResumes: response.data.generatedResumes || [],
					},
				}));
			}
		} catch (err) {
			console.error(`Failed to fetch analytics for ${username}:`, err);
			// Fallback: try to get data from activity log
			try {
				const activityResponse = await API.get(
					`/admin/user-activity?username=${username}&limit=1000`
				);
				if (activityResponse.data.success) {
					const activities = activityResponse.data.data.activities || [];
					setUserAnalytics((prev) => ({
						...prev,
						[username]: {
							appliedResumes: activities.filter((a) => a.applied),
							generatedResumes: activities,
						},
					}));
				}
			} catch (fallbackErr) {
				console.error("Fallback fetch also failed:", fallbackErr);
				// Set empty data on complete failure
				setUserAnalytics((prev) => ({
					...prev,
					[username]: {
						appliedResumes: [],
						generatedResumes: [],
					},
				}));
			}
		} finally {
			setLoadingAnalytics((prev) => ({ ...prev, [username]: false }));
		}
	};

	const calculateLast30DaysStats = (appliedResumes, generatedResumes) => {
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

	const toggleUserAnalytics = async (username) => {
		const newExpanded = new Set(expandedUsers);
		if (newExpanded.has(username)) {
			// If clicking on the same user, close it
			newExpanded.delete(username);
		} else {
			// Close any previously expanded user (only one at a time)
			newExpanded.clear();
			// Open the new user
			newExpanded.add(username);
			await fetchUserAnalytics(username);
		}
		setExpandedUsers(newExpanded);
	};

	const DailyActivityChart = ({ data, username }) => {
		if (!data || data.length === 0) {
			return (
				<div className="flex items-center justify-center h-[300px] text-gray-500">
					<div className="text-center">
						<TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p className="text-sm font-medium">No activity data</p>
						<p className="text-xs text-gray-400">
							No resumes generated or applied in the last 30 days
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
					pointRadius: 4,
					pointHoverRadius: 6,
					pointHoverBorderWidth: 2,
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
					pointRadius: 4,
					pointHoverRadius: 6,
					pointHoverBorderWidth: 2,
				},
			],
		};

		const options = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "top",
					labels: {
						usePointStyle: true,
						padding: 15,
						font: {
							size: 11,
							weight: 600,
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
					padding: 10,
					titleFont: {
						size: 12,
						weight: 600,
					},
					bodyFont: {
						size: 11,
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
							size: 10,
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
							size: 10,
							weight: 500,
						},
						color: "#6b7280",
						padding: 6,
					},
					border: {
						display: false,
					},
				},
			},
			interaction: {
				intersect: false,
				mode: "index",
			},
			animation: {
				duration: 800,
				easing: "easeInOutQuart",
			},
		};

		return <Line data={chartData} options={options} height={300} />;
	};

	const StatCard = ({ label, value, icon: Icon, color, subtitle }) => (
		<div className="bg-white rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600 font-medium">
							{label}
						</p>
						<p className="text-3xl font-bold text-gray-800 mt-2">
							{value}
						</p>
						{subtitle && (
							<p className="text-xs text-gray-500 mt-1">
								{subtitle}
							</p>
						)}
					</div>
					<div
						className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
					>
						<Icon className="w-7 h-7 text-white" />
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
			<Navbar />

			{loading.overview &&
			loading.activity &&
			loading.jobs &&
			loading.demos &&
			loading.users ? (
				<div className="flex items-center justify-center h-[80vh]">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
				</div>
			) : (
				<div className="max-w-7xl mx-auto p-6 mt-16 space-y-8">
					<div className="text-left mb-4 flex justify-between items-center px-4">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
								📊 Admin Dashboard
							</h1>
							<p className="text-lg text-gray-600">
								Comprehensive overview of system statistics and
								user activity
							</p>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => navigate("/admin")}
								className="px-6 py-3 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
							>
								User Management →
							</button>
							<button
								onClick={() => navigate("/admin/demos")}
								className="px-6 py-3 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
							>
								Demo Management →
							</button>
						</div>
					</div>

					{/* Overview Stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{loading.overview ? (
							<>
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="bg-white rounded-xl shadow-lg border-0 p-6 animate-pulse"
									>
										<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
										<div className="h-8 bg-gray-200 rounded w-1/3"></div>
									</div>
								))}
							</>
						) : (
							<>
								<StatCard
									label="Total Users"
									value={stats.overview?.totalUsers || 0}
									icon={Users}
									color="bg-gradient-to-r from-blue-500 to-blue-600"
									subtitle="Registered users"
								/>
								<StatCard
									label="Total Resumes"
									value={stats.overview?.totalResumes || 0}
									icon={FileText}
									color="bg-gradient-to-r from-green-500 to-green-600"
									subtitle="Generated resumes"
								/>
								<StatCard
									label="Applied Resumes"
									value={stats.overview?.resumesApplied || 0}
									icon={CheckCircle}
									color="bg-gradient-to-r from-purple-500 to-purple-600"
									subtitle="Successfully applied"
								/>
								<StatCard
									label="Pending Resumes"
									value={stats.overview?.resumesPending || 0}
									icon={Clock}
									color="bg-gradient-to-r from-orange-500 to-orange-600"
									subtitle="Awaiting application"
								/>
							</>
						)}
					</div>

					{/* Job Statistics */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{loading.jobs ? (
							<>
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="bg-white rounded-xl shadow-lg border-0 p-6 animate-pulse"
									>
										<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
										<div className="h-8 bg-gray-200 rounded w-1/3"></div>
									</div>
								))}
							</>
						) : (
							<>
								<StatCard
									label="Total Jobs"
									value={stats.jobs?.totalJobs || 0}
									icon={Briefcase}
									color="bg-gradient-to-r from-indigo-500 to-indigo-600"
									subtitle="All job postings"
								/>
								<StatCard
									label="Active Jobs"
									value={stats.jobs?.activeJobs || 0}
									icon={TrendingUp}
									color="bg-gradient-to-r from-emerald-500 to-emerald-600"
									subtitle="Pending verification"
								/>
								<StatCard
									label="Verified Jobs"
									value={stats.jobs?.verifiedJobs || 0}
									icon={UserCheck}
									color="bg-gradient-to-r from-teal-500 to-teal-600"
									subtitle="Approved jobs"
								/>
								<StatCard
									label="Expired Jobs"
									value={stats.jobs?.expiredJobs || 0}
									icon={FileCheck}
									color="bg-gradient-to-r from-red-500 to-red-600"
									subtitle="Past deadline"
								/>
							</>
						)}
					</div>

					{/* Demo Statistics */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{loading.demos ? (
							<>
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="bg-white rounded-xl shadow-lg border-0 p-6 animate-pulse"
									>
										<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
										<div className="h-8 bg-gray-200 rounded w-1/3"></div>
									</div>
								))}
							</>
						) : (
							<>
								<StatCard
									label="Total Demos"
									value={stats.demos?.totalDemos || 0}
									icon={Video}
									color="bg-gradient-to-r from-pink-500 to-pink-600"
									subtitle="Booked demos"
								/>
								<StatCard
									label="Pending Demos"
									value={stats.demos?.pendingDemos || 0}
									icon={Clock}
									color="bg-gradient-to-r from-yellow-500 to-yellow-600"
									subtitle="Awaiting confirmation"
								/>
								<StatCard
									label="Confirmed Demos"
									value={stats.demos?.confirmedDemos || 0}
									icon={CheckCircle}
									color="bg-gradient-to-r from-emerald-500 to-emerald-600"
									subtitle="Scheduled sessions"
								/>
								<StatCard
									label="Completed Demos"
									value={stats.demos?.completedDemos || 0}
									icon={Users}
									color="bg-gradient-to-r from-blue-500 to-blue-600"
									subtitle="Finished sessions"
								/>
							</>
						)}
					</div>

					{/* Recent Activity */}
					<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl">
								<Calendar className="w-6 h-6 text-blue-600" />
								Recent Activity
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{loading.activity ? (
								<div className="space-y-6">
									<div>
										<div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
											{[...Array(3)].map((_, i) => (
												<div
													key={i}
													className="border border-gray-200 rounded-xl py-4 bg-white animate-pulse"
												>
													<div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
													<div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
												</div>
											))}
										</div>
									</div>
								</div>
							) : (
								<>
									<div>
										<h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
											<FileText className="w-5 h-5 text-green-600" />
											Generated Resumes
										</h4>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
											<Stat
												label="Today"
												value={stats.activity?.generatedToday || 0}
											/>
											<Stat
												label="This Week"
												value={stats.activity?.generatedThisWeek || 0}
											/>
											<Stat
												label="This Month"
												value={stats.activity?.generatedThisMonth || 0}
											/>
										</div>
									</div>

									<div>
										<h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
											<CheckCircle className="w-5 h-5 text-purple-600" />
											Applied Resumes
										</h4>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
											<Stat
												label="Today"
												value={stats.activity?.appliedToday || 0}
											/>
											<Stat
												label="This Week"
												value={stats.activity?.appliedThisWeek || 0}
											/>
											<Stat
												label="This Month"
												value={stats.activity?.appliedThisMonth || 0}
											/>
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Per User Stats */}
					<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl">
								<BarChart3 className="w-6 h-6 text-indigo-600" />
								Per User Statistics
							</CardTitle>
							<p className="text-sm text-gray-600 mt-2">
								{loading.users ? (
									"Loading user statistics..."
								) : (
									<>
										Showing {stats.users?.userStats?.length || 0} active users
										• Sorted by total activity
									</>
								)}
							</p>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between items-center">
								<div className="text-sm text-gray-600">
									<span className="font-medium">
										Sort by:
									</span>
								</div>
								<select
									value={sortKey}
									onChange={(e) => setSortKey(e.target.value)}
									disabled={loading.users}
									className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<option value="generated">Generated</option>
									<option value="generatedToday">
										Generated Today
									</option>
									<option value="applied">Applied</option>
									<option value="appliedToday">
										Applied Today
									</option>
									<option value="name">Name</option>
									<option value="availableJobs">
										Available Jobs
									</option>
								</select>
							</div>

							{loading.users ? (
								<div className="flex items-center justify-center h-[400px]">
									<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
								</div>
							) : (
								<div className="space-y-3 max-h-[72rem] overflow-y-auto pr-2 custom-scrollbar">
								{sortedUsers.map((u, index) => (
									<div
										key={u.id || u.username}
										className="group border border-gray-200 p-6 rounded-xl bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-200"
										style={{
											animationDelay: `${index * 50}ms`,
											animation:
												"fadeInUp 0.5s ease-out forwards",
											opacity: 0,
											transform: "translateY(20px)",
										}}
									>
										<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
											{/* User Info */}
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
														{u.firstname?.charAt(
															0
														) ||
															u.username?.charAt(
																0
															) ||
															"U"}
													</div>
													<div className="flex-1">
														<h3 className="font-semibold text-gray-800 text-lg">
															{u.firstname &&
															u.lastname
																? `${u.firstname} ${u.lastname}`
																: u.username ||
																  "Unknown User"}
														</h3>
														{u.username && (
															<p className="text-sm text-gray-500 font-mono">
																@{u.username}
															</p>
														)}
													</div>
													<button
														onClick={() =>
															toggleUserAnalytics(
																u.username
															)
														}
														disabled={loadingAnalytics[u.username]}
														className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
													>
														{loadingAnalytics[u.username] ? (
															<>
																<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
																<span className="text-sm font-medium">
																	Loading...
																</span>
															</>
														) : expandedUsers.has(
																u.username
														  ) ? (
															<>
																<ChevronUp className="w-4 h-4" />
																<span className="text-sm font-medium">
																	Hide Analytics
																</span>
															</>
														) : (
															<>
																<ChevronDown className="w-4 h-4" />
																<span className="text-sm font-medium">
																	View Analytics
																</span>
															</>
														)}
													</button>
												</div>
											</div>

											{/* Stats Grid */}
											<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
												<div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 group-hover:bg-green-100 transition-colors duration-200">
													<p className="text-xs text-green-600 font-medium mb-1">
														Applied Today
													</p>
													<p className="text-lg font-bold text-green-800">
														{u.appliedToday || 0}
													</p>
												</div>
												<div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 group-hover:bg-blue-100 transition-colors duration-200">
													<p className="text-xs text-blue-600 font-medium mb-1">
														Generated Today
													</p>
													<p className="text-lg font-bold text-blue-800">
														{u.generatedToday || 0}
													</p>
												</div>
												<div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200 group-hover:bg-purple-100 transition-colors duration-200">
													<p className="text-xs text-purple-600 font-medium mb-1">
														Total Applied
													</p>
													<p className="text-lg font-bold text-purple-800">
														{u.resumesApplied || 0}
													</p>
												</div>
												<div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200 group-hover:bg-indigo-100 transition-colors duration-200">
													<p className="text-xs text-indigo-600 font-medium mb-1">
														Available Jobs
													</p>
													<p className="text-lg font-bold text-indigo-800">
														{u.availableJobs || 0}
													</p>
												</div>
											</div>

											{/* Total Generated */}
											<div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
												<p className="text-xs text-gray-600 font-medium mb-1">
													Total Generated
												</p>
												<p className="text-2xl font-bold text-gray-800">
													{u.resumesGenerated || 0}
												</p>
											</div>
										</div>

										{/* Progress Bar */}
										<div className="mt-4">
											<div className="flex justify-between text-xs text-gray-600 mb-1">
												<span>Activity Level</span>
												<span>
													{maxActivity > 0
														? `${Math.round(
																((u.resumesGenerated || 0) +
																	(u.resumesApplied || 0)) /
																	maxActivity *
																	100
														  )}%`
														: "0%"}
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
													style={{
														width:
															maxActivity > 0
																? `${Math.max(
																		5,
																		Math.round(
																			((u.resumesGenerated || 0) +
																				(u.resumesApplied || 0)) /
																				maxActivity *
																				100
																		)
																  )}%`
																: "5%",
													}}
												></div>
											</div>
										</div>

										{/* Analytics Dropdown */}
										{expandedUsers.has(u.username) && (
											<div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
												{loadingAnalytics[u.username] ? (
													<div className="flex items-center justify-center h-[300px]">
														<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
													</div>
												) : userAnalytics[u.username] ? (
													<div className="space-y-4">
														<div className="flex items-center gap-2 mb-2">
															<TrendingUp className="w-5 h-5 text-blue-600" />
															<h4 className="text-lg font-semibold text-gray-800">
																30-Day Activity
															</h4>
														</div>
														<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
															<DailyActivityChart
																data={calculateLast30DaysStats(
																	userAnalytics[
																		u.username
																	]
																		?.appliedResumes ||
																		[],
																	userAnalytics[
																		u.username
																	]
																		?.generatedResumes ||
																		[]
																)}
																username={
																	u.username
																}
															/>
														</div>
													</div>
												) : (
													<div className="flex items-center justify-center h-[300px] text-gray-500">
														<div className="text-center">
															<BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
															<p className="text-sm font-medium">
																No analytics data
																available
															</p>
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			<style>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: #f1f5f9;
					border-radius: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #cbd5e1;
					border-radius: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}

				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.fadeInUp {
					animation: fadeInUp 0.5s ease-out forwards;
				}

				/* Smooth transitions for all interactive elements */
				* {
					transition: all 0.2s ease-in-out;
				}

				/* Enhanced hover effects */
				.group:hover .group-hover\\:bg-green-100 {
					background-color: rgb(220 252 225);
				}
				.group:hover .group-hover\\:bg-blue-100 {
					background-color: rgb(219 234 254);
				}
				.group:hover .group-hover\\:bg-purple-100 {
					background-color: rgb(243 232 255);
				}
				.group:hover .group-hover\\:bg-indigo-100 {
					background-color: rgb(224 231 255);
				}
			`}</style>

			<PageFooter />
		</div>
	);
}

function Stat({ label, value }) {
	return (
		<div className="text-center border border-gray-200 rounded-xl py-4 bg-white hover:shadow-md transition-all duration-200">
			<p className="text-sm text-gray-500 font-medium">{label}</p>
			<p className="text-2xl font-bold text-gray-800">{value}</p>
		</div>
	);
}
