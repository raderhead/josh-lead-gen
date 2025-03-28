
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import PropertyCard from '../Property/PropertyCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Webhook, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FeaturedListings = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch directly from Supabase properties table
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .limit(6);
      
      if (fetchError) {
        throw new Error(`Failed to fetch properties: ${fetchError.message}`);
      }
      
      console.log('Properties from Supabase:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        // Transform the data to match our Property type
        const properties = data.map((item: any) => ({
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
          isFeatured: true,
          mls: item.mls || '',
        } as Property));
        
        setFeaturedProperties(properties);
        setError(null);
      } else {
        // If no data, try the webhook as a fallback
        const response = await fetch('https://xfmguaamogzirnnqktwz.supabase.co/functions/v1/receive-webhook');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch properties from webhook: ${response.status} ${response.statusText}`);
        }
        
        const webhookData = await response.json();
        console.log('Webhook response:', webhookData);
        
        if (Array.isArray(webhookData) && webhookData.length > 0) {
          // Process webhook data
          const properties = webhookData.map((item: any) => ({
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
            status: (item.status as "For Sale" | "For Rent" | "Sold" | "Pending") || 'For Sale',
            listedDate: item.listedDate || new Date().toISOString(),
            agent: item.agent || {
              id: '1',
              name: 'Abilene Commercial',
              phone: '123-456-7890',
              email: 'contact@abilenecommercial.com',
            },
            isFeatured: true,
          } as Property));
          
          setFeaturedProperties(properties);
          setError(null);
        } else if (webhookData && webhookData.success) {
          // If webhook returns success but no data
          setFeaturedProperties([]);
          setError('No properties found');
        } else {
          throw new Error('No properties found in database or webhook');
        }
      }
    } catch (err: any) {
      console.error('Error fetching featured properties:', err);
      setError(err.message);
      
      // Notify the user about the error
      toast({
        title: 'Error fetching properties',
        description: 'Could not load featured properties from Supabase.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    try {
      setTestingWebhook(true);
      
      // Test sample data to post to the webhook
      const testData = {
        id: "test-" + Date.now(),
        address: "123 Test Street",
        city: "Abilene",
        state: "TX",
        zipCode: "79601",
        price: 299000,
        beds: 3,
        baths: 2,
        sqft: 2000,
        propertyType: "Single Family",
        description: "This is a test property generated by the webhook test button.",
        images: ["/placeholder.svg"],
        status: "For Sale",
        listedDate: new Date().toISOString(),
      };
      
      // Send test data to the webhook
      const response = await fetch('https://xfmguaamogzirnnqktwz.supabase.co/functions/v1/receive-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      if (!response.ok) {
        throw new Error(`Test webhook failed: ${response.status} ${response.statusText}`);
      }
      
      toast({
        title: 'Test webhook successful',
        description: 'A test property has been sent to the webhook. Refreshing properties list...',
      });
      
      // Fetch properties after successful test
      await fetchProperties();
      
    } catch (err: any) {
      console.error('Error testing webhook:', err);
      
      toast({
        title: 'Error testing webhook',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setTestingWebhook(false);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div className="flex justify-center gap-4 mt-4">
              <Button 
                onClick={fetchProperties} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RefreshCcw size={16} />
                Retry
              </Button>
              <Button 
                onClick={testWebhook} 
                disabled={testingWebhook}
                variant="estate" 
                className="flex items-center gap-2"
              >
                <Webhook size={16} />
                {testingWebhook ? "Sending test data..." : "Test Webhook"}
              </Button>
            </div>
          </div>
        ) : featuredProperties.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {featuredProperties.map((property) => (
                <CarouselItem key={property.id} className="md:basis-1/3">
                  <div className="p-1">
                    <PropertyCard property={property} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-6">
              <CarouselPrevious className="relative static" />
              <CarouselNext className="relative static" />
            </div>
          </Carousel>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">No featured properties found</h3>
            <p className="mt-1 text-gray-500">You can test the webhook by clicking the button below.</p>
            <Button 
              onClick={testWebhook} 
              disabled={testingWebhook}
              variant="estate" 
              className="mt-4 flex items-center gap-2"
            >
              <Webhook size={16} />
              {testingWebhook ? "Sending test data..." : "Test Webhook"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
