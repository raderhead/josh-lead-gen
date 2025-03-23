
import { toast } from "@/components/ui/use-toast";

export interface PropertyDetails {
  address: string;
  city: string;
  state: string;
  zip: string;
  sqft: number;
  propertyType: string;
  propertyCondition: string;
  isCornerLot: boolean;
  hasParkingLot: boolean;
  hasLoadingDock: boolean;
  recentRenovations: boolean;
}

// Function to trigger the webhook with property details
export async function triggerValuationWebhook(property: PropertyDetails): Promise<void> {
  const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/1b0f7b13-ae37-436b-8aae-fb9ed0a07b32";
  
  try {
    // Send the property details as JSON in the request body
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(property)
    });
    
    console.log("Webhook response:", response);
    console.log("Property details sent:", property);
    
    if (response.ok) {
      console.log("Webhook triggered successfully");
      toast({
        title: "Notification Sent",
        description: "Your valuation request has been received. A real estate agent will contact you shortly with the results.",
      });
    } else {
      throw new Error(`Failed to trigger webhook: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error triggering webhook:", error);
    
    toast({
      title: "Notification Error",
      description: "There was an issue sending the valuation notification. Please try again later.",
      variant: "destructive"
    });
  }
}
