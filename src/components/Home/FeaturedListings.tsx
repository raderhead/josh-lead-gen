
import { useState, useEffect } from 'react';
import PropertyCard from '../Property/PropertyCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

// Define the property structure from webhook
interface WebhookProperty {
  id: string;
  address: string;
  price: string;
  image_url: string;
  title?: string;
  type?: string;
  featured?: boolean;
  // Add any other fields that come from the webhook
}

// Transform webhook properties to match our Property type format
const transformProperty = (property: WebhookProperty) => {
  // Extract address parts
  const addressParts = property.address?.split(',') || [];
  const street = addressParts[0] || '';
  const cityState = addressParts[1]?.trim().split(' ') || [];
  const city = cityState[0] || 'Abilene';
  const state = cityState[1] || 'TX';
  const zipCode = addressParts[2]?.trim().split(' ')[0] || '';

  // Parse price from string to number
  const priceValue = parseInt(property.price?.replace(/[^0-9]/g, '') || '0');
  
  return {
    id: property.id,
    address: {
      street,
      city,
      state,
      zipCode,
      neighborhood: '',
    },
    price: priceValue,
    beds: 0, // Default values
    baths: 0,
    sqft: 0,
    propertyType: property.type || 'Other',
    description: property.title || 'Commercial property in Abilene',
    features: [],
    hasPool: false,
    hasGarage: false,
    images: [property.image_url],
    status: 'For Sale',
    listedDate: new Date().toISOString().split('T')[0],
    agent: {
      id: "101",
      name: "Abilene Commercial",
      phone: "(325) 555-1234",
      email: "contact@abilenecommercial.com",
    }
  };
};

const FeaturedListings = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://xfmguaamogzirnnqktwz.supabase.co/functions/v1/receive-webhook');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter to get only featured properties and limit to 3
        const featured = Array.isArray(data) 
          ? data.filter((property: WebhookProperty) => property.featured)
              .slice(0, 3)
          : [];
          
        setFeaturedProperties(featured);
        console.log('Fetched featured properties:', featured);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error loading properties",
          description: "Could not load featured properties. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    
    // Set up polling every 60 seconds for live updates
    const interval = setInterval(fetchProperties, 60000);
    
    return () => clearInterval(interval);
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
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={transformProperty(property)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
