
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import PropertyCard from '../Property/PropertyCard';
import { getFeaturedProperties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedListings = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with delay
    const timer = setTimeout(() => {
      const properties = getFeaturedProperties();
      setFeaturedProperties(properties);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <p className="mt-2 text-gray-600">Discover our handpicked properties in Abilene</p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
