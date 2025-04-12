
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface PropertyShowingRequestFormProps {
  propertyId: string;
  propertyAddress: string;
  propertyPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyShowingRequestForm: React.FC<PropertyShowingRequestFormProps> = ({
  propertyId,
  propertyAddress,
  propertyPrice,
  isOpen,
  onClose,
}) => {
  const [showingDate, setShowingDate] = React.useState("");
  const [showingTime, setShowingTime] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  // Initialize form fields with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setContactName(user.name || '');
      setContactEmail(user.email || '');
      setContactPhone(user.phone || '');
    }
  }, [user]);

  // Parse address into components
  const parseAddress = (fullAddress: string) => {
    // More robust parsing to separate address from city
    const commaIndex = fullAddress.indexOf(',');
    
    // If there's no comma, assume the whole string is the address
    if (commaIndex === -1) {
      return { 
        address: fullAddress.trim(), 
        city: '' 
      };
    }
    
    // Extract address (everything before first comma)
    const address = fullAddress.substring(0, commaIndex).trim();
    
    // Extract city (everything after the first comma)
    const cityAndState = fullAddress.substring(commaIndex + 1).trim();
    
    // Extract just the city name (before any additional commas or the state)
    const cityEndIndex = cityAndState.indexOf(',');
    const spaceBeforeStateIndex = cityAndState.lastIndexOf(' ');
    
    let city;
    if (cityEndIndex !== -1) {
      // If there's another comma, take everything before it
      city = cityAndState.substring(0, cityEndIndex).trim();
    } else if (spaceBeforeStateIndex !== -1) {
      // If there's no second comma but there's a space (likely before state)
      city = cityAndState.substring(0, spaceBeforeStateIndex).trim();
    } else {
      // If there's no clear delimiter, use the whole string
      city = cityAndState;
    }
    
    return { address, city };
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

    // Parse the address into address and city
    const { address, city } = parseAddress(propertyAddress);

    const showingRequest = {
      propertyId,
      propertyStreet: address,
      propertyCity: city,
      propertyPrice,
      date: showingDate,
      time: showingTime,
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      message: message
    };

    try {
      // Call the webhook with showing request data
      const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook/42172b32-2eaf-48e9-a912-9229f59e21be";
      
      // Since it's a GET request, we'll encode the data in the URL
      const queryParams = new URLSearchParams({
        propertyId: showingRequest.propertyId,
        propertyStreet: showingRequest.propertyStreet,
        propertyCity: showingRequest.propertyCity,
        propertyPrice: showingRequest.propertyPrice.toString(),
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
      
      // Store in local storage for backwards compatibility
      const showingRequests = JSON.parse(
        localStorage.getItem("showingRequests") || "[]"
      );
      localStorage.setItem("showingRequests", JSON.stringify([...showingRequests, showingRequest]));

      toast({
        title: "Showing request sent",
        description: `An agent will contact you soon to confirm your showing on ${showingDate} at ${showingTime}.`,
      });

      onClose();
      setShowingDate("");
      setShowingTime("");
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
  );
};

export default PropertyShowingRequestForm;
