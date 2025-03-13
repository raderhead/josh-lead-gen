
import { Link } from 'react-router-dom';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bath, Bed, Home, MapPin, Square } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="overflow-hidden property-card h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={property.images[0]} 
            alt={`${property.address.street}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-estate-blue hover:bg-estate-blue">
              {property.status}
            </Badge>
          </div>
          {property.isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-estate-yellow text-black hover:bg-estate-yellow hover:text-black">
                Featured
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-estate-dark-blue mb-1 truncate">
            {property.address.street}
          </h3>
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.address.city}, {property.address.state} {property.address.zipCode}</span>
          </div>
          <p className="text-xl font-bold text-estate-blue mb-3">
            {formatCurrency(property.price)}
          </p>
          <div className="flex justify-between text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.beds} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.baths} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
