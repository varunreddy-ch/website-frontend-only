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
		window.open(
			"https://wa.me/919573140921?text=Hi, I would like to upgrade to premium to access Jobs and Profile Analytics features. Please provide me with upgrade options and pricing.",
			"_blank"
		);
	};

	const content = getFeatureContent();
	const IconComponent = content.icon;
	const HeroIcon = content.heroIcon;

	if (showContactPrompt) {
		return (
			<div className="flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
				<Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105">
					<CardContent className="p-8 text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
							<svg
								className="w-10 h-10 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
							</svg>
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

						<div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-6">
							<p className="text-green-800 font-medium text-lg">
								💬 WhatsApp: +91 9573140921
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button
								size="lg"
								onClick={handleContactSupport}
								className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg"
							>
								<svg
									className="w-5 h-5 mr-2"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
								</svg>
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
					<div className="text-center bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
						<div className="flex items-center justify-center gap-2 mb-4">
							<svg
								className="w-6 h-6 text-green-600"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
							</svg>
						</div>
						<p className="text-gray-800 text-lg font-semibold mb-2">
							Ready to Upgrade?
						</p>
						<p className="text-gray-600 mb-3">
							Contact our support team via WhatsApp to learn more about premium
							features and pricing
						</p>
						<a
							href="https://wa.me/919573140921"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 text-sm text-green-700 font-semibold hover:text-green-800"
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
							</svg>
							<span>+91 9573140921</span>
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default PremiumUpgrade;
