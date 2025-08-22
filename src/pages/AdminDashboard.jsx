import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
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
							label="Weekly Applications"
							value={stats.weeklyStats?.totalApplications || 0}
							icon={TrendingUp}
							color="bg-gradient-to-r from-purple-500 to-purple-600"
							subtitle={`${
								stats.weeklyStats?.usersWithApplications || 0
							} users applied this week`}
						/>
						<StatCard
							label="Application Rate"
							value={`${
								stats.weeklyStats?.applicationRate || 0
							}%`}
							icon={BarChart3}
							color="bg-gradient-to-r from-orange-500 to-orange-600"
							subtitle={`${
								stats.weeklyStats?.averageApplicationsPerUser ||
								0
							} avg per active user`}
						/>
					</div>

					{/* Weekly Application Statistics */}
					<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl">
								<TrendingUp className="w-6 h-6 text-purple-600" />
								Weekly Application Statistics
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
								<StatCard
									label="Total Applications"
									value={
										stats.weeklyStats?.totalApplications ||
										0
									}
									icon={CheckCircle}
									color="bg-gradient-to-r from-green-500 to-green-600"
									subtitle="This week"
								/>
								<StatCard
									label="Active Users"
									value={
										stats.weeklyStats
											?.usersWithApplications || 0
									}
									icon={Users}
									color="bg-gradient-to-r from-blue-500 to-blue-600"
									subtitle="Applied this week"
								/>
								<StatCard
									label="Application Rate"
									value={`${
										stats.weeklyStats?.applicationRate || 0
									}%`}
									icon={BarChart3}
									color="bg-gradient-to-r from-purple-500 to-purple-600"
									subtitle="Of total users"
								/>
								<StatCard
									label="Avg Per User"
									value={
										stats.weeklyStats
											?.averageApplicationsPerUser || 0
									}
									icon={TrendingUp}
									color="bg-gradient-to-r from-orange-500 to-orange-600"
									subtitle="Applications per active user"
								/>
							</div>
						</CardContent>
					</Card>

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
								Showing {stats.userStats.length} total users •
								Sorted by activity level
							</p>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Sort Controls */}
							<div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
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

							{/* User Cards Grid */}
							<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								{sortedUsers.map((u, index) => (
									<div
										key={u.id || u.username}
										className={`group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 ${
											index % 2 === 0
												? "hover:from-blue-50 hover:to-blue-100"
												: "hover:from-purple-50 hover:to-purple-100"
										}`}
										style={{
											animationDelay: `${index * 50}ms`,
											animation:
												"fadeInUp 0.6s ease-out forwards",
											opacity: 0,
											transform: "translateY(20px)",
										}}
									>
										{/* User Header */}
										<div className="flex items-center gap-4 mb-6">
											<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
												{u.firstname?.charAt(0) ||
													u.username?.charAt(0) ||
													"U"}
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-bold text-gray-800 text-lg truncate">
													{u.firstname && u.lastname
														? `${u.firstname} ${u.lastname}`
														: u.username ||
														  "Unknown User"}
												</h3>
												{u.username && (
													<p className="text-sm text-gray-500 font-mono truncate">
														@{u.username}
													</p>
												)}
												{u.userCreatedAt && (
													<p className="text-xs text-gray-400 mt-1">
														Joined:{" "}
														{new Date(
															u.userCreatedAt
														).toLocaleDateString()}
													</p>
												)}
											</div>
										</div>

										{/* Stats Grid */}
										<div className="grid grid-cols-2 gap-4 mb-6">
											{/* Today Applied */}
											<div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-200">
												<div className="text-2xl font-bold text-green-800 mb-1">
													{u.appliedToday || 0}
												</div>
												<div className="text-xs text-green-700 font-medium">
													Today Applied
												</div>
											</div>

											{/* Today Generated */}
											<div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
												<div className="text-2xl font-bold text-blue-800 mb-1">
													{u.generatedToday || 0}
												</div>
												<div className="text-xs text-blue-700 font-medium">
													Today Generated
												</div>
											</div>

											{/* Weekly Apps */}
											<div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-200">
												<div className="text-2xl font-bold text-purple-800 mb-1">
													{u.appliedThisWeek || 0}
												</div>
												<div className="text-xs text-purple-700 font-medium">
													Weekly Apps
												</div>
											</div>

											{/* Total Applied */}
											<div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-200">
												<div className="text-2xl font-bold text-orange-800 mb-1">
													{u.resumesApplied || 0}
												</div>
												<div className="text-xs text-orange-700 font-medium">
													Total Applied
												</div>
											</div>
										</div>

										{/* Additional Stats Row */}
										<div className="grid grid-cols-2 gap-4 mb-6">
											{/* Available Jobs */}
											<div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-3 text-center group-hover:from-indigo-100 group-hover:to-indigo-200 transition-all duration-200">
												<div className="text-lg font-bold text-indigo-800 mb-1">
													{u.availableJobs || 0}
												</div>
												<div className="text-xs text-indigo-700 font-medium">
													Available Jobs
												</div>
											</div>

											{/* Total Generated */}
											<div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 text-center group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-200">
												<div className="text-lg font-bold text-gray-800 mb-1">
													{u.resumesGenerated || 0}
												</div>
												<div className="text-xs text-gray-700 font-medium">
													Total Generated
												</div>
											</div>
										</div>

										{/* Activity Level & Status */}
										<div className="space-y-3">
											{/* Activity Level */}
											<div className="text-center">
												<Badge
													className={`px-3 py-2 text-sm font-medium w-full justify-center ${
														u.activityLevel ===
														"New User"
															? "bg-yellow-100 text-yellow-800 border-yellow-200"
															: u.activityLevel ===
																	"Low Activity" ||
															  u.activityLevel ===
																	"Low-Medium Activity"
															? "bg-blue-100 text-blue-800 border-blue-200"
															: u.activityLevel ===
															  "Medium Activity"
															? "bg-purple-100 text-purple-800 border-purple-200"
															: "bg-green-100 text-green-800 border-green-200"
													}`}
												>
													{u.activityLevel ||
														"New User"}
												</Badge>
											</div>

											{/* Status & Score */}
											<div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-3 text-center">
												<Badge
													variant={
														u.totalActivity === 0
															? "secondary"
															: "default"
													}
													className={`text-xs px-2 py-1 mb-2 ${
														u.totalActivity === 0
															? "bg-yellow-100 text-yellow-800 border-yellow-200"
															: "bg-green-100 text-green-800 border-green-200"
													}`}
												>
													{u.totalActivity === 0
														? "New User"
														: "Active User"}
												</Badge>
												<div className="text-xs text-gray-600">
													Score:{" "}
													<span className="font-semibold">
														{u.activityScore || 0}%
													</span>
												</div>
												<div className="text-xs text-gray-500 mt-1">
													{u.totalActivity || 0}{" "}
													activities
												</div>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Summary Stats */}
							{stats.userStats.length > 0 && (
								<div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
									<h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
										User Activity Distribution
									</h4>
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 text-center">
										<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
											<p className="text-sm text-gray-600 mb-1">
												Total Users
											</p>
											<p className="text-2xl font-bold text-gray-800">
												{stats.userStats.length}
											</p>
										</div>
										<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
											<p className="text-sm text-yellow-600 mb-1">
												New Users
											</p>
											<p className="text-2xl font-bold text-yellow-700">
												{
													stats.userStats.filter(
														(u) =>
															u.totalActivity ===
															0
													).length
												}
											</p>
										</div>
										<div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
											<p className="text-sm text-blue-600 mb-1">
												Low Activity
											</p>
											<p className="text-2xl font-bold text-blue-700">
												{
													stats.userStats.filter(
														(u) =>
															u.totalActivity >
																0 &&
															u.totalActivity <= 5
													).length
												}
											</p>
										</div>
										<div className="bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm">
											<p className="text-sm text-purple-600 mb-1">
												Medium Activity
											</p>
											<p className="text-2xl font-bold text-purple-700">
												{
													stats.userStats.filter(
														(u) =>
															u.totalActivity >
																5 &&
															u.totalActivity <=
																15
													).length
												}
											</p>
										</div>
										<div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
											<p className="text-sm text-green-600 mb-1">
												High Activity
											</p>
											<p className="text-2xl font-bold text-green-700">
												{
													stats.userStats.filter(
														(u) =>
															u.totalActivity > 15
													).length
												}
											</p>
										</div>
										<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm">
											<p className="text-sm text-indigo-600 mb-1">
												Total Activity
											</p>
											<p className="text-2xl font-bold text-indigo-700">
												{stats.userStats.reduce(
													(sum, user) =>
														sum +
														user.resumesGenerated +
														user.resumesApplied,
													0
												)}
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
