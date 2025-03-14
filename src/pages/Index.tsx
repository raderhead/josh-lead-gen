
import Layout from '@/components/Layout/Layout';
import HeroSection from '@/components/Home/HeroSection';
import FeaturedListings from '@/components/Home/FeaturedListings';
import HomeFeatures from '@/components/Home/HomeFeatures';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Phone, BarChart2, User } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedListings />
      <HomeFeatures />
      
      {/* Call to Action Section */}
      <section className="py-16 hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with our experienced real estate agents today and start your home buying or selling journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-estate-blue hover:bg-gray-100 flex items-center gap-2">
                <Phone size={20} />
                Contact Agent
              </Button>
            </Link>
            <Link to="/valuation">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 flex items-center gap-2">
                <BarChart2 size={20} />
                Free Home Valuation
              </Button>
            </Link>
            <Link to="/properties">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 flex items-center gap-2">
                <User size={20} />
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Hear from our satisfied clients about their experience working with Abilene Commercial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Working with EstateView was a fantastic experience! They helped me find my dream home in less than a month.",
                name: "Jennifer Smith",
                title: "Home Buyer"
              },
              {
                quote: "The home valuation tool was spot on, and their agent guided me through the selling process with expertise and care.",
                name: "Michael Johnson",
                title: "Home Seller"
              },
              {
                quote: "Their knowledge of the Abilene market is unmatched. The property search tools made finding our new home simple.",
                name: "David Williams",
                title: "First-time Buyer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
