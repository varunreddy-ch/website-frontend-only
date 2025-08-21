import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Star,
	Zap,
	Briefcase,
	BarChart3,
	CheckCircle,
	ArrowRight,
	Sparkles,
	ArrowLeft,
	Mail,
	TrendingUp,
	FileText,
	Calendar,
	Target,
	Users,
	Award,
	Rocket,
	ChartLine,
	Activity,
	TargetIcon,
	Lightbulb,
	Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumUpgradeProps {
	feature: "jobs" | "profile";
}

const PremiumUpgrade = ({ feature }: PremiumUpgradeProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [showContactPrompt, setShowContactPrompt] = useState(false);
	const navigate = useNavigate();

	const getFeatureContent = () => {
		if (feature === "jobs") {
			return {
				title: "🚀 Unlock Premium Job Access",
				subtitle:
					"Get exclusive access to curated job opportunities and advanced job tracking",
				icon: Briefcase,
				heroIcon: Rocket,
				features: [
					{
						title: "Premium Job Listings",
						description:
							"Access to exclusive, high-quality job opportunities",
						icon: Briefcase,
						color: "from-blue-500 to-blue-600",
					},
					{
						title: "Advanced Tracking",
						description:
							"Track your applications with detailed status updates",
						icon: Target,
						color: "from-green-500 to-green-600",
					},
					{
						title: "Market Insights",
						description:
							"Get real-time job market analytics and trends",
						icon: ChartLine,
						color: "from-purple-500 to-purple-600",
					},
					{
						title: "Priority Processing",
						description:
							"Your applications get priority in the system",
						icon: Zap,
						color: "from-orange-500 to-orange-600",
					},
					{
						title: "Smart Alerts",
						description:
							"Custom job notifications based on your preferences",
						icon: Bell,
						color: "from-red-500 to-red-600",
					},
					{
						title: "Career Guidance",
						description:
							"Personalized recommendations for your career path",
						icon: Lightbulb,
						color: "from-yellow-500 to-yellow-600",
					},
				],
			};
		} else {
			return {
				title: "📊 Unlock Premium Analytics",
				subtitle:
					"Get detailed insights into your job application performance and career growth",
				icon: BarChart3,
				heroIcon: Activity,
				features: [
					{
						title: "Advanced Analytics Dashboard",
						description:
							"Comprehensive performance metrics and visualizations",
						icon: BarChart3,
						color: "from-blue-500 to-blue-600",
					},
					{
						title: "Monthly Trends Analysis",
						description:
							"Track your progress over time with detailed charts",
						icon: TrendingUp,
						color: "from-green-500 to-green-600",
					},
					{
						title: "30-Day Activity Tracking",
						description:
							"Monitor your daily application and resume activity",
						icon: Calendar,
						color: "from-purple-500 to-purple-600",
					},
					{
						title: "Resume Performance Metrics",
						description: "See which resumes perform best and why",
						icon: FileText,
						color: "from-orange-500 to-orange-600",
					},
					{
						title: "Career Growth Insights",
						description:
							"Data-driven recommendations for career advancement",
						icon: TargetIcon,
						color: "from-red-500 to-red-600",
					},
					{
						title: "Application Success Analytics",
						description:
							"Track your success rate and optimize your strategy",
						icon: Award,
						color: "from-yellow-500 to-yellow-600",
					},
				],
			};
		}
	};

	const handleUpgradeClick = () => {
		setShowContactPrompt(true);
	};

	const handleContactSupport = () => {
		window.location.href =
			"mailto:support@resumevar.com?subject=Premium Upgrade Request&body=Hi, I would like to upgrade to premium to access Jobs and Profile Analytics features. Please provide me with upgrade options and pricing.";
	};

	const content = getFeatureContent();
	const IconComponent = content.icon;
	const HeroIcon = content.heroIcon;

	if (showContactPrompt) {
		return (
			<div className="flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
				<Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105">
					<CardContent className="p-8 text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
							<Mail className="w-10 h-10 text-white" />
						</div>

						<h2 className="text-3xl font-bold text-gray-800 mb-4">
							Contact Support for Upgrade
						</h2>

						<p className="text-lg text-gray-600 mb-6">
							To upgrade to premium and unlock{" "}
							{feature === "jobs"
								? "job access"
								: "analytics features"}
							, please contact our support team.
						</p>

						<div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
							<p className="text-blue-800 font-medium text-lg">
								📧 support@resumevar.com
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button
								size="lg"
								onClick={handleContactSupport}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg"
							>
								<Mail className="w-5 h-5 mr-2" />
								Contact Support
							</Button>
							<Button
								variant="outline"
								size="lg"
								onClick={() => setShowContactPrompt(false)}
								className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
							>
								<ArrowLeft className="w-5 h-5 mr-2" />
								Go Back
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
			<Card
				className="w-full max-w-6xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Enhanced Header with gradient background */}
				<div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
					<div className="absolute inset-0 bg-black/10"></div>
					<div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>

					{/* Animated background elements */}
					<div className="absolute top-4 left-4 opacity-20 animate-bounce">
						<Sparkles className="w-8 h-8" />
					</div>
					<div className="absolute top-8 right-8 opacity-20 animate-pulse">
						<Star className="w-6 h-6" />
					</div>
					<div
						className="absolute bottom-4 left-8 opacity-20 animate-bounce"
						style={{ animationDelay: "1s" }}
					>
						<Zap className="w-6 h-6" />
					</div>
					<div
						className="absolute top-1/2 right-4 opacity-20 animate-pulse"
						style={{ animationDelay: "2s" }}
					>
						<Star className="w-4 h-4" />
					</div>

					<div className="relative p-12 text-center">
						<div className="flex justify-center mb-6">
							<div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transform transition-all duration-500 hover:scale-110">
								<HeroIcon className="w-12 h-12 text-white" />
							</div>
						</div>
						<h1 className="text-5xl font-bold mb-4 leading-tight">
							{content.title}
						</h1>
						<p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
							{content.subtitle}
						</p>
					</div>
				</div>

				<CardContent className="p-8">
					{/* Enhanced Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
						{content.features.map((feature, index) => (
							<div
								key={index}
								className="group p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
							>
								<div className="flex items-start gap-4">
									<div
										className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
									>
										<feature.icon className="w-6 h-6 text-white" />
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
											{feature.title}
										</h3>
										<p className="text-gray-600 leading-relaxed">
											{feature.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Enhanced Upgrade Section */}
					<div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 rounded-3xl p-8 border border-gray-200 mb-8 relative overflow-hidden">
						{/* Background decoration */}
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 rounded-full blur-2xl"></div>

						<div className="relative text-center mb-8">
							<h3 className="text-3xl font-bold text-gray-800 mb-3">
								🚀 Upgrade to Premium
							</h3>
							<p className="text-gray-600 text-lg max-w-2xl mx-auto">
								Unlock all features and take your career to the
								next level with our comprehensive premium
								package
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								onClick={handleUpgradeClick}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-2xl transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
							>
								<Star className="w-6 h-6 mr-3" />
								Upgrade Now
								<ArrowRight className="w-6 h-6 ml-3" />
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:bg-blue-50 text-lg"
								onClick={() => navigate("/dashboard")}
							>
								<ArrowLeft className="w-6 h-6 mr-3" />
								Back to Dashboard
							</Button>
						</div>
					</div>

					{/* Contact Support Info */}
					<div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Mail className="w-6 h-6 text-blue-600" />
						</div>
						<p className="text-gray-800 text-lg font-semibold mb-2">
							Ready to Upgrade?
						</p>
						<p className="text-gray-600 mb-3">
							Contact our support team to learn more about premium
							features and pricing
						</p>
						<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
							<Mail className="w-4 h-4" />
							<span>support@resumevar.com</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default PremiumUpgrade;
