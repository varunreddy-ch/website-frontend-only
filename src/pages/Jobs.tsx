import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import GeneratedResumes from "@/components/GeneratedResumes";
import { getUser } from "@/auth";
import { Briefcase, CheckCircle, RefreshCw } from "lucide-react";
import API from "@/api";

export default function Jobs() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [jobStats, setJobStats] = useState({
		availableJobs: 0,
		appliedToday: 0,
	});
	const [refreshing, setRefreshing] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const navigate = useNavigate();
	const currentUser = getUser();

	useEffect(() => {
		if (!currentUser) {
			navigate("/signin");
			return;
		}
		setUser(currentUser);
		fetchJobStats();
	}, []);

	const fetchJobStats = async () => {
		try {
			setRefreshing(true);

			// Use the new dedicated job stats endpoint
			const { data } = await API.get(`/user-job-stats`);

			if (data.success) {
				const { availableJobs, appliedToday } = data.data;

				setJobStats({
					availableJobs,
					appliedToday,
				});
			} else {
				throw new Error("Failed to fetch job stats");
			}
		} catch (err) {
			console.error("Failed to fetch job stats:", err);
			// Set default values if API fails
			setJobStats({
				availableJobs: -1,
				appliedToday: -1,
			});
		} finally {
			setRefreshing(false);
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		setRefreshKey((prev) => prev + 1);
		await fetchJobStats();
		setRefreshing(false);
	};

	const StatCard = ({
		title,
		value,
		icon: Icon,
		color,
		subtitle,
		change,
	}) => (
		<Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-muted-foreground font-medium">
							{title}
						</p>
						<p className="text-3xl font-bold text-gray-800 mt-2">
							{value}
						</p>
						{subtitle && (
							<p className="text-xs text-gray-500 mt-1">
								{subtitle}
							</p>
						)}
						{change && (
							<div className="flex items-center gap-1 text-sm text-green-600 mt-2">
								{/* <TrendingUp className="w-3 h-3" /> */}
								{change}
							</div>
						)}
					</div>
					<div
						className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
					>
						<Icon className="w-7 h-7 text-white" />
					</div>
				</div>
			</CardContent>
		</Card>
	);

	if (!currentUser) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
			<Navbar />

			<div className="max-w-7xl mx-auto p-6 mt-16 space-y-8">
				{/* Header Section */}
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
							💼 Jobs for You
						</h1>
						<p className="text-lg text-gray-600 max-w-2xl">
							Track your generated resumes and discover new
							opportunities tailored to your profile
						</p>
					</div>
					<Button
						onClick={handleRefresh}
						disabled={refreshing}
						className="inline-flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<RefreshCw
							className={`h-5 w-5 ${
								refreshing ? "animate-spin" : ""
							}`}
						/>
						{refreshing ? "Refreshing..." : "Refresh"}
					</Button>
				</div>

				{/* Enhanced Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<StatCard
						title="Available Jobs"
						value={jobStats.availableJobs}
						icon={Briefcase}
						color="bg-gradient-to-r from-blue-500 to-blue-600"
						subtitle="New opportunities"
						change=""
					/>
					<StatCard
						title="Applied Today"
						value={jobStats.appliedToday}
						icon={CheckCircle}
						color="bg-gradient-to-r from-green-500 to-green-600"
						subtitle="Today's applications"
						change=""
					/>
				</div>

				{/* Generated Resumes Section */}
				<div className="bg-white rounded-xl shadow-lg p-8">
					<div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
						<GeneratedResumes
							key={refreshKey}
							fullName={
								currentUser?.firstname
									? currentUser.firstname
											.split(" ")
											.filter(Boolean)
											.join("_")
									: "user"
							}
						/>
					</div>
				</div>
			</div>

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
			`}</style>
		</div>
	);
}
