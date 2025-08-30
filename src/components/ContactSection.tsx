import { useState } from "react";
import { Send, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/api.js";

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
			className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
		>
			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-20">
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
					<h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
						Get In Touch
					</h2>
					<p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
						Have questions about our AI-powered resume builder? We'd
						love to hear from you. Send us a message and we'll
						respond within 24 hours.
					</p>
				</div>

				<div className="max-w-3xl mx-auto">
					<Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
						<CardHeader className="text-center p-8 pb-6">
							<CardTitle className="text-3xl text-white mb-3 font-bold">
								Send us a message
							</CardTitle>
							<p className="text-blue-100 text-lg">
								Or email us directly at{" "}
								<a
									href="mailto:support@resumevar.com"
									className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-400 transition-all duration-300 font-medium"
								>
									support@resumevar.com
								</a>{" "}
								<br />
								or WhatsApp us at{" "}
								<a
									href="https://wa.me/919573140921"
									target="_blank"
									rel="noopener noreferrer"
									className="text-green-400 hover:text-green-300 underline decoration-green-400/30 hover:decoration-green-400 transition-all duration-300 font-medium"
								>
									+91 9573140921
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
											placeholder="+1 (555) 123-4567 (WhatsApp preferred)"
										/>
									</div>
									<p className="text-xs text-blue-200 mt-1">
										We'll use WhatsApp for quick responses
										and updates
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
										Prefer WhatsApp for communication?
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
				</div>

				{/* Additional contact information */}
				<div className="mt-16 text-center">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						<div className="space-y-3">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full">
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
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-white">
								Email Support
							</h3>
							<p className="text-blue-200">Get help via email</p>
							<a
								href="mailto:support@resumevar.com"
								className="text-cyan-400 hover:text-cyan-300 font-medium"
							>
								support@resumevar.com
							</a>
						</div>

						<div className="space-y-3">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
								<svg
									className="w-6 h-6 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-white">
								WhatsApp Support
							</h3>
							<p className="text-blue-200">
								Get help via WhatsApp
							</p>
							<a
								href="https://wa.me/919573140921"
								target="_blank"
								rel="noopener noreferrer"
								className="text-green-400 hover:text-green-300 font-medium"
							>
								+91 9573140921
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
