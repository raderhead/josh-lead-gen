
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import PropertyList from '@/components/Property/PropertyList';
import { Property } from '@/types/property';
import { properties } from '@/data/properties';

const Properties = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with delay
    const timer = setTimeout(() => {
      setAllProperties(properties);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Properties for Sale</h1>
          <p className="text-gray-600 mt-2">Find your perfect home in Abilene and surrounding areas</p>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <PropertyList initialProperties={allProperties} />
        )}
      </div>
    </Layout>
  );
};

export default Properties;
