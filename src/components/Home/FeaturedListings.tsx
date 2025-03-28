
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import PropertyCard from '../Property/PropertyCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FeaturedListings = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch from the Supabase webhook endpoint
      const response = await fetch('https://xfmguaamogzirnnqktwz.supabase.co/functions/v1/receive-webhook');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Transform the webhook data to match our Property type if needed
        const properties = data.map((item: any) => ({
          id: item.id || String(Math.random()),
          address: {
            street: item.address || '',
            city: item.city || 'Abilene',
            state: item.state || 'TX',
            zipCode: item.zipCode || '',
            neighborhood: item.neighborhood,
          },
          price: item.price ? Number(item.price) : 0,
          beds: item.beds ? Number(item.beds) : 0,
          baths: item.baths ? Number(item.baths) : 0,
          sqft: item.sqft ? Number(item.sqft) : 0,
          lotSize: item.lotSize,
          yearBuilt: item.yearBuilt,
          propertyType: item.propertyType || 'Other',
          description: item.description || '',
          features: item.features || [],
          hasPool: item.hasPool || false,
          hasGarage: item.hasGarage || false,
          garageSpaces: item.garageSpaces,
          images: item.images || ['/placeholder.svg'],
          status: item.status || 'For Sale',
          listedDate: item.listedDate || new Date().toISOString(),
          agent: item.agent || {
            id: '1',
            name: 'Abilene Commercial',
            phone: '123-456-7890',
            email: 'contact@abilenecommercial.com',
          },
          isFeatured: true,
        }));
        
        setFeaturedProperties(properties);
        setError(null);
      } else {
        throw new Error('Invalid data format received from webhook');
      }
    } catch (err: any) {
      console.error('Error fetching featured properties:', err);
      setError(err.message);
      
      // Notify the user about the error
      toast({
        title: 'Error fetching properties',
        description: 'Could not load featured properties from the webhook.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    
    // Set up a polling interval to fetch new data periodically
    const intervalId = setInterval(fetchProperties, 30000); // Poll every 30 seconds
    
    return () => {
      clearInterval(intervalId); // Clean up on component unmount
    };
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
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 bg-gray-50 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">Could not load properties</h3>
            <p className="mt-1 text-gray-500">Please try again later.</p>
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">No featured properties found</h3>
            <p className="mt-1 text-gray-500">Check back soon for new listings.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
