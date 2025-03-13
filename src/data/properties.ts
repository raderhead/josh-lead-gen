
import { Property } from '../types/property';

export const properties: Property[] = [
  {
    id: "1",
    address: {
      street: "123 Main Street",
      city: "Abilene",
      state: "TX",
      zipCode: "79601",
      neighborhood: "Downtown",
    },
    price: 329000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    lotSize: 0.25,
    yearBuilt: 2018,
    propertyType: "Single Family",
    description: "Beautiful modern home in Downtown Abilene. This 4-bedroom, 3-bath house features an open floor plan, updated kitchen with stainless steel appliances, and a spacious backyard perfect for entertaining. The master suite offers a walk-in closet and luxurious bathroom. Located near shops, restaurants, and parks.",
    features: [
      "Open Floor Plan", 
      "Stainless Steel Appliances", 
      "Granite Countertops", 
      "Hardwood Floors", 
      "Walk-in Closets", 
      "Fenced Backyard", 
      "Covered Patio"
    ],
    hasPool: true,
    hasGarage: true,
    garageSpaces: 2,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=1000",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1000",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1000"
    ],
    status: "For Sale",
    listedDate: "2023-06-15",
    virtualTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agent: {
      id: "101",
      name: "Sarah Johnson",
      phone: "(325) 555-1234",
      email: "sarah.johnson@estateview.com",
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500"
    },
    latitude: 32.448736,
    longitude: -99.733144,
    isFeatured: true
  },
  {
    id: "2",
    address: {
      street: "456 Oak Avenue",
      city: "Abilene",
      state: "TX",
      zipCode: "79605",
      neighborhood: "River Oaks",
    },
    price: 225000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    lotSize: 0.18,
    yearBuilt: 2005,
    propertyType: "Single Family",
    description: "Charming 3-bedroom home in the desirable River Oaks neighborhood. This well-maintained property features a bright living room, updated kitchen, and spacious bedrooms. The backyard includes a covered patio and beautiful landscaping. Great location with easy access to schools and shopping.",
    features: [
      "Updated Kitchen", 
      "Laminate Flooring", 
      "Ceiling Fans", 
      "Large Closets", 
      "Fenced Backyard", 
      "Sprinkler System"
    ],
    hasPool: false,
    hasGarage: true,
    garageSpaces: 2,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1000",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000"
    ],
    status: "For Sale",
    listedDate: "2023-07-02",
    agent: {
      id: "102",
      name: "Michael Rodriguez",
      phone: "(325) 555-5678",
      email: "michael.rodriguez@estateview.com",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500"
    },
    latitude: 32.441262,
    longitude: -99.748111,
    isFeatured: false
  },
  {
    id: "3",
    address: {
      street: "789 Pine Court",
      city: "Abilene",
      state: "TX",
      zipCode: "79606",
      neighborhood: "Hillcrest",
    },
    price: 475000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    lotSize: 0.4,
    yearBuilt: 2020,
    propertyType: "Single Family",
    description: "Luxurious 5-bedroom home in the exclusive Hillcrest neighborhood. This stunning property features high ceilings, a gourmet kitchen with custom cabinetry, and a primary suite with spa-like bathroom. The backyard oasis includes a pool, hot tub, and outdoor kitchen. Perfect for entertaining and family living.",
    features: [
      "Gourmet Kitchen", 
      "Custom Cabinetry", 
      "Quartz Countertops", 
      "Crown Molding", 
      "Recessed Lighting", 
      "Home Office", 
      "Media Room", 
      "Outdoor Kitchen"
    ],
    hasPool: true,
    hasGarage: true,
    garageSpaces: 3,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1000",
      "https://images.unsplash.com/photo-1560185893-d8d2e63ebabf?q=80&w=1000"
    ],
    status: "For Sale",
    listedDate: "2023-05-20",
    virtualTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agent: {
      id: "101",
      name: "Sarah Johnson",
      phone: "(325) 555-1234",
      email: "sarah.johnson@estateview.com",
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500"
    },
    latitude: 32.417845,
    longitude: -99.781280,
    isFeatured: true
  },
  {
    id: "4",
    address: {
      street: "1010 Magnolia Drive",
      city: "Abilene",
      state: "TX",
      zipCode: "79602",
      neighborhood: "Elmwood",
    },
    price: 189900,
    beds: 3,
    baths: 2,
    sqft: 1550,
    lotSize: 0.15,
    yearBuilt: 1995,
    propertyType: "Single Family",
    description: "Well-maintained 3-bedroom home in the family-friendly Elmwood neighborhood. This cozy property offers a comfortable living space with a fireplace, eat-in kitchen, and covered back porch. The fenced yard is perfect for pets and children. Located near parks and excellent schools.",
    features: [
      "Fireplace", 
      "Eat-in Kitchen", 
      "Covered Porch", 
      "Fenced Yard", 
      "Storage Shed", 
      "New Roof (2020)"
    ],
    hasPool: false,
    hasGarage: true,
    garageSpaces: 1,
    images: [
      "https://images.unsplash.com/photo-1592595896616-c37162298647?q=80&w=1000",
      "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=1000",
      "https://images.unsplash.com/photo-1560185008-a33a2f73a8ba?q=80&w=1000"
    ],
    status: "For Sale",
    listedDate: "2023-06-28",
    agent: {
      id: "103",
      name: "Jennifer Smith",
      phone: "(325) 555-9012",
      email: "jennifer.smith@estateview.com",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500"
    },
    latitude: 32.431078,
    longitude: -99.701986,
    isFeatured: false
  },
  {
    id: "5",
    address: {
      street: "222 Lakeview Terrace",
      city: "Abilene",
      state: "TX",
      zipCode: "79603",
      neighborhood: "Lakeside",
    },
    price: 399000,
    beds: 4,
    baths: 3.5,
    sqft: 2800,
    lotSize: 0.3,
    yearBuilt: 2015,
    propertyType: "Single Family",
    description: "Beautiful waterfront property in the prestigious Lakeside neighborhood. This 4-bedroom home offers stunning lake views, an open concept living area, and a gourmet kitchen with island. The primary suite features a balcony overlooking the water. Outdoor entertaining is a breeze with the expansive deck and private dock.",
    features: [
      "Lake Views", 
      "Private Dock", 
      "Open Concept", 
      "Gourmet Kitchen", 
      "Kitchen Island", 
      "Master Balcony", 
      "Expansive Deck", 
      "Smart Home Features"
    ],
    hasPool: false,
    hasGarage: true,
    garageSpaces: 2,
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1000",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?q=80&w=1000",
      "https://images.unsplash.com/photo-1600047509782-20d39509de23?q=80&w=1000",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1000"
    ],
    status: "For Sale",
    listedDate: "2023-07-05",
    virtualTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agent: {
      id: "102",
      name: "Michael Rodriguez",
      phone: "(325) 555-5678",
      email: "michael.rodriguez@estateview.com",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500"
    },
    latitude: 32.461204,
    longitude: -99.715988,
    isFeatured: true
  },
  {
    id: "6",
    address: {
      street: "555 Cedar Street",
      city: "Abilene",
      state: "TX",
      zipCode: "79604",
      neighborhood: "Cedar Grove",
    },
    price: 279900,
    beds: 4,
    baths: 2,
    sqft: 2100,
    lotSize: 0.22,
    yearBuilt: 2008,
    propertyType: "Single Family",
    description: "Spacious 4-bedroom home in the sought-after Cedar Grove neighborhood. This well-designed property features an open floor plan with a large living room, dining area, and updated kitchen. The master suite includes a walk-in closet and en-suite bathroom. The backyard has a covered patio and plenty of space for outdoor activities.",
    features: [
      "Open Floor Plan", 
      "Updated Kitchen", 
      "Walk-in Closet", 
      "En-suite Bathroom", 
      "Covered Patio", 
      "Sprinkler System", 
      "Energy Efficient Windows"
    ],
    hasPool: false,
    hasGarage: true,
    garageSpaces: 2,
    images: [
      "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?q=80&w=1000",
      "https://images.unsplash.com/photo-1560184897-502a475f7a0d?q=80&w=1000",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1000"
    ],
    status: "For Sale",
    listedDate: "2023-06-10",
    agent: {
      id: "103",
      name: "Jennifer Smith",
      phone: "(325) 555-9012",
      email: "jennifer.smith@estateview.com",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500"
    },
    latitude: 32.45632,
    longitude: -99.74236,
    isFeatured: false
  }
];

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(property => property.id === id);
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(property => property.isFeatured);
};

export const getPropertiesByFilter = (filters: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  hasPool?: boolean;
  hasGarage?: boolean;
}): Property[] => {
  return properties.filter(property => {
    let matches = true;
    
    if (filters.city && property.address.city.toLowerCase() !== filters.city.toLowerCase()) {
      matches = false;
    }
    
    if (filters.minPrice && property.price < filters.minPrice) {
      matches = false;
    }
    
    if (filters.maxPrice && property.price > filters.maxPrice) {
      matches = false;
    }
    
    if (filters.beds && property.beds < filters.beds) {
      matches = false;
    }
    
    if (filters.baths && property.baths < filters.baths) {
      matches = false;
    }
    
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      matches = false;
    }
    
    if (filters.hasPool !== undefined && property.hasPool !== filters.hasPool) {
      matches = false;
    }
    
    if (filters.hasGarage !== undefined && property.hasGarage !== filters.hasGarage) {
      matches = false;
    }
    
    return matches;
  });
};
