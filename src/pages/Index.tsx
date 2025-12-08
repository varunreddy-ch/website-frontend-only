import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import UploadSection from "@/components/UploadSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import DemoSection from "@/components/DemoSection";

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
