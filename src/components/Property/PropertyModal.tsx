
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ExternalLink, X, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [showingDialogOpen, setShowingDialogOpen] = useState(false);
  const [showingDate, setShowingDate] = useState("");
  const [showingTime, setShowingTime] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const { toast } = useToast();
  
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

  // Initialize form fields with user data when component mounts or user changes
  React.useEffect(() => {
    if (user) {
      setContactName(user.name || '');
      setContactEmail(user.email || '');
      setContactPhone(user.phone || '');
    }
  }, [user]);

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

  // Handle closing the virtual tour properly
  const handleCloseVirtualTour = () => {
    setVirtualTourOpen(false);
  };

  const handleRequestShowing = () => {
    if (!contactName || !contactEmail || !showingDate || !showingTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const showingRequest = {
      propertyId: property.id,
      propertyAddress: `${property.address.street}, ${property.address.city}`,
      propertyPrice: property.price,
      date: showingDate,
      time: showingTime,
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      message: message
    };

    const showingRequests = JSON.parse(
      localStorage.getItem("showingRequests") || "[]"
    );
    localStorage.setItem("showingRequests", JSON.stringify([...showingRequests, showingRequest]));

    toast({
      title: "Showing request sent",
      description: `An agent will contact you soon to confirm your showing on ${showingDate} at ${showingTime}.`,
    });

    setShowingDialogOpen(false);
    setShowingDate("");
    setShowingTime("");
    setMessage("");
  };

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
                          onClick={() => setVirtualTourOpen(true)}
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

      {/* Virtual Tour Sheet */}
      {virtualTourUrl && (
        <Sheet open={virtualTourOpen} onOpenChange={setVirtualTourOpen}>
          <SheetContent side="bottom" className="p-0 h-[90vh] max-w-full border-t-0 rounded-t-lg">
            <div className="relative w-full h-full pt-10">
              <div className="absolute top-2 right-4 z-50">
                <Button 
                  onClick={handleCloseVirtualTour}
                  variant="outline"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <iframe 
                src={virtualTourUrl} 
                title="Virtual Tour"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Request Showing Dialog */}
      <Dialog open={showingDialogOpen} onOpenChange={setShowingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request a Showing</DialogTitle>
            <DialogDescription>
              Fill out the form below to schedule a showing of this property.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name*
                </label>
                <input
                  id="name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="date" className="text-sm font-medium">
                  Preferred Date*
                </label>
                <input
                  id="date"
                  type="date"
                  value={showingDate}
                  onChange={(e) => setShowingDate(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="time" className="text-sm font-medium">
                  Preferred Time*
                </label>
                <input
                  id="time"
                  type="time"
                  value={showingTime}
                  onChange={(e) => setShowingTime(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full mt-1"
                  placeholder="Add any additional information or questions..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleRequestShowing}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyModal;
