import React, { useState, useEffect } from "react";
import {
	Calendar,
	Clock,
	Users,
	Monitor,
	CheckCircle,
	AlertCircle,
	Phone,
	Mail,
	Building,
	Sparkles,
	Zap,
	Star,
	ArrowRight,
	ArrowLeft,
	Play,
	Target,
	Shield,
	Video,
	Globe,
	MapPin,
	CheckSquare,
	ArrowUpRight,
	TrendingUp,
	UserCheck,
	Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import API from "../api";
import Navbar from "@/components/Navbar";

interface TimeSlot {
	time: string;
	available: boolean;
}

interface DemoFormData {
	name: string;
	email: string;
	company: string;
	phone: string;
	preferredDate: string;
	preferredTime: string;
	meetingDuration: number;
	notes: string;
	timezone: string;
}

const Demo: React.FC = () => {
	const [formData, setFormData] = useState<DemoFormData>({
		name: "",
		email: "",
		company: "",
		phone: "",
		preferredDate: "",
		preferredTime: "",
		meetingDuration: 30,
		notes: "",
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});

	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	// Get tomorrow's date as minimum date
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const minDate = tomorrow.toISOString().split("T")[0];

	// Get available slots when date changes
	useEffect(() => {
		if (selectedDate) {
			fetchAvailableSlots(selectedDate);
		}
	}, [selectedDate]);

	const fetchAvailableSlots = async (date: string) => {
		try {
			setLoading(true);
			const response = await API.get(
				`/demo/available-slots/${date}?timezone=${encodeURIComponent(
					formData.timezone
				)}`
			);
			setAvailableSlots(response.data.availableSlots);
			setFormData((prev) => ({ ...prev, preferredTime: "" }));
		} catch (error) {
			console.error("Error fetching available slots:", error);
			toast({
				title: "Error",
				description: "Failed to fetch available time slots",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (
		field: keyof DemoFormData,
		value: string | number
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleDateChange = (date: string) => {
		setSelectedDate(date);
		setFormData((prev) => ({
			...prev,
			preferredDate: date,
			preferredTime: "",
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.name ||
			!formData.email ||
			!formData.preferredDate ||
			!formData.preferredTime
		) {
			toast({
				title: "Validation Error",
				description: "Please fill in all required fields",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await API.post("/demo/book", formData);

			toast({
				title: "Success!",
				description:
					"Your demo has been booked successfully. Check your email for confirmation.",
			});

			// Reset form
			setFormData({
				name: "",
				email: "",
				company: "",
				phone: "",
				preferredDate: "",
				preferredTime: "",
				meetingDuration: 30,
				notes: "",
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			});
			setSelectedDate("");
			setAvailableSlots([]);
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error || "Failed to book demo";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const timeSlots = [
		{ time: "09:00", label: "9:00 AM" },
		{ time: "10:00", label: "10:00 AM" },
		{ time: "11:00", label: "11:00 AM" },
		{ time: "12:00", label: "12:00 PM" },
		{ time: "14:00", label: "2:00 PM" },
		{ time: "15:00", label: "3:00 PM" },
		{ time: "16:00", label: "4:00 PM" },
		{ time: "17:00", label: "5:00 PM" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-500"></div>
			</div>

			<Navbar />

			{/* Hero Section */}
			<div className="relative pt-20 pb-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					{/* Floating Badge */}
					<div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-8 shadow-2xl animate-bounce">
						<Sparkles className="h-5 w-5" />
						<span className="font-bold text-base">
							✨ Limited Time Demo Slots Available
						</span>
					</div>

					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
						Experience the{" "}
						<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							Future
						</span>
						<br />
						<span className="text-gray-900">
							of Resume Creation
						</span>
					</h1>

					<p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
						Join us for an exclusive personalized demo and discover
						how AI can transform your resume from ordinary to
						extraordinary in just 30 minutes.
					</p>

					{/* Enhanced Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
						<div className="text-center group">
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
								<div className="text-3xl font-bold text-blue-600 mb-2">
									500+
								</div>
								<div className="text-gray-700 font-medium text-sm">
									Happy Users
								</div>
							</div>
						</div>
						<div className="text-center group">
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
								<div className="text-3xl font-bold text-purple-600 mb-2">
									98%
								</div>
								<div className="text-gray-700 font-medium text-sm">
									Success Rate
								</div>
							</div>
						</div>
						<div className="text-center group">
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
								<div className="text-3xl font-bold text-pink-600 mb-2">
									24h
								</div>
								<div className="text-gray-700 font-medium text-sm">
									Response Time
								</div>
							</div>
						</div>
						<div className="text-center group">
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
								<div className="text-3xl font-bold text-green-600 mb-2">
									30min
								</div>
								<div className="text-gray-700 font-medium text-sm">
									Demo Duration
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
					{/* Main Form */}
					<div className="lg:col-span-2">
						<Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl overflow-hidden rounded-3xl">
							<CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white pb-8 relative overflow-hidden">
								{/* Animated Background */}
								<div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
								<div className="absolute inset-0 opacity-30 bg-gradient-to-r from-white/10 to-white/20"></div>

								<div className="relative z-10">
									<div className="flex items-center gap-4 mb-6">
										<div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
											<Calendar className="h-10 w-10 text-white" />
										</div>
										<div>
											<CardTitle className="text-4xl font-bold mb-2">
												Book Your Demo
											</CardTitle>
											<CardDescription className="text-blue-100 text-lg">
												Choose your preferred date and
												time. We'll confirm within 24
												hours.
											</CardDescription>
										</div>
									</div>
								</div>
							</CardHeader>

							<CardContent className="p-8 bg-white">
								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									{/* Personal Information */}
									<div className="space-y-6">
										<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
											<Users className="h-5 w-5 text-blue-600" />
											Personal Information
										</h3>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-3">
												<Label
													htmlFor="name"
													className="text-sm font-semibold text-gray-700 flex items-center gap-2"
												>
													<Star className="h-4 w-4 text-yellow-500" />
													Full Name *
												</Label>
												<Input
													id="name"
													value={formData.name}
													onChange={(e) =>
														handleInputChange(
															"name",
															e.target.value
														)
													}
													placeholder="Enter your full name"
													required
													className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white rounded-xl px-4"
												/>
											</div>

											<div className="space-y-3">
												<Label
													htmlFor="email"
													className="text-sm font-semibold text-gray-700 flex items-center gap-2"
												>
													<Mail className="h-4 w-4 text-blue-500" />
													Email Address *
												</Label>
												<Input
													id="email"
													type="email"
													value={formData.email}
													onChange={(e) =>
														handleInputChange(
															"email",
															e.target.value
														)
													}
													placeholder="your.email@company.com"
													required
													className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white rounded-xl px-4"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-3">
												<Label
													htmlFor="company"
													className="text-sm font-semibold text-gray-700 flex items-center gap-2"
												>
													<Building className="h-4 w-4 text-purple-500" />
													Company
												</Label>
												<Input
													id="company"
													value={formData.company}
													onChange={(e) =>
														handleInputChange(
															"company",
															e.target.value
														)
													}
													placeholder="Your company name"
													className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white rounded-xl px-4"
												/>
											</div>

											<div className="space-y-3">
												<Label
													htmlFor="phone"
													className="text-sm font-semibold text-gray-700 flex items-center gap-2"
												>
													<Phone className="h-4 w-4 text-green-500" />
													Phone Number
												</Label>
												<Input
													id="phone"
													value={formData.phone}
													onChange={(e) =>
														handleInputChange(
															"phone",
															e.target.value
														)
													}
													placeholder="+1 (555) 123-4567"
													className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white rounded-xl px-4"
												/>
											</div>
										</div>
									</div>

									{/* Schedule Section */}
									<div className="space-y-6">
										<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
											<Calendar className="h-5 w-5 text-green-600" />
											Schedule
										</h3>

										<div className="space-y-6">
											<div className="space-y-3">
												<Label className="text-base font-semibold text-gray-700">
													Your Timezone
												</Label>
												<div className="h-12 flex items-center px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700">
													<Clock className="h-5 w-5 text-gray-500 mr-2" />
													{formData.timezone}
												</div>
												<p className="text-xs text-gray-500">
													All times will be displayed
													in your local timezone
												</p>
											</div>

											<div className="space-y-3">
												<Label
													htmlFor="date"
													className="text-base font-semibold text-gray-700 flex items-center gap-3"
												>
													<Calendar className="h-4 w-4 text-blue-500" />
													Preferred Date *
												</Label>
												<Input
													id="date"
													type="date"
													value={selectedDate}
													onChange={(e) =>
														handleDateChange(
															e.target.value
														)
													}
													min={minDate}
													required
													className="w-full h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white rounded-xl px-4"
												/>
												<div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 p-2 rounded-lg">
													<AlertCircle className="h-3 w-3 text-blue-500" />
													<span>
														Minimum 1 day in advance
													</span>
												</div>
											</div>

											{selectedDate && (
												<div className="space-y-4">
													<Label className="text-base font-semibold text-gray-700">
														Available Time Slots *
													</Label>
													{loading ? (
														<div className="flex items-center justify-center py-12">
															<div className="relative">
																<div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
																<div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
															</div>
														</div>
													) : (
														<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
															{timeSlots.map(
																(slot) => {
																	const isAvailable =
																		availableSlots.includes(
																			slot.time
																		);
																	const isSelected =
																		formData.preferredTime ===
																		slot.time;

																	return (
																		<Button
																			key={
																				slot.time
																			}
																			type="button"
																			variant={
																				isSelected
																					? "default"
																					: "outline"
																			}
																			disabled={
																				!isAvailable
																			}
																			onClick={() =>
																				handleInputChange(
																					"preferredTime",
																					slot.time
																				)
																			}
																			className={`h-16 text-sm font-medium transition-all duration-300 rounded-xl ${
																				isAvailable
																					? isSelected
																						? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl scale-105 border-0"
																						: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:scale-105 border-2"
																					: "opacity-50 cursor-not-allowed bg-gray-100"
																			}`}
																		>
																			{
																				slot.label
																			}
																		</Button>
																	);
																}
															)}
														</div>
													)}
													{availableSlots.length ===
														0 &&
														!loading && (
															<div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
																<div className="flex items-center gap-3 text-center">
																	<AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
																	<div>
																		<p className="text-amber-700 font-semibold text-base mb-1">
																			No
																			available
																			slots
																			for
																			this
																			date
																		</p>
																		<p className="text-amber-600 text-sm">
																			Please
																			select
																			another
																			date
																			to
																			see
																			available
																			times
																		</p>
																	</div>
																</div>
															</div>
														)}
												</div>
											)}
										</div>
									</div>

									{/* Preferences Section */}
									<div className="space-y-6">
										<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
											<Target className="h-5 w-5 text-orange-600" />
											Preferences
										</h3>

										<div className="space-y-6">
											<div className="space-y-3">
												<Label
													htmlFor="duration"
													className="text-base font-semibold text-gray-700"
												>
													Meeting Duration
												</Label>
												<Select
													value={formData.meetingDuration.toString()}
													onValueChange={(value) =>
														handleInputChange(
															"meetingDuration",
															parseInt(value)
														)
													}
												>
													<SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white rounded-xl px-4">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="30">
															30 minutes
														</SelectItem>
														<SelectItem value="45">
															45 minutes
														</SelectItem>
														<SelectItem value="60">
															60 minutes
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-3">
												<Label
													htmlFor="notes"
													className="text-base font-semibold text-gray-700"
												>
													Additional Notes
												</Label>
												<Textarea
													id="notes"
													value={formData.notes}
													onChange={(e) =>
														handleInputChange(
															"notes",
															e.target.value
														)
													}
													placeholder="Any specific topics you'd like us to cover, questions you have, or areas you'd like to focus on during the demo..."
													rows={4}
													className="text-base resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white rounded-xl px-4 py-3"
												/>
												<p className="text-xs text-gray-500">
													This helps us prepare a more
													personalized demo for you
												</p>
											</div>
										</div>
									</div>

									{/* Submit Button */}
									<div className="pt-6 border-t-2 border-gray-100">
										<Button
											type="submit"
											disabled={
												isSubmitting ||
												!formData.name ||
												!formData.email ||
												!formData.preferredDate ||
												!formData.preferredTime
											}
											className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
										>
											{isSubmitting ? (
												<>
													<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
													Booking Your Demo...
												</>
											) : (
												<>
													<CheckSquare className="h-5 w-5" />
													Book Demo Now
												</>
											)}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>

					{/* Enhanced Sidebar */}
					<div className="space-y-6">
						{/* What to Expect */}
						<Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-300 h-fit">
							<CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white pb-4 relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-90"></div>
								<CardTitle className="text-xl flex items-center gap-3 relative z-10">
									<CheckSquare className="h-6 w-6" />
									What to Expect
								</CardTitle>
							</CardHeader>
							<CardContent className="p-5 bg-white">
								<div className="space-y-4">
									{[
										{
											icon: Users,
											title: "Personalized Walkthrough",
											description:
												"One-on-one session with our expert team member",
											color: "emerald",
										},
										{
											icon: Monitor,
											title: "Live Platform Demo",
											description:
												"See ResumeVar in action with real examples",
											color: "blue",
										},
										{
											icon: CheckSquare,
											title: "Real Results",
											description:
												"View actual resume transformations and improvements",
											color: "purple",
										},
										{
											icon: Clock,
											title: "Q&A Session",
											description:
												"Get all your questions answered by our experts",
											color: "orange",
										},
									].map((item, index) => (
										<div
											key={index}
											className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-xl transition-all duration-200"
										>
											<div
												className={`bg-${item.color}-100 p-2 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
											>
												<item.icon
													className={`h-5 w-5 text-${item.color}-600`}
												/>
											</div>
											<div>
												<h4 className="font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors text-sm">
													{item.title}
												</h4>
												<p className="text-xs text-gray-600 leading-relaxed">
													{item.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Demo Benefits */}
						<Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-300 h-fit">
							<CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white pb-4 relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90"></div>
								<CardTitle className="text-xl relative z-10">
									Why Book a Demo?
								</CardTitle>
							</CardHeader>
							<CardContent className="p-5 bg-white">
								<div className="space-y-3">
									{[
										"See real-time results and transformations",
										"Understand pricing plans and features",
										"Get implementation tips and best practices",
										"Discuss custom requirements and solutions",
										"No sales pressure - just valuable insights",
									].map((benefit, index) => (
										<div
											key={index}
											className="flex items-center gap-3 text-xs group hover:bg-gray-50 p-2 rounded-xl transition-all duration-200"
										>
											<CheckSquare className="h-3 w-3 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
											<span className="group-hover:text-gray-800 transition-colors">
												{benefit}
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Trust Indicators */}
						<Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl overflow-hidden rounded-2xl h-fit">
							<CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4 relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
								<CardTitle className="text-xl flex items-center gap-3 relative z-10">
									<Shield className="h-6 w-6" />
									Trust & Security
								</CardTitle>
							</CardHeader>
							<CardContent className="p-5 bg-white">
								<div className="space-y-3">
									<div className="flex items-center gap-3 text-xs">
										<CheckSquare className="h-3 w-3 text-green-500 flex-shrink-0" />
										<span>GDPR Compliant</span>
									</div>
									<div className="flex items-center gap-3 text-xs">
										<CheckSquare className="h-3 w-3 text-green-500 flex-shrink-0" />
										<span>256-bit SSL Encryption</span>
									</div>
									<div className="flex items-center gap-3 text-xs">
										<CheckSquare className="h-3 w-3 text-green-500 flex-shrink-0" />
										<span>No Spam Policy</span>
									</div>
									<div className="flex items-center gap-3 text-xs">
										<CheckSquare className="h-3 w-3 text-green-500 flex-shrink-0" />
										<span>24/7 Support</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Enhanced Bottom CTA */}
				<div className="mt-20 text-center relative">
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 text-white shadow-2xl relative overflow-hidden">
						{/* Background decorative elements */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
						<div className="absolute inset-0 opacity-30 bg-gradient-to-r from-white/10 to-white/20"></div>

						<div className="relative z-10">
							<div className="flex justify-center mb-6">
								<div className="p-5 bg-white/20 rounded-2xl backdrop-blur-sm">
									<Zap className="h-12 w-12 text-white" />
								</div>
							</div>

							<h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
								Ready to Transform Your Resume?
							</h2>

							<p className="text-lg text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed">
								Join thousands of professionals who have already
								discovered the power of AI-driven resume
								creation. Book your demo today and see the
								difference ResumeVar can make in your career.
							</p>

							<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
								<Button
									onClick={() => {
										document
											.getElementById("name")
											?.focus();
									}}
									className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 rounded-2xl"
								>
									<Play className="h-6 w-6" />
									Book Your Demo Now
									<ArrowUpRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>

								<Button
									variant="outline"
									className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 rounded-2xl"
								>
									Learn More
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Custom CSS for animations */}
			<style>{`
				@keyframes blob {
					0% { transform: translate(0px, 0px) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
					100% { transform: translate(0px, 0px) scale(1); }
				}
				.animate-blob { animation: blob 7s infinite; }
				.animation-delay-2000 { animation-delay: 2s; }
				.animation-delay-4000 { animation-delay: 4s; }
				.animation-delay-150 { animation-delay: 150ms; }
			`}</style>
		</div>
	);
};

export default Demo;
