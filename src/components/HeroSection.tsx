import { FileText, Upload, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
	const navigate = useNavigate();
	return (
		<section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 overflow-hidden pt-16">
			{/* Animated background elements */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl animate-pulse"></div>
				<div className="absolute top-60 right-20 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-bounce"></div>
				<div className="absolute bottom-40 left-1/4 w-16 h-16 bg-cyan-400 rounded-full blur-lg animate-pulse delay-700"></div>
			</div>

			<div className="relative container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center min-h-screen">
				{/* Left Content */}
				<div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
					<h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
						Build Smarter
						<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
							{" "}
							Resumes
						</span>
						<br />
						with AI
					</h1>

					<p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
						Create or upload your resume in seconds using
						intelligent tools.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 mb-12">
						<Button
							size="lg"
							onClick={() => navigate("/signin")}
							className="btn-primary px-8 py-3.5 text-base sm:text-lg rounded-xl hover:shadow-2xl transform hover:scale-[1.02]"
						>
							<FileText className="mr-2 h-5 w-5" />
							Create My Resume
						</Button>

						<Button
							size="lg"
							onClick={() => navigate("/signin")}
							className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-0 hover:from-cyan-500 hover:to-blue-600 px-8 py-3.5 text-base sm:text-lg rounded-xl transform hover:scale-[1.02] shadow-lg"
						>
							<Upload className="mr-2 h-5 w-5" />
							Upload Resume
						</Button>
					</div>

					{/* Animated Metrics */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
						<div className="animate-fade-in">
							<div className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-2">
								50K+
							</div>
							<div className="text-blue-200 text-sm">
								Resumes Created
							</div>
						</div>
						<div className="animate-fade-in delay-200">
							<div className="text-2xl lg:text-3xl font-bold text-green-400 mb-2">
								98%
							</div>
							<div className="text-blue-200 text-sm">
								Success Rate
							</div>
						</div>
						<div className="animate-fade-in delay-400">
							<div className="flex items-center justify-center text-2xl lg:text-3xl font-bold text-yellow-400 mb-2">
								4.9
								<Star className="ml-1 h-5 w-5 fill-current" />
							</div>
							<div className="text-blue-200 text-sm">
								User Rating
							</div>
						</div>
					</div>
				</div>

				{/* Right Content - 3D Resume Illustration */}
				<div className="lg:w-1/2 flex justify-center">
					<div className="relative transform hover:rotate-3 hover:scale-105 transition-all duration-500 ease-out">
						<div className="w-80 h-96 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-6 transform rotate-6 hover:rotate-3 transition-transform duration-500">
							{/* Resume Preview */}
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mr-3"></div>
								<div>
									<div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
									<div className="h-2 bg-gray-200 rounded w-16"></div>
								</div>
							</div>

							<div className="space-y-3">
								<div className="h-2 bg-gray-200 rounded w-full"></div>
								<div className="h-2 bg-gray-200 rounded w-4/5"></div>
								<div className="h-2 bg-gray-200 rounded w-3/4"></div>

								<div className="mt-6">
									<div className="h-3 bg-blue-500 rounded w-1/3 mb-2"></div>
									<div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
									<div className="h-2 bg-gray-200 rounded w-5/6 mb-1"></div>
									<div className="h-2 bg-gray-200 rounded w-4/5"></div>
								</div>

								<div className="mt-6">
									<div className="h-3 bg-indigo-500 rounded w-1/4 mb-2"></div>
									<div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
									<div className="h-2 bg-gray-200 rounded w-3/4"></div>
								</div>
							</div>
						</div>

						{/* Floating Elements */}
						<div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
						<div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
						<div className="absolute top-1/3 -left-6 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
