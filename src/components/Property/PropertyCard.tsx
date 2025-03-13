import React from "react";
import { Link } from "react-router-dom";
import { Bath, Bed, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Card className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/property/${property.id}`}>
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <img
              src={property.images[0]}
              alt={property.address.street}
              className="rounded-md object-cover"
            />
          </AspectRatio>
          {property.status === "For Sale" && (
            <Badge className="absolute top-2 left-2 bg-estate-blue text-white">
              For Sale
            </Badge>
          )}
          {property.status === "Sold" && (
            <Badge className="absolute top-2 left-2 bg-estate-green text-white">
              Sold
            </Badge>
          )}
          {property.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-estate-yellow text-gray-800">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{property.address.street}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            <MapPin className="mr-1 inline-block h-4 w-4" />
            {property.address.city}, {property.address.state} {property.address.zipCode}
          </p>
          <div className="mt-2 flex items-center space-x-2 text-sm">
            <span>
              <Bed className="mr-1 inline-block h-4 w-4" />
              {property.beds} Beds
            </span>
            <span>
              <Bath className="mr-1 inline-block h-4 w-4" />
              {property.baths} Baths
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4">
          <span className="text-lg font-bold">{formatCurrency(property.price)}</span>
          {property.propertyType && (
            <Badge variant="secondary">{property.propertyType}</Badge>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PropertyCard;
