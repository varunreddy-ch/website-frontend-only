import { Upload, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const UploadSection = () => {
	const navigate = useNavigate();
	return (
		<section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
						How would you like to create your resume?
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Choose your preferred method to get started with your
						professional resume. Our AI will help you create a
						standout resume either way.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					{/* Upload Option */}
					<Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-blue-500 to-indigo-600 border-0 overflow-hidden relative">
						<div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<CardContent className="relative z-10 p-8 text-center text-white">
							<div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
								<Upload className="h-10 w-10 text-white" />
							</div>
							<h3 className="text-2xl font-bold mb-4">
								Upload Existing Resume
							</h3>
							<p className="text-blue-100 mb-8 leading-relaxed">
								Have a resume already? Upload it and let our AI
								enhance it with professional formatting, ATS
								optimization, and industry-specific
								improvements.
							</p>
							<div className="space-y-6">
								<div className="p-8 border-2 border-dashed border-white/30 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300">
									<p className="text-sm text-blue-100 mb-4">
										Drag and drop your file here
									</p>
									<Button
										variant="secondary"
										onClick={() => navigate("/signin")}
										className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
									>
										Choose File
									</Button>
									<p className="text-xs text-blue-200 mt-4">
										Supports PDF, DOC, DOCX formats
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Manual Entry Option */}
					<Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white border-2 border-gray-200 hover:border-indigo-300 overflow-hidden relative">
						<div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<CardContent className="relative z-10 p-8 text-center">
							<div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
								<Edit3 className="h-10 w-10 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Create from Scratch
							</h3>
							<p className="text-gray-600 mb-8 leading-relaxed">
								Starting fresh? No problem! Use our guided
								step-by-step builder with AI-powered suggestions
								to craft the perfect resume tailored to your
								industry.
							</p>
							<div className="space-y-6">
								<div className="p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300">
									<p className="text-sm text-gray-600 mb-4">
										Start with our guided form builder
									</p>
									<Button
										onClick={() => navigate("/signin")}
										className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
									>
										Start Building
									</Button>
									<p className="text-xs text-gray-500 mt-4">
										Get AI suggestions as you type
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Additional Info */}
				{/* <div className="text-center mt-12">
					<p className="text-gray-600 text-lg">
						Both options include{" "}
						<span className="font-semibold text-blue-600">
							AI-powered optimization
						</span>
						,
						<span className="font-semibold text-blue-600">
							{" "}
							professional templates
						</span>
						, and
						<span className="font-semibold text-blue-600">
							{" "}
							instant PDF download
						</span>
					</p>
				</div> */}
			</div>
		</section>
	);
};

export default UploadSection;
