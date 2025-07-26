
import { Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the perfect plan for your resume generation needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative overflow-hidden border-2 border-green-200 hover:border-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <div className="absolute top-4 right-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Current
              </span>
            </div>
            
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Free</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/forever</span>
              </div>
              <p className="text-gray-600 mt-2">5 resumes per day</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">5 resumes per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">AI-powered generation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Basic templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">PDF download</span>
                </li>
              </ul>
              
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-all duration-300"
                disabled
              >
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative overflow-hidden border-2 border-gradient-to-r from-pink-300 to-purple-300 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Premium</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$7.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mt-2">50 resumes per day</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">50 resumes per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Premium templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Advanced customization</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Analytics dashboard</span>
                </li>
              </ul>
              
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                Subscribe Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
