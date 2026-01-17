import {
	Facebook,
	Linkedin,
	Twitter,
	MapPin,
	Heart,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const demoFormUrl = "https://forms.gle/AVA1DtN8ZCwx58Cd8";

const Footer = () => {
	return (
		<footer className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 text-white overflow-hidden">
			{/* Subtle background pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
				<div className="absolute top-40 right-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 left-1/3 w-36 h-36 bg-indigo-400 rounded-full blur-3xl"></div>
			</div>

			<div className="relative container mx-auto px-6 py-12">
				{/* Header Section */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center space-x-3 mb-3">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
							<FileText className="h-4 w-4 text-white" />
						</div>
						<span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
							ResumeVar
						</span>
					</div>
					<p className="text-base text-blue-200 max-w-xl mx-auto leading-relaxed">
						Empowering professionals worldwide with AI-powered
						resume creation tools that help you land your dream job.
					</p>
				</div>

				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* Product */}
					<div className="text-center lg:text-left">
						<h4 className="text-base font-semibold text-white mb-4">
							Product
						</h4>
						<ul className="space-y-2">
							{[
								"AI Resume Builder",
								"Professional Templates",
								"Cover Letter Generator",
								"ATS Optimization",
							].map((item) => (
								<li key={item}>
									<Button
										variant="ghost"
										className="text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-sm h-auto p-1.5 w-full lg:w-auto justify-center lg:justify-start"
									>
										{item}
									</Button>
								</li>
							))}
						</ul>
					</div>

					{/* Support */}
					<div className="text-center lg:text-left">
						<h4 className="text-base font-semibold text-white mb-4">
							Support
						</h4>
						<ul className="space-y-2">
							{[
								"Help Center",
								"Contact Support",
								"Video Tutorials",
								"Resume Tips",
							].map((item) => (
								<li key={item}>
									<Button
										variant="ghost"
										className="text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-sm h-auto p-1.5 w-full lg:w-auto justify-center lg:justify-start"
									>
										{item}
									</Button>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div className="text-center lg:text-left">
						<h4 className="text-base font-semibold text-white mb-4">
							Company
						</h4>
						<ul className="space-y-2">
							{["About Us", "Careers", "Blog", "Partners"].map(
								(item) => (
									<li key={item}>
										<Button
											variant="ghost"
											className="text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-sm h-auto p-1.5 w-full lg:w-auto justify-center lg:justify-start"
										>
											{item}
										</Button>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Contact Info */}
					<div className="text-center lg:text-left">
						<h4 className="text-base font-semibold text-white mb-4">
							Get in Touch
						</h4>
						<div className="space-y-3">
							<a
								href={demoFormUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center lg:justify-start space-x-3 text-blue-200 hover:text-green-300 transition-colors"
							>
								<FileText className="h-4 w-4 flex-shrink-0" />
								<span className="text-sm">
									Demo Registration Form
								</span>
							</a>
							<div className="flex items-center justify-center lg:justify-start space-x-3 text-blue-200">
								<MapPin className="h-4 w-4 flex-shrink-0" />
								<span className="text-sm">
									San Francisco, CA
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Social Media Section */}
				<div className="text-center mb-8">
					<h4 className="text-base font-semibold text-white mb-4">
						Follow Us
					</h4>
					<div className="flex justify-center space-x-4">
						<Button
							size="icon"
							variant="ghost"
							className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
						>
							<Facebook className="h-4 w-4 text-blue-300" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
						>
							<Linkedin className="h-4 w-4 text-blue-300" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
						>
							<Twitter className="h-4 w-4 text-blue-300" />
						</Button>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-white/20 pt-6">
					<div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
						<div className="flex items-center space-x-2 text-blue-200 text-sm">
							<span>© 2024 ResumeVar. Made with</span>
							<Heart className="h-4 w-4 text-pink-400" />
							<span>for professionals worldwide</span>
						</div>
						<div className="flex flex-wrap justify-center lg:justify-end gap-3">
							<Button
								variant="ghost"
								className="text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-sm h-auto py-1 px-3"
							>
								Privacy Policy
							</Button>
							<Button
								variant="ghost"
								className="text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-sm h-auto py-1 px-3"
							>
								Terms of Service
							</Button>
							<Button
								variant="ghost"
								className="text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-sm h-auto py-1 px-3"
							>
								Cookie Policy
							</Button>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
