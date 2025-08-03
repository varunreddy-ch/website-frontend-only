import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { User, FileText } from "lucide-react";
import API from "@/api";
import { DateTime } from "luxon";

function getESTStartDates() {
	const estNow = DateTime.now().setZone("America/New_York");
	return {
		startOfToday: estNow.startOf("day"),
		startOfWeek: estNow.startOf("week"),
		startOfMonth: estNow.startOf("month"),
	};
}

export default function Profile() {
	const [userInfo, setUserInfo] = useState({
		firstname: "",
		lastname: "",
		email: "",
		role: "",
	});

	const { id } = useParams();
	const [generatedResumes, setGeneratedResumes] = useState([]);
	const [stats, setStats] = useState({ today: 0, thisWeek: 0, thisMonth: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchResumes() {
			try {
				setLoading(true);
				const { data } = await API.get(`/profile/${id}`);
				setUserInfo(data.user || []);

				const resumes = data.resumes || [];

				// Parse resume.updatedAt with EST zone
				const parsedResumes = resumes.map((r) => ({
					...r,
					updatedAtEST: DateTime.fromISO(r.updatedAt).setZone(
						"America/New_York"
					),
				}));

				setGeneratedResumes(
					parsedResumes.sort(
						(a, b) =>
							b.updatedAtEST.toMillis() -
							a.updatedAtEST.toMillis()
					)
				);

				const { startOfToday, startOfWeek, startOfMonth } =
					getESTStartDates();

				const todayCount = parsedResumes.filter(
					(r) => r.updatedAtEST >= startOfToday
				).length;

				const weekCount = parsedResumes.filter(
					(r) => r.updatedAtEST >= startOfWeek
				).length;

				const monthCount = parsedResumes.filter(
					(r) => r.updatedAtEST >= startOfMonth
				).length;

				setStats({
					today: todayCount,
					thisWeek: weekCount,
					thisMonth: monthCount,
				});
			} catch (err) {
				console.error("Failed to load profile:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchResumes();
	}, [id]);

	const getStatusBadge = (status) => {
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
	};

	return (
		<div className="min-h-screen bg-[#f8f9fc]">
			<Navbar />
			{loading ? (
				<div className="flex items-center justify-center h-[80vh]">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
				</div>
			) : (
				<div className="max-w-6xl mx-auto p-6 mt-16 space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Profile Card */}
						<Card className="col-span-1 shadow-md">
							<CardContent className="p-6 text-center space-y-4">
								<div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
									<User className="w-10 h-10 text-white" />
								</div>
								<h2 className="text-xl font-semibold">
									{userInfo.firstname} {userInfo.lastname}
								</h2>
								<p className="text-gray-600 text-sm">
									{userInfo.email}
								</p>
								<Badge className="bg-blue-100 text-blue-800">
									🙋 {userInfo.role || "User"}
								</Badge>
							</CardContent>
						</Card>

						{/* Stats */}
						<Card className="col-span-1 md:col-span-2 shadow-md">
							<CardHeader>
								<CardTitle>Resume Generation Stats</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
								<div className="border rounded-lg py-4 mt-4">
									<p className="text-sm text-gray-500">
										Today
									</p>
									<p className="text-2xl font-bold">
										{stats.today}
									</p>
								</div>
								<div className="border rounded-lg py-4 mt-4">
									<p className="text-sm text-gray-500">
										This Week
									</p>
									<p className="text-2xl font-bold">
										{stats.thisWeek}
									</p>
								</div>
								<div className="border rounded-lg py-4 mt-4">
									<p className="text-sm text-gray-500">
										This Month
									</p>
									<p className="text-2xl font-bold">
										{stats.thisMonth}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Resume History */}
					<Card className="shadow-md">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Resume History
							</CardTitle>
						</CardHeader>
						<CardContent>
							{generatedResumes.length > 0 ? (
								<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
									{generatedResumes.map((resume) => (
										<div
											key={resume.id}
											className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow transition-all"
										>
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
													<FileText className="w-5 h-5 text-white" />
												</div>
												<div>
													<h3 className="font-semibold text-gray-800">
														{resume.job_title ===
														"Unknown Title"
															? resume.company_name
															: `${resume.job_title} at ${resume.company_name}`}
													</h3>
													<p className="text-sm text-gray-500">
														{resume.updatedAtEST.toFormat(
															"MMM d, yyyy"
														)}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												{getStatusBadge(resume.status)}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-center py-4">
									No resumes generated yet.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
