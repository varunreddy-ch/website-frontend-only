import { useEffect, useState } from "react";
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
} from "lucide-react";

export default function AdminDashboard() {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sortKey, setSortKey] = useState("generated");
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchStats() {
			try {
				setLoading(true);
				const res = await API.get("/admin/dashboard");
				setStats(res.data);
			} catch (err) {
				console.error("Dashboard load failed", err);
			} finally {
				setLoading(false);
			}
		}
		fetchStats();
	}, []);

	const sortedUsers = stats?.userStats.slice().sort((a, b) => {
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

			{loading ? (
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
						<button
							onClick={() => navigate("/admin")}
							className="px-6 py-3 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
						>
							User Management →
						</button>
					</div>

					{/* Overview Stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<StatCard
							label="Total Users"
							value={stats.totalUsers}
							icon={Users}
							color="bg-gradient-to-r from-blue-500 to-blue-600"
							subtitle="Registered users"
						/>
						<StatCard
							label="Total Resumes"
							value={stats.totalResumes}
							icon={FileText}
							color="bg-gradient-to-r from-green-500 to-green-600"
							subtitle="Generated resumes"
						/>
						<StatCard
							label="Applied Resumes"
							value={stats.resumesApplied}
							icon={CheckCircle}
							color="bg-gradient-to-r from-purple-500 to-purple-600"
							subtitle="Successfully applied"
						/>
						<StatCard
							label="Pending Resumes"
							value={stats.resumesPending}
							icon={Clock}
							color="bg-gradient-to-r from-orange-500 to-orange-600"
							subtitle="Awaiting application"
						/>
					</div>

					{/* Job Statistics */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<StatCard
							label="Total Jobs"
							value={stats.totalJobs}
							icon={Briefcase}
							color="bg-gradient-to-r from-indigo-500 to-indigo-600"
							subtitle="All job postings"
						/>
						<StatCard
							label="Active Jobs"
							value={stats.activeJobs}
							icon={TrendingUp}
							color="bg-gradient-to-r from-emerald-500 to-emerald-600"
							subtitle="Pending verification"
						/>
						<StatCard
							label="Verified Jobs"
							value={stats.verifiedJobs}
							icon={UserCheck}
							color="bg-gradient-to-r from-teal-500 to-teal-600"
							subtitle="Approved jobs"
						/>
						<StatCard
							label="Expired Jobs"
							value={stats.expiredJobs}
							icon={FileCheck}
							color="bg-gradient-to-r from-red-500 to-red-600"
							subtitle="Past deadline"
						/>
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
							<div>
								<h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
									<FileText className="w-5 h-5 text-green-600" />
									Generated Resumes
								</h4>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<Stat
										label="Today"
										value={stats.generatedToday}
									/>
									<Stat
										label="This Week"
										value={stats.generatedThisWeek}
									/>
									<Stat
										label="This Month"
										value={stats.generatedThisMonth}
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
										value={stats.appliedToday}
									/>
									<Stat
										label="This Week"
										value={stats.appliedThisWeek}
									/>
									<Stat
										label="This Month"
										value={stats.appliedThisMonth}
									/>
								</div>
							</div>
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
								Showing {stats.userStats.length} active users •
								Sorted by total activity
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
									className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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

							<div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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
													<div>
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
													{(() => {
														const maxActivity =
															Math.max(
																...sortedUsers.map(
																	(u) =>
																		u.resumesGenerated +
																		u.resumesApplied
																)
															);
														return maxActivity > 0
															? `${Math.round(
																	((u.resumesGenerated +
																		u.resumesApplied) /
																		maxActivity) *
																		100
															  )}%`
															: "0%";
													})()}
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
													style={{
														width: (() => {
															const maxActivity =
																Math.max(
																	...sortedUsers.map(
																		(u) =>
																			u.resumesGenerated +
																			u.resumesApplied
																	)
																);
															return maxActivity >
																0
																? `${Math.max(
																		5,
																		Math.round(
																			((u.resumesGenerated +
																				u.resumesApplied) /
																				maxActivity) *
																				100
																		)
																  )}%`
																: "5%";
														})(),
													}}
												></div>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Summary Stats */}
							{stats.userStats.length > 0 && (
								<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
										<div>
											<p className="text-sm text-gray-600">
												Most Active User
											</p>
											<p className="font-semibold text-gray-800">
												{stats.userStats[0]
													?.firstname &&
												stats.userStats[0]?.lastname
													? `${stats.userStats[0].firstname} ${stats.userStats[0].lastname}`
													: stats.userStats[0]
															?.username || "N/A"}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">
												Total Activity
											</p>
											<p className="font-semibold text-gray-800">
												{stats.userStats.reduce(
													(sum, user) =>
														sum +
														user.resumesGenerated +
														user.resumesApplied,
													0
												)}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">
												Avg Available Jobs
											</p>
											<p className="font-semibold text-gray-800">
												{Math.round(
													stats.userStats.reduce(
														(sum, user) =>
															sum +
															(user.availableJobs ||
																0),
														0
													) / stats.userStats.length
												)}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">
												Active Users
											</p>
											<p className="font-semibold text-gray-800">
												{stats.userStats.length}
											</p>
										</div>
									</div>
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
