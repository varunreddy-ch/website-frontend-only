import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth";
import ApplierSubmissionForm from "../components/ApplierSubmissionForm";
import UserNavbar from "../components/UserNavbar";
import PageFooter from "@/components/PageFooter";

export default function ApplierForm() {
	const user = getUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/signin");
			return;
		}

		// Redirect non-applier users to appropriate page based on role
		if (user.role !== "applier") {
			if (user.role === "admin") {
				navigate("/admin");
			} else if (user.role === "tier2" || user.role === "tier4") {
				navigate("/jobs");
			} else {
				// tier1 and user roles go to dashboard
				navigate("/dashboard");
			}
			return;
		}
	}, [user, navigate]);

	if (!user || user.role !== "applier") {
		return null;
	}

	return (
		<div className="bg-gray-100 min-h-screen">
			<UserNavbar />

			<div className="max-w-4xl mx-auto p-4 pt-24">
				{/* Header Section */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Submit Job
					</h1>
					<p className="text-gray-600">
						Share job opportunities with the community
					</p>
				</div>

				{/* Submit Job Form */}
				<ApplierSubmissionForm />
			</div>

			<PageFooter />
		</div>
	);
}
