
import { toast } from "@/hooks/use-toast";

export interface PropertyDetails {
  // Contact information (new required fields)
  name: string;
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
      name: propertyDetails.name,
      email: propertyDetails.email,
      phone: propertyDetails.phone,
      // Property details
      address: propertyDetails.address,
      city: propertyDetails.city,
      state: propertyDetails.state,
      zip: propertyDetails.zip,
      propertyType: propertyDetails.propertyType,
      propertyCondition: propertyDetails.propertyCondition,
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
    
    // In a real application, you would send this data to your backend
    // For demonstration, we'll simulate a successful API call
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log success - in a real app this would be an actual API call
    console.log("Webhook response status: 200");
    console.log("Webhook triggered successfully");
    
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
