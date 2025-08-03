import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import API from "@/api";
import { useNavigate } from "react-router-dom";

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
		} else {
			return b.resumesGenerated - a.resumesGenerated;
		}
	});

	return (
		<div className="min-h-screen bg-[#f8f9fc]">
			<Navbar />

			{loading ? (
				<div className="flex items-center justify-center h-[80vh]">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
				</div>
			) : (
				<div className="max-w-6xl mx-auto p-6 mt-16 space-y-8">
					<Card>
						<CardHeader>
							<CardTitle>Manage Users</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<button
								onClick={() => navigate("/admin")}
								className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
							>
								Go to User Management
							</button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Admin Dashboard</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<Stat label="Users" value={stats.totalUsers} />
							<Stat label="Resumes" value={stats.totalResumes} />
							<Stat
								label="Applied"
								value={stats.resumesApplied}
							/>
							<Stat
								label="Pending"
								value={stats.resumesPending}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<h4 className="text-lg">Generated</h4>
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

							<h4 className="text-lg mt-6">Applied</h4>
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
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Per User Stats</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-end gap-2 text-sm">
								<span className="text-gray-600">Sort by:</span>
								<select
									value={sortKey}
									onChange={(e) => setSortKey(e.target.value)}
									className="border rounded px-2 py-1 text-sm"
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
								</select>
							</div>

							<div className="space-y-2 max-h-96 overflow-y-auto">
								{sortedUsers.map((u) => (
									<div
										key={u.id}
										className="flex justify-between items-center border p-3 rounded-md bg-white"
									>
										<div className="font-medium">
											{u.firstname} {u.lastname}
										</div>
										<div className="flex gap-2 flex-wrap items-center">
											<Badge className="bg-green-100 text-green-900">
												Applied Today:{" "}
												{u.appliedToday || 0}
											</Badge>
											<Badge className="bg-blue-100 text-blue-900 border border-blue-300">
												Generated Today:{" "}
												{u.generatedToday || 0}
											</Badge>
											<Badge className="bg-green-100 text-green-900">
												Applied: {u.resumesApplied}
											</Badge>
											<Badge className="bg-blue-100 text-blue-900 border border-blue-300">
												Generated: {u.resumesGenerated}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}

function Stat({ label, value }) {
	return (
		<div className="text-center border rounded-md py-4">
			<p className="text-sm text-gray-500">{label}</p>
			<p className="text-2xl font-semibold">{value}</p>
		</div>
	);
}
