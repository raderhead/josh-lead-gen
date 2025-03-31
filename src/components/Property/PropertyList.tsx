
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyListProps {
  initialProperties?: Property[];
  searchTerm?: string;
  filters?: any;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  initialProperties = [], 
  searchTerm = "",
  filters = {}
}) => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const { toast } = useToast();

  // Load all properties when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .returns<any[]>();
          
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
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        toast({
          title: 'Error loading properties',
          description: 'Could not load properties. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [toast]);

  // This function will apply filters when called
  const handleFilterChange = async (newFilters: any) => {
    setLoading(true);
    setIsFiltering(true);
    
    try {
      // Start with a base query
      let query = supabase.from('properties').select('*');
      
      // Apply search term if it exists
      if (searchTerm) {
        query = query.or(`address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }
      
      // Apply property type filter (skip if "any" is selected)
      if (newFilters.propertyType && newFilters.propertyType !== 'any') {
        query = query.eq('type', newFilters.propertyType);
      }
      
      // Execute the query
      const { data, error } = await query.returns<any[]>();
      
      if (error) {
        throw error;
      }
      
      // Filter the properties based on price range client-side
      let filteredProperties = data;
      
      if (newFilters.minPrice > 0 || newFilters.maxPrice < 1000000) {
        filteredProperties = data.filter(item => {
          const price = Number(item.price?.replace(/[^0-9.-]+/g, '')) || 0;
          return price >= newFilters.minPrice && price <= newFilters.maxPrice;
        });
      }
        
      // Transform data to match Property type
      const transformedProperties = filteredProperties.map((item: any) => ({
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
    } catch (err: any) {
      console.error('Error filtering properties:', err);
      
      // Show error toast
      toast({
        title: 'Error filtering properties',
        description: 'Could not filter properties. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      // Add a short delay before removing the filtering state to ensure smooth transition
      setTimeout(() => {
        setIsFiltering(false);
      }, 300);
    }
  };

  // Apply filters when searchTerm or filters change
  useEffect(() => {
    if (searchTerm || Object.keys(filters).length > 0) {
      handleFilterChange({ ...filters, searchTerm });
    }
  }, [searchTerm, filters]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className={`transition-opacity duration-500 ${isFiltering ? 'opacity-70' : 'opacity-100'}`}>
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
        </div>
      )}
    </div>
  );
};

export default PropertyList;
