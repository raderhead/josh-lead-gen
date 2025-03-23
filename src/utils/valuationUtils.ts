
import { toast } from "@/hooks/use-toast";

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
  acres?: string;
}

// Function to trigger the webhook with property details
export async function triggerValuationWebhook(property: PropertyDetails): Promise<void> {
  const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/1b0f7b13-ae37-436b-8aae-fb9ed0a07b32";
  
  try {
    // Create a new object for the webhook data
    const webhookData: Record<string, string | number> = {
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zip,
      sqft: property.sqft,
      propertyType: property.propertyType,
      propertyCondition: property.propertyCondition,
    };
    
    // Add acres if provided (for Land properties)
    if (property.acres) {
      webhookData.acres = property.acres;
    }
    
    // Only add the feature if it's true, and use descriptive names
    if (property.isCornerLot) {
      webhookData.features = "Corner Lot";
    }
    
    if (property.hasParkingLot) {
      // If features already exists, append to it, otherwise create it
      if (webhookData.features) {
        webhookData.features = `${webhookData.features}, Parking Lot`;
      } else {
        webhookData.features = "Parking Lot";
      }
    }
    
    if (property.hasLoadingDock) {
      if (webhookData.features) {
        webhookData.features = `${webhookData.features}, Loading Dock`;
      } else {
        webhookData.features = "Loading Dock";
      }
    }
    
    if (property.recentRenovations) {
      if (webhookData.features) {
        webhookData.features = `${webhookData.features}, Recent Renovations`;
      } else {
        webhookData.features = "Recent Renovations";
      }
    }
    
    // Send the modified property details as JSON in the request body
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookData)
    });
    
    console.log("Webhook response:", response);
    console.log("Property details sent:", webhookData);
    
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
