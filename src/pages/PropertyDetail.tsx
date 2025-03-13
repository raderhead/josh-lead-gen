
import React from "react";
import { useParams } from "react-router-dom";
import { 
  Bath, 
  Bed, 
  Calendar, 
  Car, 
  Home, 
  MapPin, 
  Ruler, 
  Share2,
  User as UserIcon
} from "lucide-react";
import { 
  Carousel,
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Layout from "@/components/Layout/Layout";
import { properties } from "@/data/properties";
import { formatCurrency } from "@/lib/utils";

// Create a custom Pool icon since it's not available in lucide-react
const Pool = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12.5h20"></path>
    <path d="M2 8.5c4-1 4 3 8 3s4-4 8-3"></path>
    <path d="M2 16.5c4-1 4 3 8 3s4-4 8-3"></path>
    <path d="M22 12.5v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"></path>
  </svg>
);

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="object-cover rounded-md"
                        />
                      </AspectRatio>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Property Details */}
          <div>
            <h1 className="text-2xl font-semibold">{property.address.street}, {property.address.city}</h1>
            <p className="text-gray-500">{property.address.neighborhood}</p>
            <div className="mt-4 flex items-center space-x-3">
              <Bed className="h-5 w-5" />
              <span>{property.beds} Beds</span>
              <Bath className="h-5 w-5" />
              <span>{property.baths} Baths</span>
              <Ruler className="h-5 w-5" />
              <span>{property.sqft} SqFt</span>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Price: {formatCurrency(property.price)}</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Features</h2>
              <ul className="list-disc pl-5">
                {property.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Property Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Home className="h-5 w-5" />
                  <span>Type: {property.propertyType}</span>
                </div>
                <div>
                  <Calendar className="h-5 w-5" />
                  <span>Built: {property.yearBuilt}</span>
                </div>
                <div>
                  <MapPin className="h-5 w-5" />
                  <span>Lot Size: {property.lotSize} SqFt</span>
                </div>
                <div>
                  {property.hasPool && <Pool className="h-5 w-5" />}
                  <span>Pool: {property.hasPool ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  {property.hasGarage && <Car className="h-5 w-5" />}
                  <span>Garage: {property.hasGarage ? 'Yes' : 'No'} ({property.garageSpaces} spaces)</span>
                </div>
                <div>
                  <UserIcon className="h-5 w-5" />
                  <span>Agent: {property.agent.name}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild>
                <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer">
                  Virtual Tour
                </a>
              </Button>
              <Button variant="secondary">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
