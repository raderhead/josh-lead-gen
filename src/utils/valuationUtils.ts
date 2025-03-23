
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
  hasWater?: boolean;
  hasRoad?: boolean;
  isLevelLot?: boolean;
  hasMountainView?: boolean;
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
      propertyType: property.propertyType,
      propertyCondition: property.propertyCondition,
    };
    
    // Only add sqft if it's not a Land property or if sqft is greater than 0
    if (property.propertyType !== "Land" && property.sqft > 0) {
      webhookData.sqft = property.sqft;
    }
    
    // Add acres if provided (for Land properties)
    if (property.acres) {
      webhookData.acres = property.acres;
    }
    
    // Initialize features array to collect all true features
    const features: string[] = [];
    
    // Add commercial property features if true
    if (property.isCornerLot) {
      features.push("Corner Lot");
    }
    
    if (property.hasParkingLot) {
      features.push("Parking Lot");
    }
    
    if (property.hasLoadingDock) {
      features.push("Loading Dock");
    }
    
    if (property.recentRenovations) {
      features.push("Recent Renovations");
    }
    
    // Add land-specific features if true
    if (property.hasWater) {
      features.push("Water Access");
    }
    
    if (property.hasRoad) {
      features.push("Road Access");
    }
    
    if (property.isLevelLot) {
      features.push("Level Lot");
    }
    
    if (property.hasMountainView) {
      features.push("Mountain View");
    }
    
    // Only add features to webhook data if there are any
    if (features.length > 0) {
      webhookData.features = features.join(", ");
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
