
import { Brain, FileText, Edit3, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Resume Writing",
      description: "Let our advanced AI craft compelling content tailored to your industry and role, ensuring maximum impact."
    },
    {
      icon: FileText,
      title: "Professional Templates",
      description: "Choose from a curated collection of modern, ATS-friendly templates designed by industry experts."
    },
    {
      icon: Edit3,
      title: "Real-Time Editing",
      description: "See your changes instantly with our intuitive live editing interface and smart formatting suggestions."
    },
    {
      icon: Download,
      title: "Instant PDF Downloads",
      description: "Download your polished, professional resume as a high-quality PDF ready for any application."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose ResumeVar?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of resume building with our cutting-edge features designed 
            to help you stand out in today's competitive job market
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 bg-white border-0 shadow-lg"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
