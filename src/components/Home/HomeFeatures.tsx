
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, Home, Phone } from "lucide-react";

const HomeFeatures = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-estate-blue" />,
      title: "Advanced Property Search",
      description: "Filter homes by location, price, beds, baths, and more to find exactly what you're looking for."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-estate-green" />,
      title: "Home Valuation Tool",
      description: "Get an accurate estimate of your home's value based on recent sales and market trends."
    },
    {
      icon: <Home className="h-8 w-8 text-estate-red" />,
      title: "Featured Listings",
      description: "Browse our curated selection of premium properties in the most desirable neighborhoods."
    },
    {
      icon: <Phone className="h-8 w-8 text-estate-yellow" />,
      title: "Direct Agent Contact",
      description: "Connect directly with our experienced agents for personalized assistance and advice."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-2 bg-estate-light-blue text-estate-blue hover:bg-estate-light-blue">Our Services</Badge>
          <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect Home</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            EstateView provides all the tools you need to find your dream home or sell your property with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
