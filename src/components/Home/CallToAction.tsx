
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Building, BarChart2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CallToAction: React.FC = () => {
  const benefits = [
    {
      title: "Market Expertise",
      description: "Deep knowledge of the Abilene commercial real estate market",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
    },
    {
      title: "Tailored Solutions",
      description: "Personalized approach to meet your specific business needs",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
    },
    {
      title: "Transparent Process",
      description: "Clear communication and guidance throughout the transaction",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
    },
  ];

  return (
    <section className="py-16 bg-estate-light-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Find Your Perfect Commercial Property?
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              Our team of experienced agents is here to help you navigate the Abilene commercial real estate market. 
              Whether you're buying, selling, or leasing, we've got you covered.
            </p>
          </div>
          <div className="hidden md:block bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Abilene Commercial</h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  {benefit.icon}
                  <div>
                    <h4 className="font-medium text-gray-900">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-estate-light-blue/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-estate-blue">
                "Working with Abilene Commercial was the best decision for our business expansion. They found us the perfect location with excellent terms."
              </p>
              <p className="text-sm text-gray-600 mt-2">— Sarah Johnson, Local Business Owner</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
