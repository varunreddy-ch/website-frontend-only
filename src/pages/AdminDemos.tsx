import React, { useState, useEffect } from "react";
import {
	Calendar,
	Clock,
	Users,
	CheckCircle,
	XCircle,
	AlertCircle,
	Mail,
	Phone,
	Building,
	Edit,
	Eye,
	Search,
	Filter,
	RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import API from "../api";
import AdminNavbar from "@/components/AdminNavbar";

interface Demo {
	_id: string;
	name: string;
	email: string;
	company: string;
	phone: string;
	preferredDate: string;
	preferredTime: string;
	meetingDuration: number;
	meetingType: string;
	status: "pending" | "confirmed" | "completed" | "cancelled";
	notes: string;
	executiveAssigned: string;
	timezone: string;
	createdAt: string;
	updatedAt: string;
}

const AdminDemos: React.FC = () => {
	const [demos, setDemos] = useState<Demo[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		status: "",
		executiveAssigned: "",
		meetingLink: "",
		notes: "",
	});
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const { toast } = useToast();

	useEffect(() => {
		fetchDemos();
	}, []);

	const fetchDemos = async () => {
		try {
			setLoading(true);
			const response = await API.get("/demo/all");
			setDemos(response.data);
		} catch (error) {
			console.error("Error fetching demos:", error);
			toast({
				title: "Error",
				description: "Failed to fetch demo bookings",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleStatusUpdate = async (demoId: string) => {
		try {
			const response = await API.put(`/demo/${demoId}/status`, editForm);
			toast({
				title: "Success",
				description: "Demo status updated successfully",
			});
			setDemos((prev) =>
				prev.map((demo) =>
					demo._id === demoId ? response.data.demo : demo
				)
			);
			setIsEditing(false);
			setSelectedDemo(null);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update demo status",
				variant: "destructive",
			});
		}
	};

	const handleCancelDemo = async (demoId: string, reason: string) => {
		try {
			const response = await API.put(`/demo/${demoId}/cancel`, {
				reason,
			});
			toast({
				title: "Success",
				description: "Demo cancelled successfully",
			});
			setDemos((prev) =>
				prev.map((demo) =>
					demo._id === demoId ? response.data.demo : demo
				)
			);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to cancel demo",
				variant: "destructive",
			});
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			pending: {
				color: "bg-yellow-100 text-yellow-800",
				icon: AlertCircle,
			},
			confirmed: {
				color: "bg-blue-100 text-blue-800",
				icon: CheckCircle,
			},
			completed: {
				color: "bg-green-100 text-green-800",
				icon: CheckCircle,
			},
			cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
		};

		const config = statusConfig[status as keyof typeof statusConfig];
		const Icon = config.icon;

		return (
			<Badge className={config.color}>
				<Icon className="h-3 w-3 mr-1" />
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Badge>
		);
	};

	const filteredDemos = demos.filter((demo) => {
		const matchesStatus =
			filterStatus === "all" || demo.status === filterStatus;
		const matchesSearch =
			demo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			demo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(demo.company &&
				demo.company.toLowerCase().includes(searchTerm.toLowerCase()));
		return matchesStatus && matchesSearch;
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatTime = (timeString: string) => {
		const [hours, minutes] = timeString.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg">
						Loading demo bookings...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			<AdminNavbar />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
				{/* Header */}
				<div className="mb-10">
					<div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
						<div className="text-center mb-6">
							<h1 className="text-4xl font-bold text-gray-900 mb-3">
								Demo Bookings Management
							</h1>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								Manage and track all demo booking requests from
								potential customers
							</p>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
							<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{
										demos.filter(
											(d) => d.status === "pending"
										).length
									}
								</div>
								<div className="text-blue-100">Pending</div>
							</div>
							<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{
										demos.filter(
											(d) => d.status === "confirmed"
										).length
									}
								</div>
								<div className="text-green-100">Confirmed</div>
							</div>
							<div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{
										demos.filter(
											(d) => d.status === "completed"
										).length
									}
								</div>
								<div className="text-purple-100">Completed</div>
							</div>
							<div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{
										demos.filter(
											(d) => d.status === "cancelled"
										).length
									}
								</div>
								<div className="text-red-100">Cancelled</div>
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-3">
							<Label
								htmlFor="search"
								className="text-sm font-semibold text-gray-700 flex items-center gap-2"
							>
								<Search className="h-4 w-4" />
								Search
							</Label>
							<Input
								id="search"
								placeholder="Search by name, email, or company..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="h-12 text-base"
							/>
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="status-filter"
								className="text-sm font-semibold text-gray-700 flex items-center gap-2"
							>
								<Filter className="h-4 w-4" />
								Status Filter
							</Label>
							<Select
								value={filterStatus}
								onValueChange={setFilterStatus}
							>
								<SelectTrigger className="h-12 text-base">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Statuses
									</SelectItem>
									<SelectItem value="pending">
										Pending
									</SelectItem>
									<SelectItem value="confirmed">
										Confirmed
									</SelectItem>
									<SelectItem value="completed">
										Completed
									</SelectItem>
									<SelectItem value="cancelled">
										Cancelled
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-end">
							<Button
								onClick={fetchDemos}
								className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
							>
								<RefreshCw className="h-5 w-5 mr-2" />
								Refresh
							</Button>
						</div>
					</div>
				</div>

				{/* Demo List */}
				<div className="space-y-6">
					{filteredDemos.length === 0 ? (
						<Card className="shadow-lg border-0">
							<CardContent className="p-16 text-center">
								<div className="text-gray-400 mb-4">
									<Users className="h-16 w-16 mx-auto" />
								</div>
								<h3 className="text-xl font-semibold text-gray-600 mb-2">
									No demo bookings found
								</h3>
								<p className="text-gray-500">
									{searchTerm || filterStatus !== "all"
										? "Try adjusting your search or filter criteria"
										: "Demo bookings will appear here once customers start booking"}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredDemos.map((demo) => (
							<Card
								key={demo._id}
								className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
							>
								<CardContent className="p-8">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-4 mb-6">
												<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
													<Users className="h-6 w-6 text-white" />
												</div>
												<div className="flex-1">
													<h3 className="text-2xl font-bold text-gray-900 mb-2">
														{demo.name}
													</h3>
													<div className="flex items-center gap-3 flex-wrap">
														{getStatusBadge(
															demo.status
														)}
														<span className="text-sm text-gray-500">
															{
																demo.meetingDuration
															}{" "}
															min session
														</span>
													</div>
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
												<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
													<Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Email
														</span>
														<p className="text-gray-900 font-medium">
															{demo.email}
														</p>
													</div>
												</div>

												{demo.company && (
													<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
														<Building className="h-5 w-5 text-green-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Company
															</span>
															<p className="text-gray-900 font-medium">
																{demo.company}
															</p>
														</div>
													</div>
												)}

												{demo.phone && (
													<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
														<Phone className="h-5 w-5 text-purple-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Phone
															</span>
															<p className="text-gray-900 font-medium">
																{demo.phone}
															</p>
														</div>
													</div>
												)}

												<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
													<Calendar className="h-5 w-5 text-orange-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Date
														</span>
														<p className="text-gray-900 font-medium">
															{formatDate(
																demo.preferredDate
															)}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
													<Clock className="h-5 w-5 text-indigo-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Time
														</span>
														<p className="text-gray-900 font-medium">
															{formatTime(
																demo.preferredTime
															)}
														</p>
													</div>
												</div>

												{demo.executiveAssigned && (
													<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
														<Users className="h-5 w-5 text-teal-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Assigned To
															</span>
															<p className="text-gray-900 font-medium">
																{
																	demo.executiveAssigned
																}
															</p>
														</div>
													</div>
												)}

												<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
													<Clock className="h-5 w-5 text-gray-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Created
														</span>
														<p className="text-gray-900 font-medium">
															{formatDate(
																demo.createdAt
															)}
														</p>
													</div>
												</div>
											</div>

											{demo.notes && (
												<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
													<h4 className="text-sm font-semibold text-blue-900 mb-2">
														Notes
													</h4>
													<p className="text-sm text-blue-800 leading-relaxed">
														{demo.notes}
													</p>
												</div>
											)}
										</div>

										<div className="flex gap-3 ml-6">
											<Button
												variant="outline"
												size="lg"
												onClick={() => {
													setSelectedDemo(demo);
													setEditForm({
														status: demo.status,
														executiveAssigned:
															demo.executiveAssigned ||
															"",
														meetingLink: "",
														notes: demo.notes || "",
													});
													setIsEditing(true);
												}}
												className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
											>
												<Edit className="h-5 w-5 mr-2" />
												Edit
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Edit Modal */}
				{isEditing && selectedDemo && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<Card className="w-full max-w-lg shadow-2xl border-0">
							<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
								<CardTitle className="text-xl">
									Update Demo Status
								</CardTitle>
								<CardDescription className="text-blue-100">
									Update the status and assign an executive
									for {selectedDemo.name}
								</CardDescription>
							</CardHeader>
							<CardContent className="p-6 space-y-6">
								<div className="space-y-3">
									<Label
										htmlFor="status"
										className="text-sm font-semibold text-gray-700"
									>
										Status
									</Label>
									<Select
										value={editForm.status}
										onValueChange={(value) =>
											setEditForm((prev) => ({
												...prev,
												status: value,
											}))
										}
									>
										<SelectTrigger className="h-12">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pending">
												Pending
											</SelectItem>
											<SelectItem value="confirmed">
												Confirmed
											</SelectItem>
											<SelectItem value="completed">
												Completed
											</SelectItem>
											<SelectItem value="cancelled">
												Cancelled
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-3">
									<Label
										htmlFor="executive"
										className="text-sm font-semibold text-gray-700"
									>
										Executive Assigned
									</Label>
									<Input
										id="executive"
										placeholder="Executive name"
										value={editForm.executiveAssigned}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												executiveAssigned:
													e.target.value,
											}))
										}
										className="h-12"
									/>
								</div>

								<div className="space-y-3">
									<Label
										htmlFor="meeting-link"
										className="text-sm font-semibold text-gray-700"
									>
										Meeting Link
									</Label>
									<Input
										id="meeting-link"
										placeholder="Zoom/Meet/Teams link"
										value={editForm.meetingLink}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												meetingLink: e.target.value,
											}))
										}
										className="h-12"
									/>
								</div>

								<div className="space-y-3">
									<Label
										htmlFor="notes"
										className="text-sm font-semibold text-gray-700"
									>
										Notes
									</Label>
									<Textarea
										id="notes"
										placeholder="Additional notes..."
										value={editForm.notes}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												notes: e.target.value,
											}))
										}
										rows={4}
										className="resize-none"
									/>
								</div>

								<div className="flex gap-3 pt-4">
									<Button
										onClick={() =>
											handleStatusUpdate(selectedDemo._id)
										}
										className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
									>
										Update
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setIsEditing(false);
											setSelectedDemo(null);
										}}
										className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
									>
										Cancel
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminDemos;
