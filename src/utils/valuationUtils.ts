
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
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Handle CORS issues
      body: JSON.stringify({
        propertyDetails: property,
        timestamp: new Date().toISOString(),
        source: window.location.origin
      }),
    });
    
    // Since we're using no-cors, we can't access the response status
    console.log("Webhook triggered successfully");
    
    toast({
      title: "Notification Sent",
      description: "The valuation request has been sent to our system.",
    });
  } catch (error) {
    console.error("Error triggering webhook:", error);
    
    toast({
      title: "Notification Error",
      description: "There was an issue sending the valuation notification.",
      variant: "destructive"
    });
  }
}

// This function would ideally call a backend API or service
// For demo purposes, we're using a more sophisticated but still simulated algorithm
export async function calculatePropertyValuation(property: PropertyDetails): Promise<ValuationResult> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Base value calculation based on location and size
        const basePricePerSqFt = getBasePricePerSqft(property.city, property.zip, property.propertyType);
        let baseValue = property.sqft * basePricePerSqFt;
        
        // Adjustments based on property details
        const conditionAdjustment = getConditionAdjustment(property.propertyCondition);
        const featuresAdjustment = getFeaturesAdjustment(property);
        const locationAdjustment = getLocationAdjustment(property.city, property.isCornerLot);
        
        // Calculate final value
        const estimatedValue = Math.round(
          baseValue + 
          conditionAdjustment +
          featuresAdjustment +
          locationAdjustment
        );
        
        // Create a reasonable value range (typically ±5-8%)
        const variabilityFactor = 0.08; // 8% variability
        const valueLow = Math.round(estimatedValue * (1 - variabilityFactor));
        const valueHigh = Math.round(estimatedValue * (1 + variabilityFactor));
        
        // Final result
        resolve({
          estimatedValue: estimatedValue,
          valueRange: {
            low: valueLow,
            high: valueHigh
          },
          comparableHomes: Math.floor(Math.random() * 8) + 3, // 3-10 comparable properties
          confidenceScore: Math.floor(Math.random() * 16) + 70, // 70-85% confidence score
          pricePerSqFt: Math.round(estimatedValue / property.sqft),
          marketTrends: {
            annualGrowth: parseFloat((Math.random() * 5 + 2).toFixed(1)), // 2-7% annual growth for commercial
            averageDaysOnMarket: Math.floor(Math.random() * 30) + 60, // 60-90 days on market (commercial takes longer)
            listToSaleRatio: parseFloat((Math.random() * 0.05 + 0.92).toFixed(2)) // 92-97% list to sale ratio
          }
        });
      } catch (error) {
        console.error("Error calculating valuation:", error);
        toast({
          title: "Valuation Error",
          description: "There was an error calculating your property's value. Please try again.",
          variant: "destructive"
        });
        
        // Return default values in case of error
        resolve({
          estimatedValue: 0,
          valueRange: { low: 0, high: 0 },
          comparableHomes: 0,
          confidenceScore: 0,
          pricePerSqFt: 0,
          marketTrends: {
            annualGrowth: 0,
            averageDaysOnMarket: 0,
            listToSaleRatio: 0
          }
        });
      }
    }, 1500); // Simulate API delay
  });
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
