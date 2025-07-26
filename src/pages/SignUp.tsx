import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import API from "../api";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

// Inside your component:
const recaptchaRef = useRef<ReCAPTCHA>(null);

export default function SignUp() {
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);

	const initialResume = {
		full_name: "",
		job_title: "",
		contact: { phone: "", email: "" },
		professional_summary: "",
		technical_skills: "",
		education: { degree: "", university: "", gpa: "" },
		experience: [
			{
				company: "",
				location: "",
				start_date: "",
				end_date: "",
				job_title: "",
				environment: "",
				responsibilities: "",
			},
		],
	};

	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		username: "",
		password: "",
		email: "",
		job_role: "default",
		role: "user",
		template: "default",
		resume: initialResume,
	});

	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/dashboard");
		}
	}, [navigate]);

	// Validation logic
	const validateField = (key: string, value: string): string => {
		if (key === "username") {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) return "Enter a valid email address.";
		} else if (key === "password") {
			if (!value || value.length < 8)
				return "Password must be at least 8 characters.";
		} else {
			if (!value || !value.trim()) return "This field is required.";
		}
		return "";
	};

	const handleInputChange = (key: string, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		const errorMsg = validateField(key, value);
		setFormErrors((prev) => ({ ...prev, [key]: errorMsg }));
	};

	const handleResumeChange = (
		section: string | null,
		key: string,
		value: string
	) => {
		const errorKey = section ? `${section}.${key}` : key;
		const errorMsg = validateField(key, value);
		setFormErrors((prev) => ({ ...prev, [errorKey]: errorMsg }));

		if (section === "contact" || section === "education") {
			setForm((prev) => ({
				...prev,
				resume: {
					...prev.resume,
					[section]: {
						...prev.resume[section],
						[key]: value,
					},
				},
			}));
		} else {
			setForm((prev) => ({
				...prev,
				resume: {
					...prev.resume,
					[key]: value,
				},
			}));
		}
	};

	const handleExperienceChange = (i: number, key: string, value: string) => {
		const updated = [...form.resume.experience];
		updated[i][key] = value;
		const errorKey = `experience.${i}.${key}`;
		const errorMsg = validateField(key, value);
		setFormErrors((prev) => ({ ...prev, [errorKey]: errorMsg }));

		setForm((prev) => ({
			...prev,
			resume: {
				...prev.resume,
				experience: updated,
			},
		}));
	};

	const addExperience = () => {
		setForm((prev) => ({
			...prev,
			resume: {
				...prev.resume,
				experience: [
					...prev.resume.experience,
					{
						company: "",
						location: "",
						start_date: "",
						end_date: "",
						job_title: "",
						environment: "",
						responsibilities: "",
					},
				],
			},
		}));
	};

	const removeExperience = (i: number) => {
		const updated = [...form.resume.experience];
		updated.splice(i, 1);
		setForm((prev) => ({
			...prev,
			resume: {
				...prev.resume,
				experience: updated,
			},
		}));
		// Remove errors for removed experience
		const updatedErrors = { ...formErrors };
		Object.keys(formErrors).forEach((k) => {
			if (k.startsWith(`experience.${i}.`)) delete updatedErrors[k];
		});
		setFormErrors(updatedErrors);
	};

	const validateAllFields = (): boolean => {
		let valid = true;
		const newErrors: Record<string, string> = {};

		// Top-level
		["firstname", "lastname", "username", "password", "job_role"].forEach(
			(key) => {
				const err = validateField(key, (form as any)[key]);
				if (err) valid = false;
				newErrors[key] = err;
			}
		);

		// Resume flat
		[
			"full_name",
			"job_title",
			"professional_summary",
			"technical_skills",
		].forEach((key) => {
			const err = validateField(key, (form.resume as any)[key]);
			if (err) valid = false;
			newErrors[key] = err;
		});

		// Resume contact
		["phone", "email"].forEach((key) => {
			const err = validateField(key, (form.resume.contact as any)[key]);
			if (err) valid = false;
			newErrors[`contact.${key}`] = err;
		});

		// Resume education
		["degree", "university", "gpa"].forEach((key) => {
			const err = validateField(key, (form.resume.education as any)[key]);
			if (err) valid = false;
			newErrors[`education.${key}`] = err;
		});

		// Experience
		form.resume.experience.forEach((exp, i) => {
			[
				"company",
				"location",
				"job_title",
				"environment",
				"start_date",
				"end_date",
				"responsibilities",
			].forEach((key) => {
				const err = validateField(key, (exp as any)[key]);
				if (err) valid = false;
				newErrors[`experience.${i}.${key}`] = err;
			});
		});

		setFormErrors(newErrors);
		return valid;
	};

	const isFormValid = (): boolean => {
		const hasErrors = Object.values(formErrors).some((msg) => msg);
		if (hasErrors) return false;

		const required = [
			form.firstname,
			form.lastname,
			form.username,
			form.password,
			form.job_role,
			form.resume.full_name,
			form.resume.job_title,
			form.resume.professional_summary,
			form.resume.technical_skills,
			form.resume.contact.phone,
			form.resume.contact.email,
			form.resume.education.degree,
			form.resume.education.university,
			form.resume.education.gpa,
		];
		if (required.some((v) => !v || !v.trim())) return false;
		if (
			form.resume.experience.some((exp) =>
				[
					exp.company,
					exp.location,
					exp.job_title,
					exp.environment,
					exp.start_date,
					exp.end_date,
					exp.responsibilities,
				].some((v) => !v || !v.trim())
			)
		)
			return false;

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const valid = validateAllFields();
		if (!valid) return;

		// if (!captchaToken) {
		// 	setError("Please complete the CAPTCHA.");
		// 	setLoading(false);
		// 	return;
		// }

		setLoading(true);

		try {
			await API.post("/signup", {
				...form,
				recaptcha: captchaToken,
			});
			setError(""); // Clear any previous error
			setSuccess("Account created successfully. Please sign in.");
		} catch (err) {
			setError(err.response.data);
			// Reset the reCAPTCHA so user can try again
			if (recaptchaRef.current) {
				recaptchaRef.current.reset();
			}
			setCaptchaToken(null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<Navbar />
			<div className="flex items-center justify-center min-h-screen px-4 py-8 pt-24">
				<Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
					<CardHeader className="text-center">
						<div className="flex items-center gap-2 mb-4">
							<Link
								to="/"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								<ArrowLeft className="h-4 w-4" />
								<span className="text-sm">Back to Home</span>
							</Link>
						</div>
						<CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Create Your Resume
						</CardTitle>
						<CardDescription className="text-muted-foreground">
							Create your account and build your resume
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Account Information Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-blue-600 border-b border-border pb-2">
									Account Information
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstname">
											First Name
										</Label>
										<Input
											id="firstname"
											placeholder="Enter your first name"
											value={form.firstname}
											onChange={(e) =>
												handleInputChange(
													"firstname",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleInputChange(
													"firstname",
													e.target.value
												)
											}
											required
										/>
										{formErrors.firstname && (
											<p className="text-sm text-red-600">
												{formErrors.firstname}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="lastname">
											Last Name
										</Label>
										<Input
											id="lastname"
											placeholder="Enter your last name"
											value={form.lastname}
											onChange={(e) =>
												handleInputChange(
													"lastname",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleInputChange(
													"lastname",
													e.target.value
												)
											}
											required
										/>
										{formErrors.lastname && (
											<p className="text-sm text-red-600">
												{formErrors.lastname}
											</p>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="username">
											Username (Email)
										</Label>
										<Input
											id="username"
											placeholder="Enter your email address"
											value={form.username}
											onChange={(e) =>
												handleInputChange(
													"username",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleInputChange(
													"username",
													e.target.value
												)
											}
											required
										/>
										{formErrors.username && (
											<p className="text-sm text-red-600">
												{formErrors.username}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="password">
											Password
										</Label>
										<Input
											id="password"
											type="password"
											placeholder="Create a password"
											value={form.password}
											onChange={(e) =>
												handleInputChange(
													"password",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleInputChange(
													"password",
													e.target.value
												)
											}
											required
										/>
										{formErrors.password && (
											<p className="text-sm text-red-600">
												{formErrors.password}
											</p>
										)}
									</div>
								</div>

								{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="job_role">
											Job Role
										</Label>
										<Select
											value={form.job_role}
											onValueChange={(value) =>
												handleInputChange(
													"job_role",
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select your job role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="SDE">
													Software Developer
												</SelectItem>
												<SelectItem value="DATA ENGINEER">
													Data Engineer
												</SelectItem>
												<SelectItem value=".NET">
													.NET Developer
												</SelectItem>
											</SelectContent>
										</Select>
										{formErrors.job_role && (
											<p className="text-sm text-red-600">
												{formErrors.job_role}
											</p>
										)}
									</div>
								</div> */}
							</div>

							{/* Resume Information Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-blue-600 border-b border-border pb-2">
									Resume Information
								</h3>

								{/* Personal Details */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="full_name">
											Full Name
										</Label>
										<Input
											id="full_name"
											placeholder="Enter full name"
											value={form.resume.full_name}
											onChange={(e) =>
												handleResumeChange(
													null,
													"full_name",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleResumeChange(
													null,
													"full_name",
													e.target.value
												)
											}
											required
										/>
										{formErrors.full_name && (
											<p className="text-sm text-red-600">
												{formErrors.full_name}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="job_title">
											Job Title
										</Label>
										<Input
											id="job_title"
											placeholder="Enter job title"
											value={form.resume.job_title}
											onChange={(e) =>
												handleResumeChange(
													null,
													"job_title",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleResumeChange(
													null,
													"job_title",
													e.target.value
												)
											}
											required
										/>
										{formErrors.job_title && (
											<p className="text-sm text-red-600">
												{formErrors.job_title}
											</p>
										)}
									</div>
								</div>

								{/* Contact Information */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											placeholder="Enter phone number"
											value={form.resume.contact.phone}
											onChange={(e) =>
												handleResumeChange(
													"contact",
													"phone",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleResumeChange(
													"contact",
													"phone",
													e.target.value
												)
											}
											required
										/>
										{formErrors["contact.phone"] && (
											<p className="text-sm text-red-600">
												{formErrors["contact.phone"]}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="contact_email">
											Email
										</Label>
										<Input
											id="contact_email"
											type="email"
											placeholder="Enter email"
											value={form.resume.contact.email}
											onChange={(e) =>
												handleResumeChange(
													"contact",
													"email",
													e.target.value
												)
											}
											onBlur={(e) =>
												handleResumeChange(
													"contact",
													"email",
													e.target.value
												)
											}
											required
										/>
										{formErrors["contact.email"] && (
											<p className="text-sm text-red-600">
												{formErrors["contact.email"]}
											</p>
										)}
									</div>
								</div>

								{/* Professional Summary */}
								<div className="space-y-2">
									<Label htmlFor="professional_summary">
										Professional Summary
									</Label>
									<Textarea
										id="professional_summary"
										placeholder="Enter your professional summary"
										rows={3}
										value={form.resume.professional_summary}
										onChange={(e) =>
											handleResumeChange(
												null,
												"professional_summary",
												e.target.value
											)
										}
										onBlur={(e) =>
											handleResumeChange(
												null,
												"professional_summary",
												e.target.value
											)
										}
										required
									/>
									{formErrors.professional_summary && (
										<p className="text-sm text-red-600">
											{formErrors.professional_summary}
										</p>
									)}
								</div>

								{/* Technical Skills */}
								<div className="space-y-2">
									<Label htmlFor="technical_skills">
										Technical Skills
									</Label>
									<Textarea
										id="technical_skills"
										placeholder="Enter your technical skills"
										rows={3}
										value={form.resume.technical_skills}
										onChange={(e) =>
											handleResumeChange(
												null,
												"technical_skills",
												e.target.value
											)
										}
										onBlur={(e) =>
											handleResumeChange(
												null,
												"technical_skills",
												e.target.value
											)
										}
										required
									/>
									{formErrors.technical_skills && (
										<p className="text-sm text-red-600">
											{formErrors.technical_skills}
										</p>
									)}
								</div>

								{/* Education */}
								<div className="space-y-2">
									<h4 className="font-medium">Education</h4>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="degree">
												Degree
											</Label>
											<Input
												id="degree"
												placeholder="Enter degree"
												value={
													form.resume.education.degree
												}
												onChange={(e) =>
													handleResumeChange(
														"education",
														"degree",
														e.target.value
													)
												}
												onBlur={(e) =>
													handleResumeChange(
														"education",
														"degree",
														e.target.value
													)
												}
												required
											/>
											{formErrors["education.degree"] && (
												<p className="text-sm text-red-600">
													{
														formErrors[
															"education.degree"
														]
													}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="university">
												University
											</Label>
											<Input
												id="university"
												placeholder="Enter university"
												value={
													form.resume.education
														.university
												}
												onChange={(e) =>
													handleResumeChange(
														"education",
														"university",
														e.target.value
													)
												}
												onBlur={(e) =>
													handleResumeChange(
														"education",
														"university",
														e.target.value
													)
												}
												required
											/>
											{formErrors[
												"education.university"
											] && (
												<p className="text-sm text-red-600">
													{
														formErrors[
															"education.university"
														]
													}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="gpa">
												GPA (use "-" if not applicable)
											</Label>
											<Input
												id="gpa"
												placeholder="Enter GPA or -"
												value={
													form.resume.education.gpa
												}
												onChange={(e) =>
													handleResumeChange(
														"education",
														"gpa",
														e.target.value
													)
												}
												onBlur={(e) =>
													handleResumeChange(
														"education",
														"gpa",
														e.target.value
													)
												}
												required
											/>
											{formErrors["education.gpa"] && (
												<p className="text-sm text-red-600">
													{
														formErrors[
															"education.gpa"
														]
													}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Experience */}
								<div className="space-y-4">
									<h4 className="font-medium">Experience</h4>
									{form.resume.experience.map((exp, i) => (
										<Card key={i} className="bg-muted/50">
											<CardContent className="p-4 space-y-4">
												<div className="flex justify-between items-center">
													<h5 className="font-medium text-blue-600">
														Experience #{i + 1}
													</h5>
													{form.resume.experience
														.length > 1 && (
														<Button
															type="button"
															variant="destructive"
															size="sm"
															onClick={() =>
																removeExperience(
																	i
																)
															}
														>
															Remove
														</Button>
													)}
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label>Company</Label>
														<Input
															placeholder="Enter company name"
															value={exp.company}
															onChange={(e) =>
																handleExperienceChange(
																	i,
																	"company",
																	e.target
																		.value
																)
															}
															onBlur={(e) =>
																handleExperienceChange(
																	i,
																	"company",
																	e.target
																		.value
																)
															}
															required
														/>
														{formErrors[
															`experience.${i}.company`
														] && (
															<p className="text-sm text-red-600">
																{
																	formErrors[
																		`experience.${i}.company`
																	]
																}
															</p>
														)}
													</div>

													<div className="space-y-2">
														<Label>Location</Label>
														<Input
															placeholder="Enter location"
															value={exp.location}
															onChange={(e) =>
																handleExperienceChange(
																	i,
																	"location",
																	e.target
																		.value
																)
															}
															onBlur={(e) =>
																handleExperienceChange(
																	i,
																	"location",
																	e.target
																		.value
																)
															}
															required
														/>
														{formErrors[
															`experience.${i}.location`
														] && (
															<p className="text-sm text-red-600">
																{
																	formErrors[
																		`experience.${i}.location`
																	]
																}
															</p>
														)}
													</div>

													<div className="space-y-2">
														<Label>Job Title</Label>
														<Input
															placeholder="Enter job title"
															value={
																exp.job_title
															}
															onChange={(e) =>
																handleExperienceChange(
																	i,
																	"job_title",
																	e.target
																		.value
																)
															}
															onBlur={(e) =>
																handleExperienceChange(
																	i,
																	"job_title",
																	e.target
																		.value
																)
															}
															required
														/>
														{formErrors[
															`experience.${i}.job_title`
														] && (
															<p className="text-sm text-red-600">
																{
																	formErrors[
																		`experience.${i}.job_title`
																	]
																}
															</p>
														)}
													</div>

													<div className="space-y-2">
														<Label>
															Environment (use "-"
															if you dont want
															Tools used section)
														</Label>
														<Input
															placeholder="Enter work environment"
															value={
																exp.environment
															}
															onChange={(e) =>
																handleExperienceChange(
																	i,
																	"environment",
																	e.target
																		.value
																)
															}
															onBlur={(e) =>
																handleExperienceChange(
																	i,
																	"environment",
																	e.target
																		.value
																)
															}
															required
														/>
														{formErrors[
															`experience.${i}.environment`
														] && (
															<p className="text-sm text-red-600">
																{
																	formErrors[
																		`experience.${i}.environment`
																	]
																}
															</p>
														)}
													</div>

													<div className="space-y-2">
														<Label>
															Start Date
														</Label>
														<Input
															placeholder="Jan 2021"
															value={
																exp.start_date
															}
															onChange={(e) =>
																handleExperienceChange(
																	i,
																	"start_date",
																	e.target
																		.value
																)
															}
															onBlur={(e) =>
																handleExperienceChange(
																	i,
																	"start_date",
																	e.target
																		.value
																)
															}
															required
														/>
														{formErrors[
															`experience.${i}.start_date`
														] && (
															<p className="text-sm text-red-600">
																{
																	formErrors[
																		`experience.${i}.start_date`
																	]
																}
															</p>
														)}
													</div>

													<div className="space-y-2">
														<Label>End Date</Label>
														<Input
															placeholder="Mar 2022"
															value={exp.end_date}
															onChange={(e) =>
																handleExperienceChange(
																	i,
																	"end_date",
																	e.target
																		.value
																)
															}
															onBlur={(e) =>
																handleExperienceChange(
																	i,
																	"end_date",
																	e.target
																		.value
																)
															}
															required
														/>
														{formErrors[
															`experience.${i}.end_date`
														] && (
															<p className="text-sm text-red-600">
																{
																	formErrors[
																		`experience.${i}.end_date`
																	]
																}
															</p>
														)}
													</div>
												</div>

												<div className="space-y-2">
													<Label>
														Responsibilities
													</Label>
													<Textarea
														placeholder="Enter responsibilities"
														rows={3}
														value={
															exp.responsibilities
														}
														onChange={(e) =>
															handleExperienceChange(
																i,
																"responsibilities",
																e.target.value
															)
														}
														onBlur={(e) =>
															handleExperienceChange(
																i,
																"responsibilities",
																e.target.value
															)
														}
														required
													/>
													{formErrors[
														`experience.${i}.responsibilities`
													] && (
														<p className="text-sm text-red-600">
															{
																formErrors[
																	`experience.${i}.responsibilities`
																]
															}
														</p>
													)}
												</div>
											</CardContent>
										</Card>
									))}

									<div className="flex justify-center">
										<Button
											type="button"
											variant="outline"
											onClick={addExperience}
										>
											+ Add Experience
										</Button>
									</div>
								</div>
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							{success && (
								<Alert variant="default">
									<AlertDescription>
										{success}
									</AlertDescription>
								</Alert>
							)}

							<div className="flex justify-center">
								<div className="flex justify-center"></div>
								<ReCAPTCHA
									ref={recaptchaRef}
									sitekey="6LeC3I8rAAAAADRVKawA3XVf4z3ijJge7ERVCk5K"
									onChange={(token) => setCaptchaToken(token)}
								/>
							</div>

							{!captchaToken && (
								<div className="flex justify-center">
									<p className="text-sm text-red-600">
										Please verify you're not a robot.
									</p>
								</div>
							)}

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
								disabled={loading || !isFormValid()}
								size="lg"
							>
								{loading
									? "Creating Account..."
									: "Create Account"}
							</Button>

							<div className="text-center">
								<span className="text-muted-foreground">
									Already have an account?{" "}
								</span>
								<Link
									to="/signin"
									className="text-blue-600 hover:text-purple-600 font-medium transition-colors"
								>
									Sign in
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
