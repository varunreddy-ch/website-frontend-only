import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import UploadSection from "@/components/UploadSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import DemoSection from "@/components/DemoSection";

const demoFormUrl = "https://forms.gle/AVA1DtN8ZCwx58Cd8";

const Index = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-1">
				<div id="home">
					<HeroSection />
				</div>
				<FeaturesSection />
				<UploadSection />

			{/* Template Section Header */}
			<section
				id="templates"
				className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden"
			>
				{/* Background decorative elements */}
				<div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-400/5 to-blue-400/5 rounded-full blur-3xl"></div>

				<div className="w-full relative z-10">
					{/* Section Header */}
					<div className="text-center mb-8 px-4 sm:px-6 lg:px-8">
						<h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
							Choose Your Perfect{" "}
							<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
								Resume Template
							</span>
						</h2>
						<p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
							Browse through our collection of professionally
							designed templates. Each template is optimized for
							different industries and career levels.
						</p>
					</div>
				</div>
			</section>

			{/* Custom Template CTA */}
			<section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

				<div className="relative z-10 text-center mx-4 sm:mx-6 lg:mx-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl p-10 shadow-2xl border border-blue-100/50 backdrop-blur-sm">
					<h3 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Need a Custom Template?
					</h3>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
						Can't find the perfect template? ResumeVar can create
						custom templates tailored to your specific needs and
						industry requirements.
					</p>

				<div className="text-center text-sm text-gray-500">
					Custom template requests are available after a demo.
				</div>
				</div>
			</section>

			<div id="demo">
				<DemoSection />
			</div>
			{/* <div id="pricing">
        <PricingSection />
      </div> */}
				<ContactSection />
				<FAQSection />
			</main>
			<Footer />

			{/* Custom CSS for gradient animation */}
			<style>{`
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
			`}</style>
		</div>
	);
};

export default Index;
