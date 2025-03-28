
import Layout from '@/components/Layout/Layout';
import HeroSection from '@/components/Home/HeroSection';
import FeaturedListings from '@/components/Home/FeaturedListings';
import HomeFeatures from '@/components/Home/HomeFeatures';
import CallToAction from '@/components/Home/CallToAction';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Phone, BarChart2, Building } from 'lucide-react';

const Index = () => {
  return <Layout>
      <HeroSection />
      <FeaturedListings />
      <HomeFeatures />
      <CallToAction />
      
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
            {[{
            quote: "Working with Abilene Commercial was a fantastic experience! They helped us find the perfect retail space in less than a month.",
            name: "Jennifer Smith",
            title: "Business Owner"
          }, {
            quote: "The property valuation tool was spot on, and their agent guided me through the selling process with expertise and care.",
            name: "Michael Johnson",
            title: "Property Investor"
          }, {
            quote: "Their knowledge of the Abilene commercial market is unmatched. The property search tools made finding our new office simple.",
            name: "David Williams",
            title: "CEO"
          }].map((testimonial, index) => <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>
    </Layout>;
};

export default Index;
