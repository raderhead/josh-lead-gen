
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

// Import our new components
import PropertyShowingRequestForm from './PropertyShowingRequestForm';
import VirtualTourViewer from './VirtualTourViewer';
import PropertyOverviewSection from './PropertyOverviewSection';
import PropertyDescriptionSection from './PropertyDescriptionSection';
import PropertyLocationSection from './PropertyLocationSection';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [showingDialogOpen, setShowingDialogOpen] = useState(false);
  const { user } = useUser();
  
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

  const getVirtualTourUrl = () => {
    if (!propertyDetails?.virtualtour) return null;
    
    try {
      if (propertyDetails.virtualtour.startsWith('[')) {
        const parsed = JSON.parse(propertyDetails.virtualtour);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
      }
      return propertyDetails.virtualtour;
    } catch (error) {
      console.error('Error parsing virtual tour URL:', error);
      return null;
    }
  };

  const virtualTourUrl = getVirtualTourUrl();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background text-foreground border-0">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="col-span-3 p-0">
              <ScrollArea className="h-[80vh] md:h-[90vh]">
                <div className="p-6">
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

                  <div className="mb-6 flex justify-between items-center">
                    <Button 
                      onClick={() => setShowingDialogOpen(true)}
                      variant="showing"
                      className="gap-2"
                    >
                      <Calendar size={16} />
                      Request Showing
                    </Button>
                    
                    {property.mls && (
                      <div className="bg-secondary inline-block p-3 rounded">
                        <p className="text-sm text-muted-foreground">MLS</p>
                        <p className="text-lg">{property.mls}</p>
                      </div>
                    )}
                  </div>

                  <PropertyOverviewSection
                    propertyDetails={propertyDetails}
                    onOpenVirtualTour={() => setVirtualTourOpen(true)}
                    virtualTourUrl={virtualTourUrl}
                  />

                  <PropertyDescriptionSection
                    description={property.description}
                    remarks={propertyDetails?.remarks}
                  />

                  <PropertyLocationSection
                    street={property.address.street}
                    city={property.address.city}
                    state={property.address.state}
                    zipCode={property.address.zipCode}
                  />

                  {propertyDetails?.listingby && (
                    <div className="text-muted-foreground mt-6 ml-10">
                      <p>Listed by: {propertyDetails.listingby}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
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

      {/* Virtual Tour Viewer Component */}
      {virtualTourUrl && (
        <VirtualTourViewer
          isOpen={virtualTourOpen}
          onClose={() => setVirtualTourOpen(false)}
          virtualTourUrl={virtualTourUrl}
        />
      )}

      {/* Showing Request Form Component */}
      <PropertyShowingRequestForm
        propertyId={property.id}
        propertyAddress={`${property.address.street}, ${property.address.city}`}
        propertyPrice={property.price}
        isOpen={showingDialogOpen}
        onClose={() => setShowingDialogOpen(false)}
      />
    </>
  );
};

export default PropertyModal;
