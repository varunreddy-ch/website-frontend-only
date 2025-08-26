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
		<div className="min-h-screen">
			<Navbar />
			<div id="home">
				<HeroSection />
			</div>
			<FeaturesSection />
			<UploadSection />
			<div id="demo">
				<DemoSection />
			</div>
			{/* <div id="pricing">
        <PricingSection />
      </div> */}
			<ContactSection />
			<FAQSection />
			<Footer />
		</div>
	);
};

export default Index;
