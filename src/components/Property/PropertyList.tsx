import { useState } from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyListProps {
  initialProperties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ initialProperties }) => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFilterChange = async (filters: any) => {
    setLoading(true);
    
    try {
      // Start with a base query
      let query = supabase.from('properties').select('*');
      
      // Apply filters
      if (filters.city) {
        query = query.ilike('address', `%${filters.city}%`);
      }
      
      if (filters.minPrice > 0 || filters.maxPrice < 1000000) {
        // This is a simplified approach since price is stored as text
        // For a more robust solution, consider storing price as numeric in the database
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Filter the properties based on price range client-side
        const filteredProperties = data
          .filter(item => {
            const price = Number(item.price?.replace(/[^0-9.-]+/g, '')) || 0;
            return price >= filters.minPrice && price <= filters.maxPrice;
          })
          .map((item: any) => ({
            id: item.id || String(Math.random()),
            address: {
              street: item.address || '',
              city: item.city || 'Abilene',
              state: item.state || 'TX',
              zipCode: item.zipCode || '',
              neighborhood: item.neighborhood || '',
            },
            price: item.price ? Number(item.price.replace(/[^0-9.-]+/g, '')) : 0,
            beds: item.beds ? Number(item.beds) : 0,
            baths: item.baths ? Number(item.baths) : 0,
            sqft: item.size ? Number(item.size.replace(/[^0-9.-]+/g, '')) : 0,
            lotSize: 0,
            yearBuilt: 0,
            propertyType: item.type || 'Other',
            description: item.description || '',
            features: [],
            hasPool: false,
            hasGarage: false,
            garageSpaces: 0,
            images: item.image_url ? [item.image_url] : ['/placeholder.svg'],
            status: (item.status as "For Sale" | "For Rent" | "Sold" | "Pending") || 'For Sale',
            listedDate: item.received_at || new Date().toISOString(),
            agent: {
              id: '1',
              name: 'Abilene Commercial',
              phone: '123-456-7890',
              email: 'contact@abilenecommercial.com',
            },
            isFeatured: item.featured || false,
            mls: item.mls || '',
          } as Property));
          
        setProperties(filteredProperties);
      } else {
        // If no price filter, just fetch all
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Transform data to match Property type
        const transformedProperties = data.map((item: any) => ({
          id: item.id || String(Math.random()),
          address: {
            street: item.address || '',
            city: item.city || 'Abilene',
            state: item.state || 'TX',
            zipCode: item.zipCode || '',
            neighborhood: item.neighborhood || '',
          },
          price: item.price ? Number(item.price.replace(/[^0-9.-]+/g, '')) : 0,
          beds: item.beds ? Number(item.beds) : 0,
          baths: item.baths ? Number(item.baths) : 0,
          sqft: item.size ? Number(item.size.replace(/[^0-9.-]+/g, '')) : 0,
          lotSize: 0,
          yearBuilt: 0,
          propertyType: item.type || 'Other',
          description: item.description || '',
          features: [],
          hasPool: false,
          hasGarage: false,
          garageSpaces: 0,
          images: item.image_url ? [item.image_url] : ['/placeholder.svg'],
          status: (item.status as "For Sale" | "For Rent" | "Sold" | "Pending") || 'For Sale',
          listedDate: item.received_at || new Date().toISOString(),
          agent: {
            id: '1',
            name: 'Abilene Commercial',
            phone: '123-456-7890',
            email: 'contact@abilenecommercial.com',
          },
          isFeatured: item.featured || false,
          mls: item.mls || '',
        } as Property));
        
        setProperties(transformedProperties);
      }
    } catch (err: any) {
      console.error('Error filtering properties:', err);
      
      // Show error toast
      toast({
        title: 'Error filtering properties',
        description: 'Could not filter properties. Please try again later.',
        variant: 'destructive',
      });
      
      // Keep showing the initial properties
      setProperties(initialProperties);
    } finally {
      setLoading(false);
    }
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
