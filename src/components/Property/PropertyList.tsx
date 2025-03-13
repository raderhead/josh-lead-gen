
import { useState } from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import { getPropertiesByFilter } from '@/data/properties';

interface PropertyListProps {
  initialProperties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ initialProperties }) => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (filters: any) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const filteredProperties = getPropertiesByFilter(filters);
      setProperties(filteredProperties);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full">
      <PropertyFilters onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyList;
