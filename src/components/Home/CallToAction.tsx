
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Building, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction: React.FC = () => {
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
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-estate-blue hover:bg-estate-blue/90">
                <Link to="/contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact an Agent
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-estate-blue text-estate-blue hover:bg-estate-light-blue/50">
                <Link to="/properties" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Browse Properties
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-estate-blue text-estate-blue hover:bg-estate-light-blue/50">
                <Link to="/valuation" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Get Free Valuation
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/public/placeholder.svg" 
              alt="Commercial Real Estate Agent" 
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
