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

export interface ValuationResult {
  estimatedValue: number;
  valueRange: {
    low: number;
    high: number;
  };
  comparableHomes: number;
  confidenceScore: number;
  pricePerSqFt: number;
  marketTrends: {
    annualGrowth: number;
    averageDaysOnMarket: number;
    listToSaleRatio: number;
  };
}

// Function to trigger the webhook with property details
export async function triggerValuationWebhook(property: PropertyDetails): Promise<void> {
  const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/1b0f7b13-ae37-436b-8aae-fb9ed0a07b32";
  
  try {
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    console.log("Webhook response:", response);
    
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

// Helper functions for valuation calculation
function getBasePricePerSqft(city: string, zip: string, propertyType: string): number {
  // Base prices by city - for commercial properties
  const basePrices: Record<string, number> = {
    'Abilene': 85,
    'Dallas': 180,
    'Austin': 250,
    'Houston': 160,
    'San Antonio': 120,
    'Fort Worth': 150,
    'El Paso': 90,
    'Arlington': 130,
    'Corpus Christi': 95,
    'Plano': 170
  };
  
  // Property type multipliers
  const typeMultipliers: Record<string, number> = {
    'Office': 1.3,
    'Retail': 1.2,
    'Industrial': 0.8,
    'Mixed-Use': 1.1,
    'Warehouse': 0.7,
    'Restaurant': 1.4,
    'Medical': 1.5,
    'Hotel/Motel': 1.2,
    'Land': 0.5,
    'Other': 1.0
  };
  
  // Default price if city not found
  const defaultPrice = 100;
  
  // ZIP code premium/discount (would be data-driven in real app)
  const zipPremium = parseInt(zip.substring(0, 2)) % 10 * 5;
  
  const basePrice = basePrices[city] || defaultPrice;
  const typeMultiplier = typeMultipliers[propertyType] || 1.0;
  
  return (basePrice + zipPremium) * typeMultiplier;
}

function getConditionAdjustment(condition: string): number {
  // Condition significantly impacts value
  const conditionValues: Record<string, number> = {
    'Excellent': 100000,
    'Good': 50000,
    'Average': 0,
    'Fair': -50000,
    'Poor': -100000
  };
  
  return conditionValues[condition] || 0;
}

function getFeaturesAdjustment(property: PropertyDetails): number {
  let adjustment = 0;
  
  if (property.hasParkingLot) adjustment += 75000;
  if (property.hasLoadingDock) adjustment += 50000;
  if (property.recentRenovations) adjustment += 100000;
  
  return adjustment;
}

function getLocationAdjustment(city: string, isCornerLot: boolean): number {
  // Premium cities get higher adjustments
  const premiumCities = ['Dallas', 'Austin', 'Houston'];
  const isPremiumCity = premiumCities.includes(city);
  
  let adjustment = 0;
  
  // Corner lots are typically more valuable for commercial properties
  if (isCornerLot) {
    adjustment += isPremiumCity ? 150000 : 100000;
  }
  
  return adjustment;
}
