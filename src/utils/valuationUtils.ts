
import { toast } from "@/components/ui/use-toast";

export interface PropertyDetails {
  address: string;
  city: string;
  state: string;
  zip: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize?: number;
  propertyType: string;
  propertyCondition: string;
  hasGarage: boolean;
  hasPool: boolean;
  hasBasement: boolean;
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

// This function would ideally call a backend API or service
// For demo purposes, we're using a more sophisticated but still simulated algorithm
export async function calculatePropertyValuation(property: PropertyDetails): Promise<ValuationResult> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Base value calculation based on location and size
        const basePricePerSqFt = getBasePricePerSqft(property.city, property.zip);
        let baseValue = property.sqft * basePricePerSqFt;
        
        // Adjustments based on property details
        const bedroomAdjustment = getBedroomValue(property.bedrooms, basePricePerSqFt);
        const bathroomAdjustment = getBathroomValue(property.bathrooms, basePricePerSqFt);
        const ageAdjustment = getAgeAdjustment(property.yearBuilt);
        const conditionAdjustment = getConditionAdjustment(property.propertyCondition);
        const featuresAdjustment = getFeaturesAdjustment(property);
        
        // Calculate final value
        const estimatedValue = Math.round(
          baseValue + 
          bedroomAdjustment + 
          bathroomAdjustment + 
          ageAdjustment + 
          conditionAdjustment +
          featuresAdjustment
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
          comparableHomes: Math.floor(Math.random() * 8) + 3, // 3-10 comparable homes
          confidenceScore: Math.floor(Math.random() * 16) + 70, // 70-85% confidence score
          pricePerSqFt: Math.round(estimatedValue / property.sqft),
          marketTrends: {
            annualGrowth: parseFloat((Math.random() * 7 + 3).toFixed(1)), // 3-10% annual growth
            averageDaysOnMarket: Math.floor(Math.random() * 20) + 25, // 25-45 days on market
            listToSaleRatio: parseFloat((Math.random() * 0.05 + 0.94).toFixed(2)) // 94-99% list to sale ratio
          }
        });
      } catch (error) {
        console.error("Error calculating valuation:", error);
        toast({
          title: "Valuation Error",
          description: "There was an error calculating your home's value. Please try again.",
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
function getBasePricePerSqft(city: string, zip: string): number {
  // In a real app, this would be based on actual market data by location
  const basePrices: Record<string, number> = {
    'Abilene': 135,
    'Dallas': 210,
    'Austin': 375,
    'Houston': 180,
    'San Antonio': 165,
    'Fort Worth': 190,
    'El Paso': 130,
    'Arlington': 175,
    'Corpus Christi': 155,
    'Plano': 220
  };
  
  // Default price if city not found
  const defaultPrice = 150;
  
  // ZIP code premium/discount (would be data-driven in real app)
  const zipPremium = parseInt(zip.substring(0, 2)) % 10 * 5;
  
  return (basePrices[city] || defaultPrice) + zipPremium;
}

function getBedroomValue(bedrooms: number, basePricePerSqft: number): number {
  // Bedrooms typically add non-linear value (3->4 adds less than 2->3)
  const bedroomValues = [0, 25000, 45000, 60000, 70000, 77000, 83000];
  return bedroomValues[Math.min(bedrooms, bedroomValues.length - 1)];
}

function getBathroomValue(bathrooms: number, basePricePerSqft: number): number {
  // Each bathroom adds significant value
  return Math.min(bathrooms, 5) * 20000;
}

function getAgeAdjustment(yearBuilt: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - yearBuilt;
  
  // Newer homes have less depreciation
  if (age <= 5) return 25000;
  if (age <= 10) return 15000;
  if (age <= 20) return 0;
  if (age <= 40) return -15000;
  if (age <= 60) return -25000;
  return -35000;
}

function getConditionAdjustment(condition: string): number {
  // Condition significantly impacts value
  const conditionValues: Record<string, number> = {
    'Excellent': 40000,
    'Good': 20000,
    'Average': 0,
    'Fair': -20000,
    'Poor': -40000
  };
  
  return conditionValues[condition] || 0;
}

function getFeaturesAdjustment(property: PropertyDetails): number {
  let adjustment = 0;
  
  if (property.hasGarage) adjustment += 15000;
  if (property.hasPool) adjustment += 25000;
  if (property.hasBasement) adjustment += 20000;
  if (property.recentRenovations) adjustment += 30000;
  
  // Property type adjustments
  if (property.propertyType === 'Single Family') adjustment += 10000;
  if (property.propertyType === 'Condo') adjustment -= 5000;
  
  return adjustment;
}
