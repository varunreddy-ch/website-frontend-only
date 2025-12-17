import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	CheckCircle2,
	XCircle,
	Trash2,
	Download,
	Eye,
	User,
	FileText,
	Building2,
	Loader2,
	Search,
	Filter,
	RefreshCw,
	Calendar,
	Clock,
	Mail,
	AlertCircle,
	CheckCircle,
	Edit,
} from "lucide-react";
import API from "@/api";
import AdminNavbar from "@/components/AdminNavbar";
import PageFooter from "@/components/PageFooter";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/auth";
import { useToast } from "@/hooks/use-toast";

type ProofFile = {
	url: string;
	fileName: string;
	fileSize?: number;
	mimeType?: string;
};

type DownloadAccessRequest = {
	_id: string;
	username: string;
	resumeId: string;
	fileType: "resume" | "jd";
	companyName: string;
	proofFiles: ProofFile[];
	status: "pending" | "approved" | "rejected";
	createdAt: string;
	updatedAt?: string;
	reviewedBy?: string;
	reviewedAt?: string;
	reviewNotes?: string;
	user?: {
		firstname: string;
		lastname: string;
		email?: string;
	};
};

const AdminDownloadRequests = () => {
	const [requests, setRequests] = useState<DownloadAccessRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionId, setActionId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [previewDialog, setPreviewDialog] = useState<{
		isOpen: boolean;
		file: ProofFile | null;
	}>({
		isOpen: false,
		file: null,
	});
	const [deleteConfirm, setDeleteConfirm] = useState<{
		isOpen: boolean;
		requestId: string | null;
		username: string;
	}>({
		isOpen: false,
		requestId: null,
		username: "",
	});
	const [editModal, setEditModal] = useState<{
		isOpen: boolean;
		request: DownloadAccessRequest | null;
	}>({
		isOpen: false,
		request: null,
	});
	const [editForm, setEditForm] = useState({
		reviewNotes: "",
	});

	const navigate = useNavigate();
	const user = getUser();
	const { toast } = useToast();

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/signin");
		}
	}, [user, navigate]);

	const fetchRequests = async () => {
		try {
			setLoading(true);
			setError(null);
			const { data } = await API.get("/admin/download-access-requests");
			setRequests(data.requests || []);
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to fetch requests");
			toast({
				title: "Error",
				description: "Failed to fetch download access requests",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	const handleApprove = async (requestId: string, resumeId: string) => {
		try {
			setActionId(requestId);
			setError(null);
			const { data } = await API.post("/admin/approve-download-access", {
				requestId,
				resumeId,
			});
			setSuccess(data.message || "Request approved successfully");
			toast({
				title: "Success",
				description: "Download access approved successfully",
			});
			fetchRequests();
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Failed to approve request";
			setError(errorMsg);
			toast({
				title: "Error",
				description: errorMsg,
				variant: "destructive",
			});
			setTimeout(() => setError(null), 5000);
		} finally {
			setActionId(null);
		}
	};

	const handleReject = async (requestId: string) => {
		try {
			setActionId(requestId);
			setError(null);
			const { data } = await API.post("/admin/reject-download-access", {
				requestId,
			});
			setSuccess(data.message || "Request rejected");
			toast({
				title: "Success",
				description: "Download access request rejected",
			});
			fetchRequests();
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Failed to reject request";
			setError(errorMsg);
			toast({
				title: "Error",
				description: errorMsg,
				variant: "destructive",
			});
			setTimeout(() => setError(null), 5000);
		} finally {
			setActionId(null);
		}
	};

	const handleDelete = async (requestId: string) => {
		try {
			setActionId(requestId);
			setError(null);
			const { data } = await API.post("/admin/delete-download-access-request", {
				requestId,
			});
			setSuccess(data.message || "Request deleted");
			toast({
				title: "Success",
				description: "Download access request deleted successfully",
			});
			setDeleteConfirm({ isOpen: false, requestId: null, username: "" });
			fetchRequests();
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Failed to delete request";
			setError(errorMsg);
			toast({
				title: "Error",
				description: errorMsg,
				variant: "destructive",
			});
			setTimeout(() => setError(null), 5000);
		} finally {
			setActionId(null);
		}
	};

	const handleUpdateNotes = async (requestId: string) => {
		try {
			setActionId(requestId);
			const { data } = await API.post("/admin/update-download-access-notes", {
				requestId,
				reviewNotes: editForm.reviewNotes,
			});
			toast({
				title: "Success",
				description: "Review notes updated successfully",
			});
			setEditModal({ isOpen: false, request: null });
			setEditForm({ reviewNotes: "" });
			fetchRequests();
		} catch (err: any) {
			toast({
				title: "Error",
				description: "Failed to update review notes",
				variant: "destructive",
			});
		} finally {
			setActionId(null);
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			pending: {
				color: "bg-yellow-100 text-yellow-800",
				icon: AlertCircle,
			},
			approved: {
				color: "bg-green-100 text-green-800",
				icon: CheckCircle,
			},
			rejected: {
				color: "bg-red-100 text-red-800",
				icon: XCircle,
			},
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

	const formatFileSize = (bytes?: number) => {
		if (!bytes) return "N/A";
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const isImage = (mimeType?: string) => {
		return mimeType?.startsWith("image/");
	};

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
			});
		} catch (error) {
			return new Date(dateString).toLocaleDateString("en-US");
		}
	};

	const filteredRequests = requests.filter((request) => {
		const matchesStatus =
			filterStatus === "all" || request.status === filterStatus;
		const matchesSearch =
			request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(request.user?.firstname &&
				request.user.firstname
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) ||
			(request.user?.lastname &&
				request.user.lastname.toLowerCase().includes(searchTerm.toLowerCase()));
		return matchesStatus && matchesSearch;
	});

	const stats = {
		total: requests.length,
		pending: requests.filter((r) => r.status === "pending").length,
		approved: requests.filter((r) => r.status === "approved").length,
		rejected: requests.filter((r) => r.status === "rejected").length,
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
					<p className="text-gray-600 text-sm">
						Loading download access requests...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			<AdminNavbar />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
				{/* Header */}
				<div className="mb-6">
					<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
						<div className="text-center mb-4">
							<h1 className="text-2xl font-bold text-gray-900 mb-2">
								Download Access Requests
							</h1>
							<p className="text-sm text-gray-600 max-w-2xl mx-auto">
								Review and manage download access requests from guest users
							</p>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
							<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
								<div className="text-2xl font-bold mb-1">{stats.total}</div>
								<div className="text-xs text-blue-100">Total Requests</div>
							</div>
							<div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white text-center">
								<div className="text-2xl font-bold mb-1">{stats.pending}</div>
								<div className="text-xs text-yellow-100">Pending</div>
							</div>
							<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
								<div className="text-2xl font-bold mb-1">{stats.approved}</div>
								<div className="text-xs text-green-100">Approved</div>
							</div>
							<div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white text-center">
								<div className="text-2xl font-bold mb-1">{stats.rejected}</div>
								<div className="text-xs text-red-100">Rejected</div>
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor="search"
								className="text-xs font-semibold text-gray-700 flex items-center gap-2"
							>
								<Search className="h-3 w-3" />
								Search
							</Label>
							<Input
								id="search"
								placeholder="Search by username, name, or company..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="h-10 text-sm"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="status-filter"
								className="text-xs font-semibold text-gray-700 flex items-center gap-2"
							>
								<Filter className="h-3 w-3" />
								Status Filter
							</Label>
							<Select value={filterStatus} onValueChange={setFilterStatus}>
								<SelectTrigger className="h-10 text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="approved">Approved</SelectItem>
									<SelectItem value="rejected">Rejected</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-end">
							<Button
								onClick={fetchRequests}
								className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Refresh
							</Button>
						</div>
					</div>
				</div>

				{/* Messages */}
				{success && (
					<div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
						{success}
					</div>
				)}
				{error && (
					<div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
						{error}
					</div>
				)}

				{/* Requests List */}
				<div className="space-y-4">
					{filteredRequests.length === 0 ? (
						<Card className="shadow-md border-0">
							<CardContent className="p-12 text-center">
								<div className="text-gray-400 mb-3">
									<FileText className="h-12 w-12 mx-auto" />
								</div>
								<h3 className="text-lg font-semibold text-gray-600 mb-2">
									No download access requests found
								</h3>
								<p className="text-sm text-gray-500">
									{searchTerm || filterStatus !== "all"
										? "Try adjusting your search or filter criteria"
										: "Download access requests will appear here once guest users start requesting access"}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredRequests.map((request) => (
							<Card
								key={request._id}
								className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden"
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-4">
												<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
													<Download className="h-4 w-4 text-white" />
												</div>
												<div className="flex-1">
													<h3 className="text-lg font-bold text-gray-900 mb-1">
														{request.user?.firstname && request.user?.lastname
															? `${request.user.firstname} ${request.user.lastname}`
															: request.username}
													</h3>
													<div className="flex items-center gap-2 flex-wrap">
														{getStatusBadge(request.status)}
														<span className="text-xs text-gray-500">
															@{request.username}
														</span>
													</div>
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-4">
												<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
													<Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Company
														</span>
														<p className="text-sm text-gray-900 font-medium">
															{request.companyName}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
													<FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															File Type
														</span>
														<p className="text-sm text-gray-900 font-medium capitalize">
															{request.fileType === "resume"
																? "📄 Resume"
																: "📋 Job Description"}
														</p>
													</div>
												</div>

												{request.user?.email && (
													<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
														<Mail className="h-4 w-4 text-purple-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Email
															</span>
															<p className="text-sm text-gray-900 font-medium">
																{request.user.email}
															</p>
														</div>
													</div>
												)}

												<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
													<Calendar className="h-4 w-4 text-orange-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Requested
														</span>
														<p className="text-sm text-gray-900 font-medium">
															{formatDate(request.createdAt)}
														</p>
													</div>
												</div>

												{request.reviewedBy && (
													<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
														<User className="h-4 w-4 text-teal-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Reviewed By
															</span>
															<p className="text-sm text-gray-900 font-medium">
																{request.reviewedBy}
															</p>
														</div>
													</div>
												)}

												{request.reviewedAt && (
													<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
														<Clock className="h-4 w-4 text-indigo-600 flex-shrink-0" />
														<div>
															<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
																Reviewed At
															</span>
															<p className="text-sm text-gray-900 font-medium">
																{formatDate(request.reviewedAt)}
															</p>
														</div>
													</div>
												)}

												<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
													<FileText className="h-4 w-4 text-gray-600 flex-shrink-0" />
													<div>
														<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Resume ID
														</span>
														<p className="text-xs text-gray-900 font-medium font-mono">
															{request.resumeId}
														</p>
													</div>
												</div>
											</div>

											{/* Proof Files */}
											<div className="mb-4">
												<p className="text-xs font-semibold text-gray-700 mb-2">
													Proof Documents ({request.proofFiles.length}):
												</p>
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
													{request.proofFiles.map((file, index) => (
														<div
															key={index}
															className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
														>
															{isImage(file.mimeType) ? (
																<button
																	onClick={() =>
																		setPreviewDialog({
																			isOpen: true,
																			file,
																		})
																	}
																	className="flex items-center gap-1.5 hover:bg-gray-100 rounded px-1.5 py-1 transition-colors flex-1"
																>
																	<Eye className="w-3 h-3 text-blue-600" />
																	<span className="text-xs text-gray-700 truncate flex-1">
																		{file.fileName}
																	</span>
																</button>
															) : (
																<span className="text-xs text-gray-700 truncate flex-1">
																	{file.fileName}
																</span>
															)}
															<a
																href={file.url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-600 hover:text-blue-800"
																title="Download"
															>
																<Download className="w-3 h-3" />
															</a>
															<span className="text-xs text-gray-500">
																{formatFileSize(file.fileSize)}
															</span>
														</div>
													))}
												</div>
											</div>

											{/* Review Notes */}
											{request.reviewNotes && (
												<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
													<h4 className="text-xs font-semibold text-blue-900 mb-1">
														Review Notes
													</h4>
													<p className="text-xs text-blue-800 leading-relaxed">
														{request.reviewNotes}
													</p>
												</div>
											)}
										</div>

										{/* Right: Actions */}
										<div className="flex flex-col gap-2 ml-4">
											{request.status === "pending" && (
												<div className="flex flex-col gap-2">
													<Button
														size="sm"
														onClick={() =>
															handleApprove(request._id, request.resumeId)
														}
														disabled={actionId === request._id}
														className="bg-green-600 hover:bg-green-700 text-white text-xs"
													>
														{actionId === request._id ? (
															<>
																<Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
																Processing...
															</>
														) : (
															<>
																<CheckCircle2 className="w-3 h-3 mr-1.5" />
																Approve
															</>
														)}
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleReject(request._id)}
														disabled={actionId === request._id}
														className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
													>
														{actionId === request._id ? (
															<>
																<Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
																Processing...
															</>
														) : (
															<>
																<XCircle className="w-3 h-3 mr-1.5" />
																Reject
															</>
														)}
													</Button>
												</div>
											)}
											<Button
												size="sm"
												variant="outline"
												onClick={() => {
													setEditModal({
														isOpen: true,
														request,
													});
													setEditForm({
														reviewNotes: request.reviewNotes || "",
													});
												}}
												className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs"
											>
												<Edit className="w-3 h-3 mr-1.5" />
												Edit Notes
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													setDeleteConfirm({
														isOpen: true,
														requestId: request._id,
														username: request.username,
													})
												}
												disabled={actionId === request._id}
												className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
											>
												<Trash2 className="w-3 h-3 mr-1.5" />
												Remove
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			</div>

			{/* Preview Dialog */}
			<Dialog
				open={previewDialog.isOpen}
				onOpenChange={(open) =>
					setPreviewDialog({ isOpen: open, file: null })
				}
			>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
					<DialogHeader>
						<DialogTitle>
							Preview: {previewDialog.file?.fileName}
						</DialogTitle>
					</DialogHeader>
					{previewDialog.file && isImage(previewDialog.file.mimeType) && (
						<div className="flex justify-center">
							<img
								src={previewDialog.file.url}
								alt={previewDialog.file.fileName}
								className="max-w-full h-auto rounded-lg"
							/>
						</div>
					)}
					{previewDialog.file && !isImage(previewDialog.file.mimeType) && (
						<div className="text-center py-8">
							<FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
							<p className="text-gray-600 mb-4">
								Preview not available for this file type
							</p>
							<a
								href={previewDialog.file.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline"
							>
								Download to view
							</a>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Notes Modal */}
			{editModal.isOpen && editModal.request && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<Card className="w-full max-w-lg shadow-xl border-0">
						<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
							<CardTitle className="text-lg">
								Edit Review Notes
							</CardTitle>
							<CardDescription className="text-blue-100 text-xs">
								Add or update review notes for this request
							</CardDescription>
						</CardHeader>
						<CardContent className="p-4 space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="reviewNotes"
									className="text-xs font-semibold text-gray-700"
								>
									Review Notes
								</Label>
								<Textarea
									id="reviewNotes"
									placeholder="Add review notes..."
									value={editForm.reviewNotes}
									onChange={(e) =>
										setEditForm((prev) => ({
											...prev,
											reviewNotes: e.target.value,
										}))
									}
									rows={4}
									className="resize-none text-sm"
								/>
							</div>

							<div className="flex gap-2 pt-2">
								<Button
									onClick={() =>
										handleUpdateNotes(editModal.request!._id)
									}
									disabled={actionId === editModal.request._id}
									className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
								>
									{actionId === editModal.request._id ? (
										<>
											<Loader2 className="w-3 h-3 mr-2 animate-spin" />
											Updating...
										</>
									) : (
										"Update Notes"
									)}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setEditModal({ isOpen: false, request: null });
										setEditForm({ reviewNotes: "" });
									}}
									className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-sm"
								>
									Cancel
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteConfirm.isOpen}
				onOpenChange={(open) =>
					setDeleteConfirm({
						isOpen: open,
						requestId: null,
						username: "",
					})
				}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
					</DialogHeader>
					<p className="text-gray-600">
						Are you sure you want to delete the access request from{" "}
						<strong>{deleteConfirm.username}</strong>? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() =>
								setDeleteConfirm({
									isOpen: false,
									requestId: null,
									username: "",
								})
							}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								deleteConfirm.requestId &&
								handleDelete(deleteConfirm.requestId)
							}
							disabled={actionId === deleteConfirm.requestId}
						>
							{actionId === deleteConfirm.requestId ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<PageFooter />
		</div>
	);
};

export default AdminDownloadRequests;
