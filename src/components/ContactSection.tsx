import { useState } from "react";
import { Send, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/api.js";

const demoFormUrl = "https://forms.gle/AVA1DtN8ZCwx58Cd8";

const ContactSection = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		whatsappPreferred: false,
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSuccess("");
		setError("");
		setLoading(true);

		try {
			const response = await API.post("/contact", formData);

			if (response.status === 200) {
				setSuccess(
					"Your message has been sent successfully! We'll get back to you soon."
				);
				setFormData({
					name: "",
					email: "",
					phone: "",
					whatsappPreferred: false,
					message: "",
				});
			} else {
				throw new Error(
					response.data?.error || "Failed to send message."
				);
			}
		} catch (err: any) {
			setError(
				err.response?.data?.error ||
				err.message ||
				"Failed to send message. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<section
			id="contact"
			className="section-shell bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
		>
			<div className="section-container relative z-10">
				<div className="section-heading mb-16">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6">
						<svg
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h2 className="section-title-light mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
						Get In Touch
					</h2>
					<p className="section-subtitle-light">
						Have questions about our AI-powered resume builder? We'd
						love to hear from you. Send us a message and we'll
						respond within 24 hours.
					</p>
				</div>

				<div className="max-w-3xl mx-auto">
					{/* COMMENTED OUT - Contact form replaced with demo form CTA */}
					{false && (
						<Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
							<CardHeader className="text-center p-8 pb-6">
								<CardTitle className="text-3xl text-white mb-3 font-bold">
									Send us a message
								</CardTitle>
								<p className="text-blue-100 text-lg">
									Fill out our demo registration form at{" "}
									<a
										href={demoFormUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-green-400 hover:text-green-300 underline decoration-green-400/30 hover:decoration-green-400 transition-all duration-300 font-medium"
									>
										ResumeVar Demo Registration
									</a>
								</p>
							</CardHeader>

							<CardContent className="p-8 pt-0">
								<form onSubmit={handleSubmit} className="space-y-8">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-3">
											<label
												htmlFor="name"
												className="block text-white font-semibold text-sm uppercase tracking-wide"
											>
												Full Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<svg
														className="h-5 w-5 text-blue-200"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
														/>
													</svg>
												</div>
												<input
													type="text"
													id="name"
													name="name"
													value={formData.name}
													onChange={handleChange}
													required
													className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm"
													placeholder="Enter your full name"
												/>
											</div>
										</div>

										<div className="space-y-3">
											<label
												htmlFor="email"
												className="block text-white font-semibold text-sm uppercase tracking-wide"
											>
												Email Address
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<svg
														className="h-5 w-5 text-blue-200"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
														/>
													</svg>
												</div>
												<input
													type="email"
													id="email"
													name="email"
													value={formData.email}
													onChange={handleChange}
													required
													className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm"
													placeholder="your.email@example.com"
												/>
											</div>
										</div>
									</div>

									<div className="space-y-3">
										<label
											htmlFor="phone"
											className="block text-white font-semibold text-sm uppercase tracking-wide"
										>
											Phone Number
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<Phone className="h-5 w-5 text-blue-200" />
											</div>
											<input
												type="tel"
												id="phone"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm"
												placeholder="+1 (555) 123-4567"
											/>
										</div>
										<p className="text-xs text-blue-200 mt-1">
											We'll use your number for quick
											responses and updates
										</p>
									</div>

									<div className="flex items-center space-x-3">
										<input
											type="checkbox"
											id="whatsappPreferred"
											name="whatsappPreferred"
											checked={formData.whatsappPreferred}
											onChange={() =>
												setFormData({
													...formData,
													whatsappPreferred:
														!formData.whatsappPreferred,
												})
											}
											className="h-5 w-5 text-cyan-400 focus:ring-cyan-400 border-white/20 rounded"
										/>
										<label
											htmlFor="whatsappPreferred"
											className="text-white text-sm"
										>
											Prefer text updates for communication?
										</label>
									</div>

									<div className="space-y-3">
										<label
											htmlFor="message"
											className="block text-white font-semibold text-sm uppercase tracking-wide"
										>
											Message
										</label>
										<div className="relative">
											<div className="absolute top-4 left-4 flex items-start pointer-events-none">
												<svg
													className="h-5 w-5 text-blue-200 mt-0.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
													/>
												</svg>
											</div>
											<textarea
												id="message"
												name="message"
												value={formData.message}
												onChange={handleChange}
												required
												rows={6}
												className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm resize-none"
												placeholder="Tell us how we can help you with your resume building needs..."
											/>
										</div>
									</div>

									{success && (
										<div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
											<div className="flex items-center justify-center space-x-2 text-green-300">
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
												<span className="font-semibold">
													{success}
												</span>
											</div>
										</div>
									)}
									{error && (
										<div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-center">
											<div className="flex items-center justify-center space-x-2 text-red-300">
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
												<span className="font-semibold">
													{error}
												</span>
											</div>
										</div>
									)}

									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
										disabled={loading}
									>
										{loading ? (
											<div className="flex items-center justify-center space-x-2">
												<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
												<span>Sending Message...</span>
											</div>
										) : (
											<>
												<Send className="mr-3 h-6 w-6" />
												Send Message
											</>
										)}
									</Button>
								</form>
							</CardContent>
						</Card>
					)}

					{/* Demo Registration Section */}
					<Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
						<CardHeader className="text-center p-8 pb-0">
							{/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
								<FileText className="w-10 h-10 text-white" />
							</div> */}
							<CardTitle className="text-3xl text-white mb-3 font-bold">
								Register for a Demo
							</CardTitle>
							<p className="text-blue-100 text-base sm:text-lg">
								Fill out the form so we can tailor the demo to your profile
							</p>
						</CardHeader>

						<CardContent className="p-8 pt-0">
							<div className="space-y-8 text-center">
								<div className="py-8">
									<p className="text-base sm:text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
										Share your details and requirements to help us personalize your demo experience.
									</p>

									<a
										href={demoFormUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="btn-primary px-8 py-3.5 text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
									>
										<FileText className="w-5 h-5" />
										Fill the Demo Registration Form
									</a>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Additional contact information */}
				<div className="mt-16 text-center">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						<div className="space-y-3">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
								<FileText className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-white">
								Demo Registration
							</h3>
							<p className="text-blue-200">
								Submit your details for a tailored demo
							</p>
							<a
								href={demoFormUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-green-400 hover:text-green-300 font-medium"
							>
								Open the Demo Registration Form
							</a>
						</div>

						<div className="space-y-3">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-white">
								24/7 Support
							</h3>
							<p className="text-blue-200">We're here to help</p>
							<p className="text-cyan-400 font-medium">
								Any time, any day
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
