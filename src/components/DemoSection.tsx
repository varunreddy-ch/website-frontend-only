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

const DemoSection: React.FC = () => {
	return (
		<section className="py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-500"></div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center mb-24">
					{/* Floating badge */}
					<div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full mb-10 shadow-2xl animate-bounce">
						<Sparkles className="h-6 w-6" />
						<span className="font-bold text-lg">
							🚀 Free Demo Available
						</span>
					</div>

					<h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-10 leading-tight">
						See ResumeVar in{" "}
						<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							Action
						</span>
					</h2>
					<p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
						Book a personalized demo with our experts and discover
						how AI-powered resume creation can transform your career
						prospects in just 30 minutes.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
					{/* Left Side - Enhanced Demo Info */}
					<div className="space-y-12">
						<div className="space-y-10">
							<div className="text-center lg:text-left">
								<h3 className="text-3xl font-bold text-gray-900 mb-6">
									Why Book a Demo?
								</h3>
								<p className="text-base text-gray-600">
									Get a firsthand look at how ResumeVar can
									revolutionize your resume creation process
								</p>
							</div>

							<div className="space-y-8">
								<div className="flex items-start gap-6 group hover:bg-white/60 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
									<div className="bg-blue-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
										<Video className="h-8 w-8 text-blue-600" />
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-4">
											Live Platform Walkthrough
										</h4>
										<p className="text-gray-600 text-base leading-relaxed">
											See ResumeVar in real-time as our
											experts demonstrate every feature
											and capability with real examples.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-6 group hover:bg-white/60 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
									<div className="bg-green-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
										<CheckSquare className="h-8 w-8 text-green-600" />
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-4">
											Real Results & Examples
										</h4>
										<p className="text-gray-600 text-base leading-relaxed">
											View actual resume transformations
											and understand the quality you can
											expect from our AI-powered platform.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-6 group hover:bg-white/60 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
									<div className="bg-purple-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
										<Users className="h-8 w-8 text-purple-600" />
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-4">
											Personalized Q&A Session
										</h4>
										<p className="text-gray-600 text-base leading-relaxed">
											Get answers to your specific
											questions and discuss your unique
											requirements with our expert team.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-6 group hover:bg-white/60 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
									<div className="bg-orange-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
										<Clock className="h-8 w-8 text-orange-600" />
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 mb-4">
											Implementation Guidance
										</h4>
										<p className="text-gray-600 text-base leading-relaxed">
											Learn best practices and get tips
											for maximizing your resume's impact
											in today's competitive job market.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
							<div className="flex items-center gap-4 mb-6">
								<div className="p-3 bg-white/20 rounded-2xl">
									<Star className="h-8 w-8 text-yellow-300" />
								</div>
								<h4 className="text-2xl font-bold">
									What You'll Get
								</h4>
							</div>
							<ul className="space-y-4 text-blue-100">
								<li className="flex items-center gap-4 text-base">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>30-minute personalized session</span>
								</li>
								<li className="flex items-center gap-4 text-base">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>Live platform demonstration</span>
								</li>
								<li className="flex items-center gap-4 text-base">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>Real resume examples</span>
								</li>
								<li className="flex items-center gap-4 text-base">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>Pricing & plan details</span>
								</li>
								<li className="flex items-center gap-4 text-base">
									<CheckSquare className="h-5 w-5 text-green-300 flex-shrink-0" />
									<span>No sales pressure</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Right Side - Enhanced Demo Booking Card */}
					<div className="relative">
						<Card className="shadow-2xl border-0 bg-white transform hover:scale-105 transition-all duration-300 rounded-3xl overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center pb-10">
								<div className="flex justify-center mb-6">
									<div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
										<Calendar className="h-10 w-10 text-white" />
									</div>
								</div>
								<CardTitle className="text-2xl mb-3">
									Book Your Demo
								</CardTitle>
								<CardDescription className="text-green-100 text-base">
									Choose your preferred time slot
								</CardDescription>
							</CardHeader>
							<CardContent className="p-10">
								<div className="space-y-8">
									<div className="text-center">
										<div className="bg-green-100 p-6 rounded-2xl inline-block mb-6">
											<Video className="h-12 w-12 text-green-600" />
										</div>
										<h3 className="text-xl font-bold text-gray-900 mb-4">
											Schedule Your Session
										</h3>
										<p className="text-gray-600 text-base">
											Pick a date and time that works for
											you. We'll confirm within 24 hours.
										</p>
									</div>

									<div className="space-y-5">
										<div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<Clock className="h-7 w-7 text-blue-600" />
											<span className="text-base text-gray-700 font-semibold">
												30-minute sessions
											</span>
										</div>

										<div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<Video className="h-6 w-6 text-green-600" />
											<span className="text-base text-gray-700 font-semibold">
												Zoom, Google Meet, or Teams
											</span>
										</div>

										<div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
											<Users className="h-6 w-6 text-purple-600" />
											<span className="text-base text-gray-700 font-semibold">
												One-on-one with experts
											</span>
										</div>
									</div>
								</div>

								<Link to="/demo">
									<Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
										<Calendar className="h-7 w-7 mr-3" />
										Book Demo Now
										<ArrowRight className="h-7 w-7 ml-3" />
									</Button>
								</Link>

								<div className="text-center">
									<p className="text-sm text-gray-500 mb-3">
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
							</CardContent>
						</Card>

						{/* Enhanced floating elements for visual appeal */}
						<div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
						<div className="absolute -bottom-8 -left-8 w-12 h-12 bg-purple-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
						<div className="absolute top-1/2 -right-16 w-10 h-10 bg-green-400 rounded-full opacity-30 animate-pulse delay-500"></div>
					</div>
				</div>

				{/* Enhanced Features Grid */}
				<div className="mb-24">
					<div className="text-center mb-16">
						<h3 className="text-4xl font-bold text-gray-900 mb-6">
							What Makes Our Demo Special?
						</h3>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
								color: "blue",
							},
							{
								icon: TrendingUp,
								title: "Performance Metrics",
								description:
									"See real data on how our platform improves resume success rates",
								color: "green",
							},
							{
								icon: Shield,
								title: "Security First",
								description:
									"Learn about our enterprise-grade security and privacy measures",
								color: "purple",
							},
							{
								icon: Lightbulb,
								title: "Best Practices",
								description:
									"Get insider tips on resume optimization and ATS compatibility",
								color: "orange",
							},
							{
								icon: UserCheck,
								title: "Expert Support",
								description:
									"Direct access to our team of resume and AI specialists",
								color: "pink",
							},
							{
								icon: Rocket,
								title: "Quick Setup",
								description:
									"See how easy it is to get started in just minutes",
								color: "indigo",
							},
						].map((feature, index) => (
							<Card
								key={index}
								className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden group"
							>
								<CardContent className="p-8 text-center">
									<div
										className={`bg-${feature.color}-100 p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}
									>
										<feature.icon
											className={`h-10 w-10 text-${feature.color}-600`}
										/>
									</div>
									<h4 className="text-xl font-bold text-gray-900 mb-4">
										{feature.title}
									</h4>
									<p className="text-gray-600 leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Enhanced Bottom CTA */}
				<div className="text-center">
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-20 text-white shadow-2xl relative overflow-hidden">
						{/* Background decorative elements */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
						<div className="absolute inset-0 opacity-30 bg-gradient-to-r from-white/10 to-white/20"></div>

						<div className="relative z-10">
							<div className="flex justify-center mb-8">
								<div className="p-6 bg-white/20 rounded-2xl backdrop-blur-sm">
									<Zap className="h-14 w-14 text-white" />
								</div>
							</div>

							<h3 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
								Ready to Transform Your Resume?
							</h3>
							<p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
								Join thousands of professionals who have already
								discovered the power of AI-driven resume
								creation.
							</p>
							<div className="flex flex-col sm:flex-row gap-8 justify-center">
								<Link to="/demo">
									<Button className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-4 rounded-2xl">
										<Play className="h-7 w-7" />
										Book Your Demo
										<ArrowUpRight className="h-6 w-6" />
									</Button>
								</Link>
								<Link to="/signup">
									<Button
										variant="outline"
										className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-4 rounded-2xl"
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
