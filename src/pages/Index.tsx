
import Layout from '@/components/Layout/Layout';
import HeroSection from '@/components/Home/HeroSection';
import FeaturedListings from '@/components/Home/FeaturedListings';

const Index = () => {
  return <Layout>
      <HeroSection />
      
      <FeaturedListings />
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Hear from our satisfied clients about their experience working with Abilene Commercial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Testimonial */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 italic mb-4">
                "Working with Josh made transaction a breeze. The entire process was smooth, efficient, and handled with excellence from start to finish."
              </p>
              <div>
                <p className="font-semibold text-gray-900">Tim Smith</p>
                <p className="text-gray-500 text-sm">Business Owner</p>
              </div>
            </div>
            
            {/* Second Testimonial */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600 italic mb-4">
                "As an investor and builder to commercial real estate, Josh has helped me find tenants for my properties!"
              </p>
              <div>
                <p className="font-semibold text-gray-900">Landon Couch</p>
                <p className="text-gray-500 text-sm">Real Estate Investor</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};

export default Index;
