
import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyLocationSectionProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const PropertyLocationSection: React.FC<PropertyLocationSectionProps> = ({
  street,
  city,
  state,
  zipCode,
}) => {
  return (
    <div className="mb-6 bg-secondary p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
          <span className="text-primary">📍</span>
        </div>
        <h3 className="text-xl font-semibold text-primary">Location</h3>
      </div>
      <div className="ml-10">
        <p className="flex items-center text-foreground">
          <MapPin className="mr-2 text-primary" size={16} />
          {street}, {city}, {state} {zipCode}
        </p>
      </div>
    </div>
  );
};

export default PropertyLocationSection;
