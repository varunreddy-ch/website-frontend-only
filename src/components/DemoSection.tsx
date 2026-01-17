import React from "react";
import {
	Calendar,
	Clock,
	Users,
	Video,
	CheckSquare,
	ArrowRight,
	Sparkles,
	Zap,
	Star,
	Target,
	TrendingUp,
	Shield,
	Globe,
	Play,
	ArrowUpRight,
	Lightbulb,
	UserCheck,
	Rocket,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const demoFormUrl = "https://forms.gle/AVA1DtN8ZCwx58Cd8";

const DemoSection: React.FC = () => {
	return (
		<section className="section-shell bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-500"></div>
			</div>

			<div className="section-container relative z-10">
				<div className="section-heading mb-16">
					{/* Floating badge */}
					<div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-8 shadow-xl">
						<Sparkles className="h-5 w-5" />
						<span className="font-semibold text-sm sm:text-base">
							🚀 Free Demo Available
						</span>
					</div>

					<h2 className="section-title mb-4">
						See ResumeVar in{" "}
						<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							Action
						</span>
					</h2>
					<p className="section-subtitle max-w-4xl">
						Book a personalized demo with our experts and discover
						how AI-powered resume creation can transform your career
						prospects in just 30 minutes.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-14">
					{/* Left Side - Enhanced Demo Info */}
					<div className="space-y-10">
						<div className="space-y-8">
							<div className="text-center lg:text-left">
								<h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
									Why Book a Demo?
								</h3>
								<p className="text-sm sm:text-base text-gray-600">
									Get a firsthand look at how ResumeVar can
									revolutionize your resume creation process
								</p>
							</div>

							<div className="space-y-4">
								<div className="flex items-start gap-4 group hover:bg-white/70 p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
									<div className="bg-blue-100 p-3 rounded-2xl group-hover:scale-105 transition-transform duration-300">
										<Video className="h-7 w-7 text-blue-600" />
									</div>
									<div>
										<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
											Live Platform Walkthrough
										</h4>
										<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
											See ResumeVar in real-time as our
											experts demonstrate every feature
											and capability with real examples.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4 group hover:bg-white/70 p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
									<div className="bg-green-100 p-3 rounded-2xl group-hover:scale-105 transition-transform duration-300">
										<CheckSquare className="h-7 w-7 text-green-600" />
									</div>
									<div>
										<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
											Real Results & Examples
										</h4>
										<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
											View actual resume transformations
											and understand the quality you can
											expect from our AI-powered platform.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4 group hover:bg-white/70 p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
									<div className="bg-purple-100 p-3 rounded-2xl group-hover:scale-105 transition-transform duration-300">
										<Users className="h-7 w-7 text-purple-600" />
									</div>
									<div>
										<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
											Personalized Q&A Session
										</h4>
										<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
											Get answers to your specific
											questions and discuss your unique
											requirements with our expert team.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4 group hover:bg-white/70 p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
									<div className="bg-orange-100 p-3 rounded-2xl group-hover:scale-105 transition-transform duration-300">
										<Clock className="h-7 w-7 text-orange-600" />
									</div>
									<div>
										<h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
											Implementation Guidance
										</h4>
										<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
											Learn best practices and get tips
											for maximizing your resume's impact
											in today's competitive job market.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-[1.01] transition-all duration-300">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-3 bg-white/20 rounded-2xl">
									<Star className="h-7 w-7 text-yellow-300" />
								</div>
								<h4 className="text-lg font-semibold">
									What You'll Get
								</h4>
							</div>
							<ul className="space-y-2 text-blue-100">
								<li className="flex items-center gap-3 text-sm">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>30-minute personalized session</span>
								</li>
								<li className="flex items-center gap-3 text-sm">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>Live platform demonstration</span>
								</li>
								<li className="flex items-center gap-3 text-sm">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>Real resume examples</span>
								</li>
								<li className="flex items-center gap-3 text-sm">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>Pricing & plan details</span>
								</li>
								<li className="flex items-center gap-3 text-sm">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>No sales pressure</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Right Side - Enhanced Demo Booking Card */}
					<div className="relative h-full">
						<Card className="shadow-xl border-0 bg-white transform hover:scale-[1.01] transition-all duration-300 rounded-3xl overflow-hidden h-full flex flex-col">
							<CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center pb-7">
								<div className="flex justify-center mb-4">
									<div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
										<Calendar className="h-7 w-7 text-white" />
									</div>
								</div>
								<CardTitle className="text-lg mb-1">
									Book Your Demo
								</CardTitle>
								<CardDescription className="text-green-100 text-sm">
									Choose your preferred time slot
								</CardDescription>
							</CardHeader>
							<CardContent className="p-6 flex-1 flex flex-col">
								<div className="space-y-5 flex-1">
									<div className="text-center">
										<div className="bg-green-100 p-4 rounded-2xl inline-block mb-4">
											<Video className="h-8 w-8 text-green-600" />
										</div>
										<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
											Schedule Your Session
										</h3>
										<p className="text-gray-600 text-sm">
											Pick a date and time that works for
											you. We'll confirm within 24 hours.
										</p>
									</div>

									<div className="space-y-3">
										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<Clock className="h-5 w-5 text-blue-600" />
											<span className="text-sm text-gray-700 font-semibold">
												30-minute sessions
											</span>
										</div>

										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<Video className="h-5 w-5 text-green-600" />
											<span className="text-sm text-gray-700 font-semibold">
												Zoom, Google Meet, or Teams
											</span>
										</div>

										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<Users className="h-5 w-5 text-purple-600" />
											<span className="text-sm text-gray-700 font-semibold">
												One-on-one with experts
											</span>
										</div>
										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<Calendar className="h-5 w-5 text-indigo-600" />
											<span className="text-sm text-gray-700 font-semibold">
												Flexible weekday slots
											</span>
										</div>
										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<CheckSquare className="h-5 w-5 text-emerald-600" />
											<span className="text-sm text-gray-700 font-semibold">
												Customized walkthrough agenda
											</span>
										</div>
									</div>
								</div>

								<div className="mt-5 space-y-3">
									<a
										href={demoFormUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="btn-primary w-full text-sm sm:text-base"
									>
										<FileText className="h-4 w-4" />
										Fill the Demo Registration Form
										<ArrowRight className="h-4 w-4" />
									</a>

									<div className="text-center">
										<p className="text-xs text-gray-500 mb-2">
											Free demo • No commitment required •
											Available worldwide
										</p>
										<div className="flex items-center justify-center gap-2 text-xs text-gray-400">
											<Globe className="h-3 w-3" />
											<span>
												Times shown in your local timezone
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Enhanced floating elements for visual appeal */}
						<div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
						<div className="absolute -bottom-8 -left-8 w-12 h-12 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
						<div className="absolute top-1/2 -right-16 w-10 h-10 bg-green-400 rounded-full opacity-20 animate-pulse delay-500"></div>
					</div>
				</div>

				{/* Enhanced Features Grid */}
				<div className="mb-16">
					<div className="section-heading mb-10">
						<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
							What Makes Our Demo Special?
						</h3>
						<p className="section-subtitle max-w-3xl">
							Experience the difference with our comprehensive
							demo approach
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								icon: Target,
								title: "Personalized Approach",
								description:
									"Every demo is tailored to your specific industry and career goals",
								iconBg: "bg-blue-100",
								iconColor: "text-blue-600",
							},
							{
								icon: TrendingUp,
								title: "Performance Metrics",
								description:
									"See real data on how our platform improves resume success rates",
								iconBg: "bg-green-100",
								iconColor: "text-green-600",
							},
							{
								icon: Shield,
								title: "Security First",
								description:
									"Learn about our enterprise-grade security and privacy measures",
								iconBg: "bg-purple-100",
								iconColor: "text-purple-600",
							},
							{
								icon: Lightbulb,
								title: "Best Practices",
								description:
									"Get insider tips on resume optimization and ATS compatibility",
								iconBg: "bg-orange-100",
								iconColor: "text-orange-600",
							},
							{
								icon: UserCheck,
								title: "Expert Support",
								description:
									"Direct access to our team of resume and AI specialists",
								iconBg: "bg-pink-100",
								iconColor: "text-pink-600",
							},
							{
								icon: Rocket,
								title: "Quick Setup",
								description:
									"See how easy it is to get started in just minutes",
								iconBg: "bg-indigo-100",
								iconColor: "text-indigo-600",
							},
						].map((feature, index) => (
							<Card
								key={index}
								className="card-soft bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden group"
							>
								<CardContent className="p-6 text-center">
									<div
										className={`${feature.iconBg} p-4 rounded-2xl inline-block mb-5 group-hover:scale-105 transition-transform duration-300`}
									>
										<feature.icon
											className={`h-9 w-9 ${feature.iconColor}`}
										/>
									</div>
									<h4 className="text-lg font-semibold text-gray-900 mb-3">
										{feature.title}
									</h4>
									<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Enhanced Bottom CTA */}
				<div className="text-center">
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
						{/* Background decorative elements */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
						<div className="absolute inset-0 opacity-30 bg-gradient-to-r from-white/10 to-white/20"></div>

						<div className="relative z-10">
							<div className="flex justify-center mb-5">
								<div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
									<Zap className="h-9 w-9 text-white" />
								</div>
							</div>

							<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
								Ready to Transform Your Resume?
							</h3>
							<p className="text-sm sm:text-base text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
								Join thousands of professionals who have already
								discovered the power of AI-driven resume
								creation.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
								<a
									href={demoFormUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="btn-secondary bg-white/95 border-white/0 text-blue-700 hover:bg-white min-w-[200px] text-sm sm:text-base"
								>
									<FileText className="h-5 w-5" />
									Register for a Demo
									<ArrowUpRight className="h-4 w-4" />
								</a>
								<Link to="/signup">
									<Button
										variant="outline"
										className="btn-primary bg-purple-600 hover:bg-purple-700 from-purple-600 to-purple-700 min-w-[200px] text-sm sm:text-base"
									>
										Try It Free
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default DemoSection;
