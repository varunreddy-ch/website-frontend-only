// src/pages/AdminJobs.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	CheckCircle2,
	ExternalLink,
	Loader2,
	XCircle,
	MessageSquare,
	Briefcase,
	Building2,
	Calendar,
	DollarSign,
	Trash2,
	AlertTriangle,
	MapPin,
	User,
	Edit,
} from "lucide-react";
import API from "@/api";
import Navbar from "@/components/Navbar";
import PageFooter from "@/components/PageFooter";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ReportNote = {
	reason: string;
	by: string;
	at?: string | Date;
};

type Job = {
	_id: string;
	company_name: string;
	JD: string;
	job_role: string;
	job_title: string;
	job_link: string;
	salary?: string;
	location?: string;
	pushedBy?: string;
	status: "reported" | "verified" | "expired" | "pending";
	createdAt: string;
	reportNotes?: ReportNote[]; // <— NEW
};

type ConfirmationModal = {
	isOpen: boolean;
	jobId: string | null;
	action: "verify" | "expire" | "delete" | null;
	jobTitle: string;
	companyName: string;
};

type EditModal = {
	isOpen: boolean;
	job: Job | null;
};

const AdminJobs = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionId, setActionId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [confirmationModal, setConfirmationModal] =
		useState<ConfirmationModal>({
			isOpen: false,
			jobId: null,
			action: null,
			jobTitle: "",
			companyName: "",
		});
	const [editModal, setEditModal] = useState<EditModal>({
		isOpen: false,
		job: null,
	});
	const [editFormData, setEditFormData] = useState({
		company_name: "",
		job_description: "",
		job_title: "",
		job_link: "",
		salary: "",
		location: "",
	});
	const [isUpdating, setIsUpdating] = useState(false);

	const fetchJobs = async () => {
		try {
			setLoading(true);
			setError(null);
			// If your admin endpoints are under /admin, switch to "/admin/jobs/reported"
			const { data } = await API.get<Job[]>("/jobs/reported", {
				headers: { Accept: "application/json" },
				withCredentials: true,
			});
			setJobs(data || []);
		} catch (e: any) {
			const msg =
				e?.response?.data?.message ||
				e?.response?.data?.error ||
				e?.message ||
				"Failed to load jobs";
			setError(msg);
			setJobs([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	const openConfirmation = (
		jobId: string,
		action: "verify" | "expire" | "delete",
		jobTitle: string,
		companyName: string
	) => {
		setConfirmationModal({
			isOpen: true,
			jobId,
			action,
			jobTitle,
			companyName,
		});
	};

	const closeConfirmation = () => {
		setConfirmationModal({
			isOpen: false,
			jobId: null,
			action: null,
			jobTitle: "",
			companyName: "",
		});
	};

	const openEditModal = (job: Job) => {
		// Only allow editing pending jobs
		if (job.status !== "pending") {
			setError("Only pending jobs can be edited.");
			return;
		}
		setEditFormData({
			company_name: job.company_name || "",
			job_description: job.JD || "",
			job_title: job.job_title || "",
			job_link: job.job_link || "",
			salary: job.salary || "",
			location: job.location || "",
		});
		setEditModal({ isOpen: true, job });
	};

	const closeEditModal = () => {
		setEditModal({ isOpen: false, job: null });
		setEditFormData({
			company_name: "",
			job_description: "",
			job_title: "",
			job_link: "",
			salary: "",
			location: "",
		});
	};

	const handleUpdateJob = async () => {
		if (!editModal.job) return;

		setIsUpdating(true);
		try {
			await API.patch(
				`/jobs/${editModal.job._id}`,
				{
					company_name: editFormData.company_name,
					job_description: editFormData.job_description,
					job_title: editFormData.job_title,
					job_link: editFormData.job_link,
					salary: editFormData.salary,
					location: editFormData.location,
				},
				{
					headers: { Accept: "application/json" },
					withCredentials: true,
				}
			);
			closeEditModal();
			await fetchJobs();
		} catch (e: any) {
			const msg =
				e?.response?.data?.message ||
				e?.response?.data?.error ||
				e?.message ||
				"Failed to update job";
			setError(msg);
		} finally {
			setIsUpdating(false);
		}
	};

	const doAction = async (
		id: string,
		action: "verify" | "expire" | "delete"
	) => {
		setActionId(id);
		const prev = jobs;
		setJobs((j) => j.filter((x) => x._id !== id)); // optimistic

		try {
			if (action === "delete") {
				await API.delete(`/jobs/${id}`, {
					headers: { Accept: "application/json" },
					withCredentials: true,
				});
			} else if (action === "expire") {
				await API.delete(`/jobs/expire/${id}`, {
					headers: { Accept: "application/json" },
					withCredentials: true,
				});
			} else {
				await API.patch(
					`/jobs/verify/${id}`,
					{},
					{
						headers: { Accept: "application/json" },
						withCredentials: true,
					}
				);
			}
		} catch (e: any) {
			const msg =
				e?.response?.data?.message ||
				e?.response?.data?.error ||
				e?.message ||
				`Failed to ${action} job`;
			setError(msg);
			setJobs(prev); // rollback
		} finally {
			setActionId(null);
			closeConfirmation();
		}
	};

	const getActionButton = (action: "verify" | "expire" | "delete") => {
		switch (action) {
			case "verify":
				return (
					<Button
						onClick={() =>
							doAction(confirmationModal.jobId!, action)
						}
						disabled={actionId === confirmationModal.jobId}
						className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
					>
						<CheckCircle2 className="h-4 w-4 mr-2" />
						{actionId === confirmationModal.jobId ? (
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
						) : null}
						Verify Job
					</Button>
				);
			case "expire":
				return (
					<Button
						onClick={() =>
							doAction(confirmationModal.jobId!, action)
						}
						disabled={actionId === confirmationModal.jobId}
						className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
					>
						<XCircle className="h-4 w-4 mr-2" />
						{actionId === confirmationModal.jobId ? (
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
						) : null}
						Expire Job
					</Button>
				);
			case "delete":
				return (
					<Button
						onClick={() =>
							doAction(confirmationModal.jobId!, action)
						}
						disabled={actionId === confirmationModal.jobId}
						className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{actionId === confirmationModal.jobId ? (
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
						) : null}
						Delete Job
					</Button>
				);
		}
	};

	const getActionDescription = (action: "verify" | "expire" | "delete") => {
		switch (action) {
			case "verify":
				return "This will mark the job as verified and make it available for users to apply.";
			case "expire":
				return "This will mark the job as expired and remove it from active listings.";
			case "delete":
				return "This will permanently delete the job and all associated resumes. This action cannot be undone.";
		}
	};

	const getActionIcon = (action: "verify" | "expire" | "delete") => {
		switch (action) {
			case "verify":
				return <CheckCircle2 className="h-8 w-8 text-green-600" />;
			case "expire":
				return <XCircle className="h-8 w-8 text-amber-600" />;
			case "delete":
				return <Trash2 className="h-8 w-8 text-red-600" />;
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			<Navbar />
			<main className="flex-1">
				<div className="p-6 mt-16">
					<div className="max-w-7xl mx-auto">
					{/* Header Section */}
					<div className="mb-8 text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
							<Briefcase className="h-8 w-8 text-white" />
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Job Management Dashboard
						</h1>
						<p className="text-gray-600 text-lg">
							Review and manage reported job postings
						</p>
					</div>

					{/* Stats Bar */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Briefcase className="h-6 w-6 text-blue-600" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">
										Total Jobs
									</p>
									<p className="text-2xl font-bold text-gray-900">
										{jobs.length}
									</p>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center">
								<div className="p-2 bg-amber-100 rounded-lg">
									<MessageSquare className="h-6 w-6 text-amber-600" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">
										Reported
									</p>
									<p className="text-2xl font-bold text-gray-900">
										{
											jobs.filter(
												(j) => j.status === "reported"
											).length
										}
									</p>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
							<div className="flex items-center">
								<div className="p-2 bg-green-100 rounded-lg">
									<CheckCircle2 className="h-6 w-6 text-green-600" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-600">
										Pending
									</p>
									<p className="text-2xl font-bold text-gray-900">
										{
											jobs.filter(
												(j) => j.status === "pending"
											).length
										}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Controls */}
					<div className="mb-6 flex items-center justify-between bg-white rounded-xl p-4 shadow-lg border border-gray-100">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<MessageSquare className="h-5 w-5 text-amber-600" />
							Reported Jobs
						</h2>
						<Button
							variant="outline"
							onClick={fetchJobs}
							className="bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700"
						>
							<Loader2 className="h-4 w-4 mr-2" />
							Refresh
						</Button>
					</div>

					{loading && (
						<div className="bg-white rounded-xl p-8 flex items-center justify-center gap-3 text-gray-600 shadow-lg border border-gray-100">
							<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
							<span className="text-lg">
								Loading reported jobs...
							</span>
						</div>
					)}

					{!loading && error && (
						<div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 shadow-lg">
							{error}
						</div>
					)}

					{!loading && !error && jobs.length === 0 && (
						<div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-100">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
								<CheckCircle2 className="h-8 w-8 text-green-600" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								All Clear! 🎉
							</h3>
							<p className="text-gray-600">
								No reported jobs to review at the moment.
							</p>
						</div>
					)}

					{!loading && !error && jobs.length > 0 && (
						<div className="space-y-6">
							{jobs.map((job) => {
								const notes = job.reportNotes || [];
								return (
									<div
										key={job._id}
										className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
									>
										{/* Job Header */}
										<div className="flex flex-wrap items-start justify-between gap-4 mb-4">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-3 mb-3">
													<div className="p-2 bg-blue-100 rounded-lg">
														<Briefcase className="h-5 w-5 text-blue-600" />
													</div>
													<h3 className="text-xl font-bold text-gray-900 truncate">
														{job.company_name}
													</h3>
													<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
														{job.status}
													</span>
													{notes.length > 0 && (
														<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
															<MessageSquare className="h-3.5 w-3.5" />
															{notes.length}{" "}
															reports
														</span>
													)}
												</div>

												<div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-3">
													<div className="flex items-center gap-2">
														<Briefcase className="h-4 w-4" />
														<span className="font-medium">
															{job.job_title}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<Briefcase className="h-4 w-4" />
														<span>
															{job.job_role}
														</span>
													</div>
													{job.location && (
														<div className="flex items-center gap-2">
															<MapPin className="h-4 w-4" />
															<span>
																{job.location}
															</span>
														</div>
													)}
													{job.salary && (
														<div className="flex items-center gap-2">
															<DollarSign className="h-4 w-4" />
															<span>
																{job.salary}
															</span>
														</div>
													)}
													{job.pushedBy && (
														<div className="flex items-center gap-2">
															<User className="h-4 w-4" />
															<span>
																Added by:{" "}
																{job.pushedBy}
															</span>
														</div>
													)}
													<div className="flex items-center gap-2">
														<Calendar className="h-4 w-4" />
														<span>
															{new Date(
																job.createdAt
															).toLocaleDateString()}
														</span>
													</div>
												</div>

												<a
													href={job.job_link}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
												>
													<ExternalLink className="h-4 w-4" />
													View Original Posting
												</a>
											</div>

											<div className="flex items-center gap-3">
												{job.status === "pending" && (
													<Button
														variant="outline"
														onClick={() =>
															openEditModal(job)
														}
														disabled={
															actionId === job._id
														}
														className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
													>
														<Edit className="h-4 w-4 mr-2" />
														Edit
													</Button>
												)}
												<Button
													onClick={() =>
														openConfirmation(
															job._id,
															"verify",
															job.job_title,
															job.company_name
														)
													}
													disabled={
														actionId === job._id
													}
													className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
												>
													<CheckCircle2 className="h-4 w-4 mr-2" />
													Verify
												</Button>
												<Button
													variant="outline"
													onClick={() =>
														openConfirmation(
															job._id,
															"expire",
															job.job_title,
															job.company_name
														)
													}
													disabled={
														actionId === job._id
													}
													className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
												>
													<XCircle className="h-4 w-4 mr-2" />
													Expire
												</Button>
												<Button
													variant="outline"
													onClick={() =>
														openConfirmation(
															job._id,
															"delete",
															job.job_title,
															job.company_name
														)
													}
													disabled={
														actionId === job._id
													}
													className="border-red-300 text-red-700 hover:bg-red-50 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</Button>
											</div>
										</div>

										{/* JD Preview - Now Scrollable */}
										<div className="mb-4">
											<details className="group">
												<summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 mb-2">
													<Briefcase className="h-4 w-4 text-blue-600" />
													Job Description Preview
													<span className="text-xs text-gray-500">
														(Click to expand)
													</span>
												</summary>
												<div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
													<div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
														<p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
															{job.JD ||
																"No job description available."}
														</p>
													</div>
												</div>
											</details>
										</div>

										{/* Report Notes */}
										{notes.length > 0 && (
											<div className="border-t border-gray-200 pt-4">
												<details className="group">
													<summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 mb-3">
														<MessageSquare className="h-4 w-4 text-amber-600" />
														Report Notes (
														{notes.length})
														<span className="text-xs text-gray-500">
															(Click to expand)
														</span>
													</summary>
													<div className="space-y-3">
														{notes.map((n, idx) => (
															<div
																key={idx}
																className="bg-amber-50 border border-amber-200 rounded-lg p-4"
															>
																<p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mb-2">
																	{n.reason}
																</p>
																<div className="flex items-center gap-4 text-xs text-gray-500">
																	<span className="flex items-center gap-1">
																		<span className="font-medium">
																			By:
																		</span>
																		{n.by ||
																			"unknown"}
																	</span>
																	{n.at && (
																		<span className="flex items-center gap-1">
																			<span className="font-medium">
																				At:
																			</span>
																			{new Date(
																				n.at
																			).toLocaleString()}
																		</span>
																	)}
																</div>
															</div>
														))}
													</div>
												</details>
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
					</div>
				</div>
			</main>

			{/* Confirmation Modal */}
			{confirmationModal.isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
						<div className="text-center mb-6">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
								{getActionIcon(confirmationModal.action!)}
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								Confirm{" "}
								{confirmationModal.action
									?.charAt(0)
									.toUpperCase() +
									confirmationModal.action?.slice(1)}{" "}
								Job
							</h3>
							<p className="text-gray-600 mb-4">
								Are you sure you want to{" "}
								{confirmationModal.action} this job?
							</p>
							<div className="bg-gray-50 rounded-lg p-3 mb-4">
								<p className="font-medium text-gray-900">
									{confirmationModal.jobTitle}
								</p>
								<p className="text-sm text-gray-600">
									{confirmationModal.companyName}
								</p>
							</div>
							<p className="text-sm text-gray-600 mb-6">
								{getActionDescription(
									confirmationModal.action!
								)}
							</p>
						</div>

						<div className="flex gap-3">
							<Button
								variant="outline"
								onClick={closeConfirmation}
								className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</Button>
							{getActionButton(confirmationModal.action!)}
						</div>
					</div>
				</div>
			)}

			{/* Edit Modal */}
			<Dialog open={editModal.isOpen} onOpenChange={closeEditModal}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">
							Edit Job Details
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="company_name">Company Name *</Label>
							<Input
								id="company_name"
								value={editFormData.company_name}
								onChange={(e) =>
									setEditFormData({
										...editFormData,
										company_name: e.target.value,
									})
								}
								placeholder="Enter company name"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="job_title">Job Title</Label>
							<Input
								id="job_title"
								value={editFormData.job_title}
								onChange={(e) =>
									setEditFormData({
										...editFormData,
										job_title: e.target.value,
									})
								}
								placeholder="Enter job title"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="job_link">Job Link *</Label>
							<Input
								id="job_link"
								value={editFormData.job_link}
								onChange={(e) =>
									setEditFormData({
										...editFormData,
										job_link: e.target.value,
									})
								}
								placeholder="Enter job link"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="location">Location</Label>
								<Input
									id="location"
									value={editFormData.location}
									onChange={(e) =>
										setEditFormData({
											...editFormData,
											location: e.target.value,
										})
									}
									placeholder="Enter location"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="salary">Salary</Label>
								<Input
									id="salary"
									value={editFormData.salary}
									onChange={(e) =>
										setEditFormData({
											...editFormData,
											salary: e.target.value,
										})
									}
									placeholder="Enter salary"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="job_description">
								Job Description *
							</Label>
							<Textarea
								id="job_description"
								value={editFormData.job_description}
								onChange={(e) =>
									setEditFormData({
										...editFormData,
										job_description: e.target.value,
									})
								}
								placeholder="Enter job description"
								className="min-h-[200px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={closeEditModal}
							disabled={isUpdating}
						>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateJob}
							disabled={isUpdating}
							className="bg-blue-600 hover:bg-blue-700"
						>
							{isUpdating ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								<>
									<CheckCircle2 className="h-4 w-4 mr-2" />
									Update Job
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Custom Scrollbar Styles */}
			<style>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: #f1f5f9;
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #cbd5e1;
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}
			`}</style>

			<PageFooter />
		</div>
	);
};

export default AdminJobs;
