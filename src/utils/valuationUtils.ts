
import { toast } from "@/hooks/use-toast";

export interface PropertyDetails {
  // Contact information (new required fields)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Property details
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
  // Land-specific features (optional)
  hasWater?: boolean;
  hasRoad?: boolean;
  isLevelLot?: boolean;
  hasMountainView?: boolean;
}

export const triggerValuationWebhook = async (propertyDetails: PropertyDetails) => {
  console.log("Sending property details to webhook:", propertyDetails);
  
  try {
    // Format features based on property type
    let features = [];
    
    if (propertyDetails.propertyType === 'Land') {
      if (propertyDetails.hasWater) features.push('Water Access');
      if (propertyDetails.hasRoad) features.push('Road Access');
      if (propertyDetails.isLevelLot) features.push('Level Lot');
      if (propertyDetails.hasMountainView) features.push('Mountain View');
    } else {
      if (propertyDetails.isCornerLot) features.push('Corner Lot');
      if (propertyDetails.hasParkingLot) features.push('Parking Lot');
      if (propertyDetails.hasLoadingDock) features.push('Loading Dock');
      if (propertyDetails.recentRenovations) features.push('Recent Renovations');
    }
    
    // Prepare webhook data
    const webhookData = {
      // Contact information
      firstName: propertyDetails.firstName,
      lastName: propertyDetails.lastName,
      email: propertyDetails.email,
      phone: propertyDetails.phone,
      // Property details
      address: propertyDetails.address,
      city: propertyDetails.city,
      state: propertyDetails.state,
      zip: propertyDetails.zip,
      propertyType: propertyDetails.propertyType,
      propertyCondition: propertyDetails.propertyCondition,
      fullName: `${propertyDetails.firstName} ${propertyDetails.lastName}`
    };
    
    // Add conditional fields
    if (propertyDetails.propertyType === 'Land' && propertyDetails.acres) {
      Object.assign(webhookData, { acres: propertyDetails.acres });
    } else if (propertyDetails.sqft > 0) {
      Object.assign(webhookData, { squareFeet: propertyDetails.sqft });
    }
    
    // Add features if present
    if (features.length > 0) {
      Object.assign(webhookData, { features: features.join(', ') });
    }
    
    console.log("Prepared webhook data:", webhookData);
    
    // Use the specific webhook URL provided
    const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/1b0f7b13-ae37-436b-8aae-fb9ed0a07b32";
    
    // Make actual HTTP request to the webhook URL
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.text();
    console.log("Webhook response:", responseData);
    
    toast({
      title: "Valuation Request Submitted",
      description: "Your property valuation request has been successfully submitted.",
    });
    
    return true;
    
  } catch (error) {
    console.error("Error triggering webhook:", error);
    throw new Error("Failed to submit valuation request");
  }
};
