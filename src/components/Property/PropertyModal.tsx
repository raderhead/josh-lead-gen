
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black text-white border-0">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left side (3/5) - Details */}
          <div className="col-span-3 p-0">
            <ScrollArea className="h-[80vh] md:h-[90vh]">
              <div className="p-6">
                {/* Header with price and address */}
                <div className="mb-6">
                  <h2 className="text-4xl font-bold text-[#F0C66A]">{formatCurrency(property.price)}</h2>
                  <p className="text-xl mt-2">
                    {property.address.street}, {property.address.city} {property.address.state}, {property.address.zipCode} USA
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline" className="bg-[#33292B] text-[#F0C66A] border-[#F0C66A]">
                      {property.propertyType}
                    </Badge>
                    {property.status === "For Sale" && (
                      <Badge className="bg-[#33292B] border-[#F0C66A] text-[#F0C66A]">
                        {property.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* MLS Section */}
                {propertyDetails?.mls && (
                  <div className="mb-6 text-right">
                    <div className="bg-[#222] inline-block p-3 rounded">
                      <p className="text-sm text-gray-400">MLS</p>
                      <p className="text-lg">{propertyDetails.mls}</p>
                    </div>
                  </div>
                )}

                {/* Property Overview Section */}
                <div className="mb-6 bg-[#111] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
                      <span className="text-[#F0C66A]">ⓘ</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#F0C66A]">Property Overview</h3>
                  </div>
                  
                  {propertyDetails?.landsize && (
                    <div className="flex items-center gap-3 ml-10 mb-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <span className="text-[#F0C66A]">📏</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Land Size</p>
                        <p>{propertyDetails.landsize}</p>
                      </div>
                    </div>
                  )}
                  
                  {propertyDetails?.propertysize && (
                    <div className="flex items-center gap-3 ml-10">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <span className="text-[#F0C66A]">🏠</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Property Size</p>
                        <p>{propertyDetails.propertysize}</p>
                      </div>
                    </div>
                  )}
                  
                  {propertyDetails?.virtualtour && (
                    <div className="mt-4 ml-10">
                      <a 
                        href={propertyDetails.virtualtour} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#F0C66A] text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
                      >
                        <ExternalLink size={16} />
                        Open Virtual Tour
                      </a>
                    </div>
                  )}
                </div>

                {/* Description Section */}
                <div className="mb-6 bg-[#111] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
                      <span className="text-[#F0C66A]">ⓘ</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#F0C66A]">Description</h3>
                  </div>
                  <p className="ml-10 text-gray-300 whitespace-pre-line">
                    {propertyDetails?.remarks || property.description}
                  </p>
                </div>

                {/* Location Section */}
                <div className="mb-6 bg-[#111] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
                      <span className="text-[#F0C66A]">📍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#F0C66A]">Location</h3>
                  </div>
                  <div className="ml-10">
                    <p className="flex items-center text-gray-300">
                      <MapPin className="mr-2 text-[#F0C66A]" size={16} />
                      {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                    </p>
                  </div>
                </div>

                {/* Additional Listing Info */}
                {propertyDetails?.listingby && (
                  <div className="text-gray-400 mt-6 ml-10">
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
