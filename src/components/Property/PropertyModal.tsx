
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  const { data: propertyDetails, isLoading } = useQuery({
    queryKey: ['propertyDetails', property?.id],
    queryFn: async () => {
      if (!property?.id) return null;
      
      const { data, error } = await supabase
        .from('property_details')
        .select('*')
        .eq('property_id', property.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching property details:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!property?.id && isOpen,
  });

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background text-foreground border-0">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left side (3/5) - Details */}
          <div className="col-span-3 p-0">
            <ScrollArea className="h-[80vh] md:h-[90vh]">
              <div className="p-6">
                {/* Header with price and address */}
                <div className="mb-6">
                  <h2 className="text-4xl font-bold text-primary dark:text-estate-dark-blue">{formatCurrency(property.price)}</h2>
                  <p className="text-xl mt-2">
                    {property.address.street}, {property.address.city} {property.address.state}, {property.address.zipCode} USA
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline" className="bg-background text-primary border-primary">
                      {property.propertyType}
                    </Badge>
                    {property.status === "For Sale" && (
                      <Badge className="bg-background border-primary text-primary">
                        {property.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* MLS Section */}
                {property.mls && (
                  <div className="mb-6 text-right">
                    <div className="bg-secondary inline-block p-3 rounded">
                      <p className="text-sm text-muted-foreground">MLS</p>
                      <p className="text-lg">{property.mls}</p>
                    </div>
                  </div>
                )}

                {/* Property Overview Section */}
                <div className="mb-6 bg-secondary p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                        <span className="text-primary">ⓘ</span>
                      </div>
                      <h3 className="text-xl font-semibold text-primary">Property Overview</h3>
                    </div>
                    
                    {propertyDetails?.virtualtour && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-1 border-primary text-primary"
                        asChild
                      >
                        <a 
                          href={propertyDetails.virtualtour} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={14} />
                          Open Virtual Tour
                        </a>
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

                {/* Description Section */}
                <div className="mb-6 bg-secondary p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                      <span className="text-primary">ⓘ</span>
                    </div>
                    <h3 className="text-xl font-semibold text-primary">Description</h3>
                  </div>
                  <p className="ml-10 text-foreground whitespace-pre-line">
                    {propertyDetails?.remarks || property.description}
                  </p>
                </div>

                {/* Location Section */}
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
                      {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                    </p>
                  </div>
                </div>

                {/* Additional Listing Info */}
                {propertyDetails?.listingby && (
                  <div className="text-muted-foreground mt-6 ml-10">
                    <p>Listed by: {propertyDetails.listingby}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Right side (2/5) - Image */}
          <div className="col-span-2 h-full">
            <div className="h-full">
              <img 
                src={property.images[0]} 
                alt={property.address.street}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal;
