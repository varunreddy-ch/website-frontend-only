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
	MessageSquare,
	Edit,
	Eye,
	Search,
	Filter,
	RefreshCw,
	Trash2,
	Flag,
	UserCheck,
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

interface Contact {
	_id: string;
	name: string;
	email: string;
	phone: string;
	whatsappPreferred: boolean;
	message: string;
	status: "new" | "in-progress" | "resolved" | "closed";
	priority: "low" | "medium" | "high" | "urgent";
	assignedTo: string;
	notes: string;
	resolution: string;
	source: "website" | "email" | "phone" | "other";
	createdAt: string;
	updatedAt: string;
}

const AdminContacts: React.FC = () => {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(
		null
	);
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		status: "",
		priority: "",
		assignedTo: "",
		notes: "",
		resolution: "",
	});
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [filterPriority, setFilterPriority] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [stats, setStats] = useState({
		totalContacts: 0,
		newContacts: 0,
		urgentContacts: 0,
		statusStats: [],
		priorityStats: [],
	});
	const { toast } = useToast();

	useEffect(() => {
		fetchContacts();
		fetchStats();
	}, []);

	const fetchContacts = async () => {
		try {
			setLoading(true);
			const response = await API.get("/contact/all");
			setContacts(response.data.contacts || response.data);
		} catch (error) {
			console.error("Error fetching contacts:", error);
			toast({
				title: "Error",
				description: "Failed to fetch contact submissions",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await API.get("/contact/stats");
			setStats(response.data);
		} catch (error) {
			console.error("Error fetching stats:", error);
		}
	};

	const handleContactUpdate = async (contactId: string) => {
		try {
			const response = await API.put(`/contact/${contactId}`, editForm);
			toast({
				title: "Success",
				description: "Contact updated successfully",
			});
			setContacts((prev) =>
				prev.map((contact) =>
					contact._id === contactId ? response.data : contact
				)
			);
			setIsEditing(false);
			setSelectedContact(null);
			fetchStats(); // Refresh stats
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update contact",
				variant: "destructive",
			});
		}
	};

	const handleDeleteContact = async (contactId: string) => {
		if (!confirm("Are you sure you want to delete this contact?")) return;

		try {
			await API.delete(`/contact/${contactId}`);
			toast({
				title: "Success",
				description: "Contact deleted successfully",
			});
			setContacts((prev) => prev.filter((c) => c._id !== contactId));
			fetchStats(); // Refresh stats
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete contact",
				variant: "destructive",
			});
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			new: {
				color: "bg-blue-100 text-blue-800",
				icon: AlertCircle,
			},
			"in-progress": {
				color: "bg-yellow-100 text-yellow-800",
				icon: Clock,
			},
			resolved: {
				color: "bg-green-100 text-green-800",
				icon: CheckCircle,
			},
			closed: { color: "bg-gray-100 text-gray-800", icon: XCircle },
		};

		const config = statusConfig[status as keyof typeof statusConfig];
		const Icon = config.icon;

		return (
			<Badge className={config.color}>
				<Icon className="h-3 w-3 mr-1" />
				{status.charAt(0).toUpperCase() +
					status.slice(1).replace("-", " ")}
			</Badge>
		);
	};

	const getPriorityBadge = (priority: string) => {
		const priorityConfig = {
			low: { color: "bg-gray-100 text-gray-800" },
			medium: { color: "bg-blue-100 text-blue-800" },
			high: { color: "bg-orange-100 text-orange-800" },
			urgent: { color: "bg-red-100 text-red-800" },
		};

		const config = priorityConfig[priority as keyof typeof priorityConfig];

		return (
			<Badge className={config.color}>
				{priority.charAt(0).toUpperCase() + priority.slice(1)}
			</Badge>
		);
	};

	const filteredContacts = contacts.filter((contact) => {
		const matchesStatus =
			filterStatus === "all" || contact.status === filterStatus;
		const matchesPriority =
			filterPriority === "all" || contact.priority === filterPriority;
		const matchesSearch =
			contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			contact.message.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesStatus && matchesPriority && matchesSearch;
	});

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch (error) {
			return new Date(dateString).toLocaleDateString("en-US", {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg">
						Loading contact submissions...
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
								Contact Form Submissions
							</h1>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								Manage and track all contact form submissions
								from potential customers and visitors
							</p>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
							<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{stats.newContacts}
								</div>
								<div className="text-blue-100">New</div>
							</div>
							<div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{
										contacts.filter(
											(c) => c.status === "in-progress"
										).length
									}
								</div>
								<div className="text-yellow-100">
									In Progress
								</div>
							</div>
							<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{
										contacts.filter(
											(c) => c.status === "resolved"
										).length
									}
								</div>
								<div className="text-green-100">Resolved</div>
							</div>
							<div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white text-center">
								<div className="text-3xl font-bold mb-2">
									{stats.urgentContacts}
								</div>
								<div className="text-red-100">Urgent</div>
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
								placeholder="Search by name, email, or message..."
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
									<SelectItem value="new">New</SelectItem>
									<SelectItem value="in-progress">
										In Progress
									</SelectItem>
									<SelectItem value="resolved">
										Resolved
									</SelectItem>
									<SelectItem value="closed">
										Closed
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="priority-filter"
								className="text-sm font-semibold text-gray-700 flex items-center gap-2"
							>
								<Flag className="h-4 w-4" />
								Priority Filter
							</Label>
							<Select
								value={filterPriority}
								onValueChange={setFilterPriority}
							>
								<SelectTrigger className="h-12 text-base">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Priorities
									</SelectItem>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">
										Medium
									</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="urgent">
										Urgent
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-end">
							<Button
								onClick={() => {
									fetchContacts();
									fetchStats();
								}}
								className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
							>
								<RefreshCw className="h-5 w-5 mr-2" />
								Refresh
							</Button>
						</div>
					</div>
				</div>

				{/* Contact List */}
				<div className="space-y-6">
					{filteredContacts.length === 0 ? (
						<Card className="shadow-lg border-0">
							<CardContent className="p-16 text-center">
								<div className="text-gray-400 mb-4">
									<MessageSquare className="h-16 w-16 mx-auto" />
								</div>
								<h3 className="text-xl font-semibold text-gray-600 mb-2">
									No contact submissions found
								</h3>
								<p className="text-gray-500">
									{searchTerm ||
									filterStatus !== "all" ||
									filterPriority !== "all"
										? "Try adjusting your search or filter criteria"
										: "Contact submissions will appear here once customers start submitting forms"}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredContacts.map((contact) => (
							<Card
								key={contact._id}
								className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
							>
								<CardContent className="p-8">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-4 mb-6">
												<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
													<MessageSquare className="h-6 w-6 text-white" />
												</div>
												<div className="flex-1">
													<h3 className="text-2xl font-bold text-gray-900 mb-2">
														{contact.name}
													</h3>
													<div className="flex items-center gap-3 flex-wrap">
														{getStatusBadge(
															contact.status
														)}
														{getPriorityBadge(
															contact.priority
														)}
														<span className="text-sm text-gray-500">
															via {contact.source}
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
															{contact.email}
														</p>
													</div>
												</div>

												{contact.phone && (
													<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
														<Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Phone
															</span>
															<p className="text-gray-900 font-medium">
																{contact.phone}
															</p>
															{contact.whatsappPreferred && (
																<span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
																	<svg
																		className="h-3 w-3"
																		fill="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
																	</svg>
																	Text updates
																	preferred
																</span>
															)}
														</div>
													</div>
												)}

												<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
													<MessageSquare className="h-5 w-5 text-purple-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Message
														</span>
														<p className="text-gray-900 font-medium line-clamp-2">
															{contact.message}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
													<Calendar className="h-5 w-5 text-orange-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Submitted
														</span>
														<p className="text-gray-900 font-medium">
															{formatDate(
																contact.createdAt
															)}
														</p>
													</div>
												</div>

												{contact.assignedTo && (
													<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
														<UserCheck className="h-5 w-5 text-teal-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Assigned To
															</span>
															<p className="text-gray-900 font-medium">
																{
																	contact.assignedTo
																}
															</p>
														</div>
													</div>
												)}

												<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
													<Clock className="h-5 w-5 text-gray-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Last Updated
														</span>
														<p className="text-gray-900 font-medium">
															{formatDate(
																contact.updatedAt
															)}
														</p>
													</div>
												</div>
											</div>

											{contact.notes && (
												<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
													<h4 className="text-sm font-semibold text-blue-900 mb-2">
														Notes
													</h4>
													<p className="text-sm text-blue-800 leading-relaxed">
														{contact.notes}
													</p>
												</div>
											)}

											{contact.resolution && (
												<div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
													<h4 className="text-sm font-semibold text-green-900 mb-2">
														Resolution
													</h4>
													<p className="text-sm text-green-800 leading-relaxed">
														{contact.resolution}
													</p>
												</div>
											)}
										</div>

										<div className="flex gap-3 ml-6">
											<Button
												variant="outline"
												size="lg"
												onClick={() => {
													setSelectedContact(contact);
													setEditForm({
														status: contact.status,
														priority:
															contact.priority,
														assignedTo:
															contact.assignedTo ||
															"",
														notes:
															contact.notes || "",
														resolution:
															contact.resolution ||
															"",
													});
													setIsEditing(true);
												}}
												className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
											>
												<Edit className="h-5 w-5 mr-2" />
												Edit
											</Button>
											<Button
												variant="outline"
												size="lg"
												onClick={() =>
													handleDeleteContact(
														contact._id
													)
												}
												className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
											>
												<Trash2 className="h-5 w-5 mr-2" />
												Delete
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Edit Modal */}
				{isEditing && selectedContact && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<Card className="w-full max-w-lg shadow-2xl border-0">
							<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
								<CardTitle className="text-xl">
									Update Contact
								</CardTitle>
								<CardDescription className="text-blue-100">
									Update the status and details for{" "}
									{selectedContact.name}
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
											<SelectItem value="new">
												New
											</SelectItem>
											<SelectItem value="in-progress">
												In Progress
											</SelectItem>
											<SelectItem value="resolved">
												Resolved
											</SelectItem>
											<SelectItem value="closed">
												Closed
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-3">
									<Label
										htmlFor="priority"
										className="text-sm font-semibold text-gray-700"
									>
										Priority
									</Label>
									<Select
										value={editForm.priority}
										onValueChange={(value) =>
											setEditForm((prev) => ({
												...prev,
												priority: value,
											}))
										}
									>
										<SelectTrigger className="h-12">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="low">
												Low
											</SelectItem>
											<SelectItem value="medium">
												Medium
											</SelectItem>
											<SelectItem value="high">
												High
											</SelectItem>
											<SelectItem value="urgent">
												Urgent
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-3">
									<Label
										htmlFor="assignedTo"
										className="text-sm font-semibold text-gray-700"
									>
										Assigned To
									</Label>
									<Input
										id="assignedTo"
										placeholder="Team member name"
										value={editForm.assignedTo}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												assignedTo: e.target.value,
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
										placeholder="Internal notes..."
										value={editForm.notes}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												notes: e.target.value,
											}))
										}
										rows={3}
										className="resize-none"
									/>
								</div>

								<div className="space-y-3">
									<Label
										htmlFor="resolution"
										className="text-sm font-semibold text-gray-700"
									>
										Resolution
									</Label>
									<Textarea
										id="resolution"
										placeholder="How was this resolved?"
										value={editForm.resolution}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												resolution: e.target.value,
											}))
										}
										rows={3}
										className="resize-none"
									/>
								</div>

								<div className="flex gap-3 pt-4">
									<Button
										onClick={() =>
											handleContactUpdate(
												selectedContact._id
											)
										}
										className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
									>
										Update
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setIsEditing(false);
											setSelectedContact(null);
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

export default AdminContacts;
