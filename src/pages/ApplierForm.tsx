import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth";
import ApplierSubmissionForm from "../components/ApplierSubmissionForm";
import UserNavbar from "../components/UserNavbar";

export default function ApplierForm() {
	const user = getUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/signin");
			return;
		}

		// Redirect non-applier users to dashboard
		if (user.role !== "applier") {
			navigate("/dashboard");
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
						Submit Job Information
					</h1>
					<p className="text-gray-600">
						Share job opportunities with the community
					</p>
				</div>

				{/* Applier Form */}
				<ApplierSubmissionForm />
			</div>
		</div>
	);
}
