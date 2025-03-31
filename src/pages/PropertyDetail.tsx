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

interface SavedProperty {
  id: string;
  address: string;
  price: number;
  image: string;
  savedAt: string;
}

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
  const [showingDate, setShowingDate] = useState("");
  const [showingTime, setShowingTime] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showingDialogOpen, setShowingDialogOpen] = useState(false);

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
    if (!property) return;
    
    const savedProperties = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    const isAlreadySaved = savedProperties.some((p: SavedProperty) => p.id === property.id);
    setIsFavorite(isAlreadySaved);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "savedProperties") {
        const updatedProperties = JSON.parse(localStorage.getItem("savedProperties") || "[]");
        setIsFavorite(updatedProperties.some((p: SavedProperty) => p.id === property.id));
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [property]);

  if (!property) {
    return <div>Property not found</div>;
  }

  const toggleFavorite = () => {
    const savedProperties: SavedProperty[] = JSON.parse(
      localStorage.getItem("savedProperties") || "[]"
    );

    if (isFavorite) {
      const updatedProperties = savedProperties.filter(
        (p: SavedProperty) => p.id !== property.id
      );
      localStorage.setItem("savedProperties", JSON.stringify(updatedProperties));
      setIsFavorite(false);
      toast({
        title: "Property removed from favorites",
        description: "You can add it back anytime.",
      });
    } else {
      const propertyToSave: SavedProperty = {
        id: property.id,
        address: `${property.address.street}, ${property.address.city}`,
        price: property.price,
        image: property.images[0],
        savedAt: new Date().toISOString(),
      };
      
      const updatedProperties = [...savedProperties, propertyToSave];
      localStorage.setItem("savedProperties", JSON.stringify(updatedProperties));
      setIsFavorite(true);
      toast({
        title: "Property saved to favorites",
        description: "You can view all your saved properties in your dashboard.",
      });
    }
    
    window.dispatchEvent(new Event("storage"));
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

    const showingRequest: ShowingRequest = {
      propertyId: property.id,
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
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setMessage("");
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
                className={isFavorite ? "bg-rose-500 hover:bg-rose-600" : ""}
              >
                <Heart className={isFavorite ? "fill-white" : ""} />
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
                <DialogTrigger asChild>
                  <Button variant="default">Request Showing</Button>
                </DialogTrigger>
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
