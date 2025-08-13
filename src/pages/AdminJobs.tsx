// src/pages/AdminJobs.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	CheckCircle2,
	ExternalLink,
	Loader2,
	XCircle,
	MessageSquare,
} from "lucide-react";
import API from "@/api";
import AdminNavbar from "@/components/AdminNavbar";

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
	status: "reported" | "verified" | "expired";
	createdAt: string;
	reportNotes?: ReportNote[]; // <— NEW
};

const AdminJobs = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionId, setActionId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

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

	const doAction = async (id: string, action: "verify" | "expire") => {
		setActionId(id);
		const prev = jobs;
		setJobs((j) => j.filter((x) => x._id !== id)); // optimistic

		try {
			if (action === "expire") {
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
		}
	};

	return (
		<div className="min-h-screen bg-[#f8f9fc]">
			<AdminNavbar />
			<div className="p-6 mt-16">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-semibold">Reported Jobs</h2>
					<Button variant="outline" onClick={fetchJobs}>
						Refresh
					</Button>
				</div>

				{loading && (
					<div className="p-6 flex items-center gap-3 text-gray-600">
						<Loader2 className="h-5 w-5 animate-spin" />
						Loading reported jobs…
					</div>
				)}

				{!loading && error && (
					<div className="mb-4 text-sm text-red-600">{error}</div>
				)}

				{!loading && !error && jobs.length === 0 && (
					<div className="text-gray-500">No reported jobs 🎉</div>
				)}

				{!loading && !error && jobs.length > 0 && (
					<ul className="space-y-4">
						{jobs.map((job) => {
							const notes = job.reportNotes || [];
							return (
								<li
									key={job._id}
									className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
								>
									<div className="flex flex-wrap items-center justify-between gap-4">
										<div className="min-w-0">
											<div className="flex items-center gap-2">
												<h3 className="font-semibold truncate">
													{job.job_title}
												</h3>
												<span className="text-gray-500">
													•
												</span>
												<p className="text-gray-700 truncate">
													{job.company_name}
												</p>
												<span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100">
													reported
												</span>

												{/* Small badge with report notes count */}
												<span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800">
													<MessageSquare className="h-3.5 w-3.5" />
													{notes.length}
												</span>
											</div>

											<div className="text-sm text-gray-500 mt-1">
												Role: {job.job_role} •{" "}
												{job.salary
													? `Salary: ${job.salary}`
													: "Salary: —"}
											</div>

											<a
												href={job.job_link}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
											>
												View posting{" "}
												<ExternalLink className="h-3.5 w-3.5" />
											</a>
										</div>

										<div className="flex items-center gap-2">
											<Button
												disabled={actionId === job._id}
												onClick={() =>
													doAction(job._id, "verify")
												}
												className="inline-flex items-center gap-2"
											>
												<CheckCircle2 className="h-4 w-4" />
												Verify
											</Button>
											<Button
												variant="outline"
												disabled={actionId === job._id}
												onClick={() =>
													doAction(job._id, "expire")
												}
												className="inline-flex items-center gap-2"
											>
												<XCircle className="h-4 w-4" />
												Expire
											</Button>
										</div>
									</div>

									{/* JD Preview */}
									<details className="mt-3">
										<summary className="cursor-pointer text-sm text-gray-600">
											Preview JD
										</summary>
										<p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
											{job.JD}
										</p>
									</details>

									{/* Report Notes */}
									<details className="mt-3">
										<summary className="cursor-pointer text-sm text-gray-600">
											Report Notes ({notes.length})
										</summary>
										{notes.length === 0 ? (
											<p className="mt-2 text-sm text-gray-500">
												No notes provided.
											</p>
										) : (
											<ul className="mt-2 space-y-2">
												{notes.map((n, idx) => (
													<li
														key={idx}
														className="bg-amber-50 border border-amber-200 rounded p-2"
													>
														<p className="text-sm text-gray-800 whitespace-pre-wrap">
															{n.reason}
														</p>
														<div className="mt-1 text-xs text-gray-500">
															<span>
																By:{" "}
																{n.by ||
																	"unknown"}
															</span>
															{n.at && (
																<>
																	{" "}
																	|{" "}
																	<span>
																		{new Date(
																			n.at
																		).toLocaleString()}
																	</span>
																</>
															)}
														</div>
													</li>
												))}
											</ul>
										)}
									</details>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
};

export default AdminJobs;
