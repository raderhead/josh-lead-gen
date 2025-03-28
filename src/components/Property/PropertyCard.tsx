
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types/property";
import PropertyModal from "./PropertyModal";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div 
        className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-1"
        onClick={openModal}
      >
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <img
              src={property.images[0]}
              alt={property.address.street}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          {property.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-[#F0C66A] text-black font-semibold">
              Featured
            </Badge>
          )}
          {property.propertyType && (
            <Badge className="absolute top-2 left-2 bg-black bg-opacity-70 text-white">
              {property.propertyType}
            </Badge>
          )}
        </div>

        <div className="bg-black text-white p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-3xl font-bold text-[#F0C66A]">
              {formatCurrency(property.price)}
            </h3>
            {property.mls && (
              <div className="text-right">
                <span className="text-xs text-gray-400">MLS</span>
                <p className="text-sm">{property.mls}</p>
              </div>
            )}
          </div>
          
          <p className="text-lg">{property.address.street}</p>
          <p className="text-gray-400">
            {property.address.city} {property.address.state}, {property.address.zipCode} USA
          </p>
        </div>
      </div>
      
      <PropertyModal 
        property={property} 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />
    </>
  );
};

export default PropertyCard;
