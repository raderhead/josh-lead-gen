
export interface Property {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    neighborhood?: string;
  };
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi Family' | 'Land' | 'Other';
  description: string;
  features: string[];
  hasPool: boolean;
  hasGarage: boolean;
  garageSpaces?: number;
  images: string[];
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Pending';
  listedDate: string;
  virtualTourUrl?: string;
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photo?: string;
  };
  latitude?: number;
  longitude?: number;
  isFeatured?: boolean;
}
