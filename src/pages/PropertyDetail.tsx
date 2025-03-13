
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Property } from '@/types/property';
import { getPropertyById } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bed,
  Bath,
  Square,
  Calendar,
  MapPin,
  Heart,
  Share2,
  Printer,
  Phone,
  Mail,
  Home,
  Car,
  Pool,
  CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch with delay
    const timer = setTimeout(() => {
      if (id) {
        const foundProperty = getPropertyById(id);
        if (foundProperty) {
          setProperty(foundProperty);
          setMainImage(foundProperty.images[0]);
        }
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleContactAgent = () => {
    toast({
      title: "Message Sent",
      description: "The agent will contact you shortly.",
      duration: 3000,
    });
  };

  const handleSaveProperty = () => {
    toast({
      title: "Property Saved",
      description: "This property has been added to your favorites.",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-2/3 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 w-1/3 rounded mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the property you're looking for.
          </p>
          <Link to="/properties">
            <Button>View All Properties</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <Badge className="mr-2 bg-estate-blue">{property.status}</Badge>
              <p className="text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Listed on {new Date(property.listedDate).toLocaleDateString()}
              </p>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.address.street}</h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-estate-red" />
              {property.address.city}, {property.address.state} {property.address.zipCode}
              {property.address.neighborhood && ` • ${property.address.neighborhood}`}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-3xl font-bold text-estate-blue">{formatCurrency(property.price)}</p>
            <p className="text-gray-600">{formatCurrency(Math.round(property.price / property.sqft))}/sqft</p>
          </div>
        </div>
        
        {/* Property Images */}
        <div className="mb-8">
          <div className="w-full h-[500px] overflow-hidden rounded-lg mb-4">
            <img 
              src={mainImage} 
              alt={property.address.street} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {property.images.map((image, index) => (
              <div 
                key={index} 
                className={`h-24 overflow-hidden rounded-lg cursor-pointer border-2 ${mainImage === image ? 'border-estate-blue' : 'border-transparent'}`}
                onClick={() => setMainImage(image)}
              >
                <img 
                  src={image} 
                  alt={`${property.address.street} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Property Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Property Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 text-estate-blue mb-2" />
                  <span className="text-lg font-semibold">{property.beds}</span>
                  <span className="text-gray-500 text-sm">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 text-estate-blue mb-2" />
                  <span className="text-lg font-semibold">{property.baths}</span>
                  <span className="text-gray-500 text-sm">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 text-estate-blue mb-2" />
                  <span className="text-lg font-semibold">{property.sqft.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">Square Feet</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Home className="h-6 w-6 text-estate-blue mb-2" />
                  <span className="text-lg font-semibold">{property.yearBuilt}</span>
                  <span className="text-gray-500 text-sm">Year Built</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                {property.hasGarage && (
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                    <Car className="h-4 w-4" />
                    {property.garageSpaces}-Car Garage
                  </Badge>
                )}
                {property.hasPool && (
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                    <Pool className="h-4 w-4" />
                    Pool
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <MapPin className="h-4 w-4" />
                  {property.address.neighborhood || property.address.city}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <Home className="h-4 w-4" />
                  {property.propertyType}
                </Badge>
              </div>
              <p className="text-gray-700 mb-4">{property.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleSaveProperty} className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="features">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="details">Property Details</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-2">
                <h3 className="text-xl font-semibold mb-4">Property Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center py-1">
                      <CheckCircle className="h-5 w-5 text-estate-green mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-2">
                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">Property Type</p>
                    <p className="font-medium">{property.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Year Built</p>
                    <p className="font-medium">{property.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Square Footage</p>
                    <p className="font-medium">{property.sqft.toLocaleString()} sqft</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Lot Size</p>
                    <p className="font-medium">{property.lotSize} acres</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Garage</p>
                    <p className="font-medium">{property.hasGarage ? `${property.garageSpaces}-Car Garage` : 'No Garage'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Pool</p>
                    <p className="font-medium">{property.hasPool ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Status</p>
                    <p className="font-medium">{property.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Listed Date</p>
                    <p className="font-medium">{new Date(property.listedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="map" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-2">
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map View - In a real implementation, this would be a Google Maps integration showing the property location.</p>
                </div>
                <p className="mt-4 text-gray-600 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-estate-red" />
                  {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Agent Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center mb-4">
                {property.agent.photo ? (
                  <img 
                    src={property.agent.photo} 
                    alt={property.agent.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                  <p className="text-gray-600">Listing Agent</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <a href={`tel:${property.agent.phone}`} className="flex items-center text-gray-700 hover:text-estate-blue">
                  <Phone className="h-5 w-5 mr-3 text-estate-blue" />
                  {property.agent.phone}
                </a>
                <a href={`mailto:${property.agent.email}`} className="flex items-center text-gray-700 hover:text-estate-blue">
                  <Mail className="h-5 w-5 mr-3 text-estate-blue" />
                  {property.agent.email}
                </a>
              </div>
              <Button className="w-full bg-estate-blue hover:bg-estate-dark-blue" onClick={handleContactAgent}>
                Contact Agent
              </Button>
            </div>
            
            {/* Mortgage Calculator */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Mortgage Calculator</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">Home Price</p>
                  <p className="font-medium">{formatCurrency(property.price)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Down Payment (20%)</p>
                  <p className="font-medium">{formatCurrency(property.price * 0.2)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Loan Amount</p>
                  <p className="font-medium">{formatCurrency(property.price * 0.8)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Estimated Monthly Payment</p>
                  <p className="font-bold text-xl text-estate-blue">
                    {formatCurrency(Math.round((property.price * 0.8) * 0.005))}
                  </p>
                  <p className="text-xs text-gray-500">Principal and interest only, based on 30-year fixed rate mortgage at 6% interest.</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Get Pre-Approved
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
