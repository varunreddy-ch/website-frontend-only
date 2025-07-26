import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/api.js";

const ContactSection = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess("");
		setError("");
		setLoading(true);

		try {
			const data = await API.post("/contact", formData);

			if (!data.ok) {
				throw new Error(data?.error || "Failed to send message.");
			}

			setSuccess("Your message has been sent successfully!");
			setFormData({ name: "", email: "", message: "" });
		} catch (err) {
			setError(err.message || "Failed to send message.");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<section
			id="contact"
			className="py-20 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900"
		>
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
						Get In Touch
					</h2>
					<p className="text-xl text-blue-100 max-w-2xl mx-auto">
						Have questions? We'd love to hear from you. Send us a
						message and we'll respond as soon as possible.
					</p>
				</div>

				<div className="max-w-2xl mx-auto">
					<Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl text-white mb-2">
								Send us a message
							</CardTitle>
							<p className="text-blue-100">
								Or email us directly at{" "}
								<a
									href="mailto:support@resumevar.com"
									className="text-cyan-400 hover:underline"
								>
									support@resumevar.com
								</a>
							</p>
						</CardHeader>

						<CardContent className="p-8">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-white font-medium mb-2"
									>
										Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
										placeholder="Your name"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-white font-medium mb-2"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
										placeholder="your.email@example.com"
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-white font-medium mb-2"
									>
										Message
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={5}
										className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
										placeholder="Tell us how we can help you..."
									/>
								</div>

								{success && (
									<div className="text-green-300 font-semibold text-center">
										{success}
									</div>
								)}
								{error && (
									<div className="text-red-300 font-semibold text-center">
										{error}
									</div>
								)}

								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
									disabled={loading}
								>
									<Send className="mr-2 h-5 w-5" />
									{loading ? "Sending..." : "Send Message"}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
