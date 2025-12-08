import React, { useState, useEffect, useRef } from "react";
import { Eye, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/api";

const TemplatePreviewSection: React.FC = () => {
	const [templates, setTemplates] = useState([
		{
			id: "template1",
			name: "Template 1",
			preview: "/template_previews/template1.pdf",
			download: "/template_previews/template1.pdf",
		},
		{
			id: "template2",
			name: "Template 2",
			preview: "/template_previews/template2.pdf",
			download: "/template_previews/template2.pdf",
		},
		{
			id: "template2a",
			name: "Template 2A",
			preview: "/template_previews/template2a.pdf",
			download: "/template_previews/template2a.pdf",
		},
		{
			id: "template2b",
			name: "Template 2B",
			preview: "/template_previews/template2b.pdf",
			download: "/template_previews/template2b.pdf",
		},
		{
			id: "template3",
			name: "Template 3",
			preview: "/template_previews/template3.pdf",
			download: "/template_previews/template3.pdf",
		},
		{
			id: "template4",
			name: "Template 4",
			preview: "/template_previews/template4.pdf",
			download: "/template_previews/template4.pdf",
		},
		{
			id: "template5",
			name: "Template 5",
			preview: "/template_previews/template5.pdf",
			download: "/template_previews/template5.pdf",
		},
		{
			id: "template6",
			name: "Template 6",
			preview: "/template_previews/template6.pdf",
			download: "/template_previews/template6.pdf",
		},
		{
			id: "template7",
			name: "Template 7",
			preview: "/template_previews/template7.pdf",
			download: "/template_previews/template7.pdf",
		},
		{
			id: "template8",
			name: "Template 8",
			preview: "/template_previews/template8.pdf",
			download: "/template_previews/template8.pdf",
		},
		{
			id: "template9",
			name: "Template 9",
			preview: "/template_previews/template9.pdf",
			download: "/template_previews/template9.pdf",
		},
		{
			id: "template10",
			name: "Template 10",
			preview: "/template_previews/template10.pdf",
			download: "/template_previews/template10.pdf",
		},
	]);

	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isScrolling, setIsScrolling] = useState(true);
	const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
	const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
		null
	);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [hoveredTemplateIndex, setHoveredTemplateIndex] = useState<
		number | null
	>(null);

	// Fetch templates from API on component mount
	useEffect(() => {
		const fetchTemplates = async () => {
			try {
				const response = await API.get("/templates");
				if (response.data && response.data.templates) {
					setTemplates(response.data.templates);
				}
			} catch (error) {
				console.error("Error fetching templates:", error);
				// Keep the default templates if API call fails
			}
		};

		fetchTemplates();
	}, []);

	// Auto-scroll functionality with smooth restart from end to start
	useEffect(() => {
		if (isScrolling) {
			scrollIntervalRef.current = setInterval(() => {
				if (scrollContainerRef.current) {
					const { scrollLeft, scrollWidth, clientWidth } =
						scrollContainerRef.current;

					// If we're at the end, smoothly scroll back to the beginning
					if (scrollLeft >= scrollWidth - clientWidth - 10) {
						// Pause the interval temporarily for smooth transition
						if (scrollIntervalRef.current) {
							clearInterval(scrollIntervalRef.current);
						}

						// Smooth scroll back to start with slower speed
						scrollContainerRef.current.scrollTo({
							left: 0,
							behavior: "smooth",
						});

						// Reset template index
						setCurrentTemplateIndex(0);

						// Resume scrolling after a brief pause to allow smooth transition
						setTimeout(() => {
							if (isScrolling) {
								scrollIntervalRef.current = setInterval(() => {
									if (scrollContainerRef.current) {
										scrollContainerRef.current.scrollBy({
											left: 1,
											behavior: "smooth",
										});
									}
								}, 25);
							}
						}, 2000); // 2 second pause for smooth transition

						return;
					}

					// Continue scrolling
					scrollContainerRef.current.scrollBy({
						left: 1,
						behavior: "smooth",
					});
				}
			}, 2); // Slower scroll for smoother movement
		}

		return () => {
			if (scrollIntervalRef.current) {
				clearInterval(scrollIntervalRef.current);
			}
		};
	}, [isScrolling]);

	const handleMouseEnter = () => {
		setIsScrolling(false);
		if (scrollIntervalRef.current) {
			clearInterval(scrollIntervalRef.current);
		}
	};

	const handleMouseLeave = () => {
		setIsScrolling(true);
	};

	// Handle scroll events to update current template index
	const handleScroll = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, clientWidth } = scrollContainerRef.current;
			const templateWidth = 340 + 24; // template width + gap
			const newIndex = Math.round(scrollLeft / templateWidth);
			setCurrentTemplateIndex(Math.min(newIndex, templates.length - 1));
		}
	};

	// Handle escape key to close modal
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isPreviewOpen) {
				setIsPreviewOpen(false);
				setSelectedTemplate(null);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isPreviewOpen]);

	return (
		<section
			id="templates"
			className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden"
		>
			{/* Background decorative elements */}
			<div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
			<div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-400/5 to-blue-400/5 rounded-full blur-3xl"></div>

			<div className="w-full relative z-10">
				{/* Section Header */}
				<div className="text-center mb-16 px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
						Choose Your Perfect{" "}
						<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
							Resume Template
						</span>
					</h2>
					<p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
						Browse through our collection of professionally designed
						templates. Each template is optimized for different
						industries and career levels.
					</p>
				</div>

				{/* Current Template Indicator */}
				<div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
					<div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg border border-blue-100">
						<div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
						<p className="text-lg text-gray-700 font-medium">
							Currently viewing:{" "}
							<span className="text-blue-600 font-bold text-xl">
								{hoveredTemplateIndex !== null
									? templates[hoveredTemplateIndex]?.name
									: templates[currentTemplateIndex]?.name}
							</span>
						</p>
					</div>
				</div>

				{/* Templates Grid with Full Width Horizontal Scrolling */}
				<div className="w-full">
					{/* Scrollable Container - Full Width */}
					<div
						ref={scrollContainerRef}
						className="flex gap-8 overflow-x-auto scrollbar-hide pb-8 px-8"
						style={{
							scrollbarWidth: "none",
							msOverflowStyle: "none",
						}}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						onScroll={handleScroll}
					>
						{templates.map((template, index) => (
							<Card
								key={template.id}
								className={`min-w-[340px] max-w-[340px] bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 rounded-2xl overflow-hidden mr-2`}
								onMouseEnter={() =>
									setHoveredTemplateIndex(index)
								}
								onMouseLeave={() =>
									setHoveredTemplateIndex(null)
								}
							>
								<CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-blue-50/30">
									<CardTitle className="text-lg font-bold text-gray-800 text-center">
										{template.name}
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									{/* Template Preview Card */}
									<div
										className="w-full h-80 bg-gradient-to-br from-gray-100 to-blue-50 rounded-xl overflow-hidden mb-3 border border-gray-200 relative group cursor-pointer"
										onClick={() => {
											setSelectedTemplate(
												template.preview
											);
											setIsPreviewOpen(true);
										}}
									>
										{/* PDF Preview */}
										<div
											className="pdf-container"
											onContextMenu={(e) =>
												e.preventDefault()
											}
										>
											<iframe
												src={`${template.preview}#toolbar=0&navpanes=0&scrollbar=0&download=0&print=0&fullscreen=0&view=FitH&zoom=110`}
												className="w-full h-full border-0"
												title={`${template.name} Preview`}
												style={{
													margin: "-2px",
													padding: 0,
													border: "none",
													outline: "none",
													width: "calc(100% + 4px)",
													height: "calc(100% + 4px)",
												}}
											/>
										</div>

										{/* Hover Overlay - No Button, Just Visual Feedback */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
											<div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
												<Eye className="h-5 w-5 text-gray-700" />
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Custom Template CTA */}
				<div className="text-center mt-16 mx-4 sm:mx-6 lg:mx-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl p-10 shadow-2xl border border-blue-100/50 backdrop-blur-sm relative overflow-hidden">
					{/* Background decorative elements */}
					<div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

					<div className="relative z-10">
						<h3 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Need a Custom Template?
						</h3>
						<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
							Can't find the perfect template? ResumeVar can
							create custom templates tailored to your specific
							needs and industry requirements.
						</p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
							<a
								href="https://wa.me/919573140921"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 text-gray-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								<div className="p-2 bg-green-100 rounded-full">
									<svg
										className="h-5 w-5 text-green-600"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
									</svg>
								</div>
								<span className="font-semibold text-lg">
									+91 9573140921
								</span>
							</a>
							<a
								href="https://wa.me/919573140921?text=Hi, I would like to book a demo session. Please let me know available time slots."
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 text-gray-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								<div className="p-2 bg-green-100 rounded-full">
									<svg
										className="h-5 w-5 text-green-600"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
									</svg>
								</div>
								<span className="font-semibold text-lg">
									Contact Us to Book a Demo
								</span>
							</a>
						</div>
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-20 px-4 sm:px-6 lg:px-8">
					<div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-3xl p-8 border border-blue-200/50">
						<p className="text-xl text-gray-700 mb-8 font-medium">
							Ready to get started? Choose your template and begin
							creating your professional resume!
						</p>
						<Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 border-0">
							Start Creating Your Resume
						</Button>
					</div>
				</div>
			</div>

			{/* Template Preview Modal */}
			{isPreviewOpen && selectedTemplate && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div
						className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								Template Preview
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setIsPreviewOpen(false);
									setSelectedTemplate(null);
								}}
								className="hover:bg-gray-200"
							>
								<X className="h-5 w-5" />
							</Button>
						</div>

						{/* PDF Content */}
						<div
							className="flex-1 w-full h-full pdf-container"
							onContextMenu={(e) => e.preventDefault()}
						>
							<iframe
								src={`${selectedTemplate}#toolbar=0&navpanes=0&scrollbar=0&download=0&print=0&fullscreen=0&view=FitH&zoom=110`}
								className="w-full h-full border-0"
								title="Template Preview"
								style={{
									margin: "-2px",
									padding: 0,
									border: "none",
									outline: "none",
									width: "calc(100% + 4px)",
									height: "calc(100% + 4px)",
								}}
							/>
						</div>
					</div>

					{/* Backdrop click handler */}
					<div
						className="absolute inset-0 -z-10"
						onClick={() => {
							setIsPreviewOpen(false);
							setSelectedTemplate(null);
						}}
					/>
				</div>
			)}

			{/* Custom CSS for hiding scrollbar and animations */}
			<style>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				@keyframes gradient {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}

				.animate-gradient {
					background-size: 200% 200%;
					animation: gradient 3s ease infinite;
				}

				/* Prevent PDF interactions and downloads */
				iframe {
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
					-webkit-touch-callout: none;
					-khtml-user-select: none;
					width: 100% !important;
					height: 100% !important;
					object-fit: contain;
					margin: 0 !important;
					padding: 0 !important;
					border: none !important;
					outline: none !important;
					background: transparent !important;
					display: block !important;
				}

				/* Ensure PDF container is properly sized */
				.pdf-container {
					width: 100%;
					height: 100%;
					overflow: hidden;
					margin: 0;
					padding: 0;
					border: none;
					background: transparent;
				}

				/* Remove any default iframe styling */
				iframe[src*=".pdf"] {
					border: none !important;
					outline: none !important;
					box-shadow: none !important;
					background: white !important;
				}

				/* Ensure no gaps or borders in PDF containers */
				.pdf-container iframe {
					transform: scale(1.02);
					transform-origin: center center;
				}
			`}</style>
		</section>
	);
};

export default TemplatePreviewSection;
