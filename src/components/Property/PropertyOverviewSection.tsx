
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface PropertyOverviewSectionProps {
  propertyDetails: any; // Adjust this type as needed
  onOpenVirtualTour: () => void;
  virtualTourUrl: string | null;
}

const PropertyOverviewSection: React.FC<PropertyOverviewSectionProps> = ({
  propertyDetails,
  onOpenVirtualTour,
  virtualTourUrl,
}) => {
  return (
    <div className="mb-6 bg-secondary p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
            <span className="text-primary">ⓘ</span>
          </div>
          <h3 className="text-xl font-semibold text-primary">Property Overview</h3>
        </div>
        
        {virtualTourUrl && (
          <Button 
            size="sm" 
            variant="outline"
            className="gap-1 border-primary text-primary"
            onClick={onOpenVirtualTour}
          >
            <ExternalLink size={14} />
            Open Virtual Tour
          </Button>
        )}
      </div>
      
      {propertyDetails?.landsize && (
        <div className="flex items-center gap-3 ml-10 mb-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-primary">📏</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Land Size</p>
            <p>{propertyDetails.landsize}</p>
          </div>
        </div>
      )}
      
      {propertyDetails?.propertysize && (
        <div className="flex items-center gap-3 ml-10">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-primary">🏠</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Property Size</p>
            <p>{propertyDetails.propertysize}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyOverviewSection;
