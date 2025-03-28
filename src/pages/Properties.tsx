
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import PropertyList from '@/components/Property/PropertyList';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Webhook, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Properties = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
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
        .select('*');
      
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
          isFeatured: item.featured || false,
          mls: item.mls || '',
        } as Property));
        
        setAllProperties(properties);
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
            isFeatured: item.isFeatured || false,
          } as Property));
          
          setAllProperties(properties);
          setError(null);
        } else if (webhookData && webhookData.success) {
          // If webhook returns success but no data
          setAllProperties([]);
          setError('No properties found');
        } else {
          throw new Error('No properties found in database or webhook');
        }
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message);
      
      // Notify the user about the error
      toast({
        title: 'Error fetching properties',
        description: 'Could not load properties from Supabase.',
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
    
    // Set up a polling interval to fetch new data periodically - increase to 2 minutes to reduce blinking
    const intervalId = setInterval(fetchProperties, 120000); // Poll every 2 minutes instead of 30 seconds
    
    return () => {
      clearInterval(intervalId); // Clean up on component unmount
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Commercial Properties</h1>
          <p className="text-muted-foreground mt-2">Find your perfect commercial space in Abilene and surrounding areas</p>
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
        ) : allProperties.length > 0 ? (
          <PropertyList initialProperties={allProperties} />
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
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
    </Layout>
  );
};

export default Properties;
