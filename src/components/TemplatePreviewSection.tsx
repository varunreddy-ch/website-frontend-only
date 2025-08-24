import React, { useState, useEffect, useRef } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Eye,
	Download,
	Mail,
	Calendar,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TemplatePreviewSection: React.FC = () => {
	const templates = [
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
	];

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

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const newIndex =
				currentTemplateIndex === 0
					? templates.length - 1
					: currentTemplateIndex - 1;
			setCurrentTemplateIndex(newIndex);

			// If we're at the beginning, scroll to the end smoothly
			if (newIndex === templates.length - 1) {
				scrollContainerRef.current.scrollTo({
					left:
						scrollContainerRef.current.scrollWidth -
						scrollContainerRef.current.clientWidth,
					behavior: "smooth",
				});
			} else {
				scrollContainerRef.current.scrollBy({
					left: -400,
					behavior: "smooth",
				});
			}
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const newIndex =
				currentTemplateIndex === templates.length - 1
					? 0
					: currentTemplateIndex + 1;
			setCurrentTemplateIndex(newIndex);

			// If we're at the end, scroll to the beginning smoothly
			if (newIndex === 0) {
				scrollContainerRef.current.scrollTo({
					left: 0,
					behavior: "smooth",
				});
			} else {
				scrollContainerRef.current.scrollBy({
					left: 400,
					behavior: "smooth",
				});
			}
		}
	};

	// Auto-scroll functionality with circular behavior
	useEffect(() => {
		if (isScrolling) {
			scrollIntervalRef.current = setInterval(() => {
				if (scrollContainerRef.current) {
					const { scrollLeft, scrollWidth, clientWidth } =
						scrollContainerRef.current;

					// If we're at the end, smoothly scroll back to the beginning
					if (scrollLeft >= scrollWidth - clientWidth - 10) {
						scrollContainerRef.current.scrollTo({
							left: 0,
							behavior: "smooth",
						});
						setCurrentTemplateIndex(0);
					} else {
						scrollContainerRef.current.scrollBy({
							left: 1,
							behavior: "smooth",
						});
					}
				}
			}, 25); // Slower scroll for smoother movement
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
			const templateWidth = 320 + 24; // template width + gap
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

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Section Header */}
				<div className="text-center mb-16">
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
				<div className="text-center mb-12">
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

				{/* Templates Grid with Horizontal Scrolling */}
				<div className="relative group">
					{/* Left Scroll Button */}
					<button
						onClick={scrollLeft}
						className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:-translate-x-1"
					>
						<ChevronLeft className="h-7 w-7 text-gray-600" />
					</button>

					{/* Right Scroll Button */}
					<button
						onClick={scrollRight}
						className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:translate-x-1"
					>
						<ChevronRight className="h-7 w-7 text-gray-600" />
					</button>

					{/* Scrollable Container */}
					<div
						ref={scrollContainerRef}
						className="flex gap-8 overflow-x-auto scrollbar-hide pb-8 px-4"
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
								className={`min-w-[350px] max-w-[350px] bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 rounded-2xl overflow-hidden ${
									index === currentTemplateIndex
										? "ring-4 ring-blue-500/30 shadow-2xl"
										: ""
								}`}
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
									<div className="w-full h-80 bg-gradient-to-br from-gray-100 to-blue-50 rounded-xl overflow-hidden mb-3 border border-gray-200 relative group">
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

										{/* Hover Overlay with Preview Button */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
											<Button
												variant="outline"
												size="sm"
												className="bg-white text-gray-900 hover:bg-gray-100 border-white shadow-lg hover:shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
												onClick={() => {
													setSelectedTemplate(
														template.preview
													);
													setIsPreviewOpen(true);
												}}
											>
												<Eye className="h-4 w-4 mr-2" />
												Preview
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Custom Template CTA */}
				<div className="text-center mt-16 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl p-10 shadow-2xl border border-blue-100/50 backdrop-blur-sm relative overflow-hidden">
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
							<div className="flex items-center gap-3 text-gray-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
								<div className="p-2 bg-blue-100 rounded-full">
									<Mail className="h-5 w-5 text-blue-600" />
								</div>
								<span className="font-semibold text-lg">
									support@resumevar.com
								</span>
							</div>
							<div className="flex items-center gap-3 text-gray-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
								<div className="p-2 bg-purple-100 rounded-full">
									<Calendar className="h-5 w-5 text-purple-600" />
								</div>
								<span className="font-semibold text-lg">
									Book a Demo
								</span>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-6 justify-center">
							<Button
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 border-0"
								onClick={() => {
									window.open(
										"mailto:support@resumevar.com?subject=Custom Template Request&body=Hi, I would like to request a custom resume template. Please provide more details about your requirements.",
										"_blank"
									);
								}}
							>
								<Mail className="h-5 w-5 mr-3" />
								Contact Support
							</Button>
							<Button
								variant="outline"
								className="border-3 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-4 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 bg-white/90 backdrop-blur-sm"
								onClick={() => {
									// You can replace this with your actual demo booking URL
									window.open(
										"https://calendly.com/resumevar/demo",
										"_blank"
									);
								}}
							>
								<Calendar className="h-5 w-5 mr-3" />
								Book Demo
							</Button>
						</div>
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-20">
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
