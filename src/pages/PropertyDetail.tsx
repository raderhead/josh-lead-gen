import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Bath, 
  Bed, 
  Calendar, 
  Car, 
  Heart,
  Home, 
  MapPin, 
  Ruler, 
  Share2,
  User as UserIcon,
  ExternalLink
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
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";

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

interface ShowingRequest {
  propertyId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const property = properties.find((p) => p.id === id);
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavoriteStatus, setCheckingFavoriteStatus] = useState(true);
  const { user } = useUser();
  const [showingDate, setShowingDate] = useState("");
  const [showingTime, setShowingTime] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showingDialogOpen, setShowingDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: propertyDetails } = useQuery({
    queryKey: ['propertyDetails', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('property_details')
        .select('*')
        .eq('property_id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching property details:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!id,
  });

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

  useEffect(() => {
    if (!property || !user) {
      setCheckingFavoriteStatus(false);
      return;
    }
    
    const checkFavoriteStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('property_id', property.id)
          .maybeSingle()
          .returns<any>();

        if (error) {
          console.error("Error checking favorite status:", error);
          return;
        }

        setIsFavorite(!!data);
      } catch (err) {
        console.error("Exception checking favorite status:", err);
      } finally {
        setCheckingFavoriteStatus(false);
      }
    };
    
    checkFavoriteStatus();
  }, [property, user]);

  if (!property) {
    return <div>Property not found</div>;
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save properties to your favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorite) {
        // Find the saved property record first
        const { data: savedProperty, error: findError } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('property_id', property.id)
          .maybeSingle()
          .returns<any>();
          
        if (findError) {
          throw findError;
        }
        
        if (savedProperty) {
          // Remove from favorites
          const { error: deleteError } = await supabase
            .from('saved_properties')
            .delete()
            .eq('id', savedProperty.id)
            .returns<any>();
            
          if (deleteError) {
            throw deleteError;
          }
          
          setIsFavorite(false);
          toast({
            title: "Property removed from favorites",
            description: "You can add it back anytime.",
          });
        }
      } else {
        // Add to favorites
        const propertyToSave = {
          property_id: property.id,
          property_data: {
            address: `${property.address.street}, ${property.address.city}`,
            price: property.price,
            image: property.images[0],
          },
          user_id: user.id
        };
        
        const { error: insertError } = await supabase
          .from('saved_properties')
          .insert(propertyToSave)
          .returns<any>();
          
        if (insertError) {
          throw insertError;
        }
        
        setIsFavorite(true);
        toast({
          title: "Property saved to favorites",
          description: "You can view all your saved properties in your dashboard.",
        });
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem updating your favorites",
        variant: "destructive"
      });
    }
  };

  const handleRequestShowing = async () => {
    if (!contactName || !contactEmail || !showingDate || !showingTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const showingRequest: ShowingRequest = {
      propertyId: property!.id,
      date: showingDate,
      time: showingTime,
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      message: message
    };

    try {
      const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/42172b32-2eaf-48e9-a912-9229f59e21be";
      
      const queryParams = new URLSearchParams({
        propertyId: showingRequest.propertyId,
        propertyAddress: `${property!.address.street}, ${property!.address.city}`,
        propertyPrice: property!.price.toString(),
        date: showingRequest.date,
        time: showingRequest.time,
        name: showingRequest.name,
        email: showingRequest.email,
        phone: showingRequest.phone || '',
        message: showingRequest.message || ''
      }).toString();
      
      const response = await fetch(`${webhookUrl}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
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
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setMessage("");
    } catch (error) {
      console.error("Error sending showing request to webhook:", error);
      toast({
        title: "Error sending request",
        description: "There was a problem submitting your showing request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold">{property.address.street}, {property.address.city}</h1>
                <p className="text-gray-500">{property.address.neighborhood}</p>
              </div>
              <Button 
                variant={isFavorite ? "default" : "outline"} 
                size="icon" 
                onClick={toggleFavorite}
                disabled={checkingFavoriteStatus}
                className={isFavorite ? "bg-rose-500 hover:bg-rose-600" : ""}
              >
                {checkingFavoriteStatus ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Heart className={isFavorite ? "fill-white" : ""} />
                )}
              </Button>
            </div>
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
            <div className="mt-6 flex flex-wrap gap-2">
              {virtualTourUrl && (
                <Button asChild>
                  <a href={virtualTourUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Virtual Tour
                  </a>
                </Button>
              )}
              
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
                    <Button 
                      type="submit" 
                      onClick={handleRequestShowing}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          </span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
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
