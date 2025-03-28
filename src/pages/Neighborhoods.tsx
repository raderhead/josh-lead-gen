
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { MapPin } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

type Neighborhood = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  slug: string;
  stats: {
    avgPrice: string;
    propertyCount: number;
    popularity: string;
  };
};

const neighborhoods: Neighborhood[] = [
  {
    id: "1",
    name: "Abilene",
    description: "Upscale family homes with excellent schools and shopping",
    longDescription: "Abilene is the commercial heart of the region, offering a diverse range of properties from retail spaces to office buildings. With strong foot traffic and growing business community, it's an ideal location for both established businesses and startups.",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "abilene",
    stats: {
      avgPrice: "$450,000",
      propertyCount: 24,
      popularity: "High"
    }
  },
  {
    id: "2",
    name: "Buffalo Gap",
    description: "Rural charm with modern amenities and beautiful landscapes",
    longDescription: "Buffalo Gap offers the perfect blend of rural charm and commercial opportunity. Properties here feature generous space, lower costs than downtown, while still maintaining proximity to major transportation routes.",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "buffalo-gap",
    stats: {
      avgPrice: "$320,000",
      propertyCount: 16,
      popularity: "Medium"
    }
  },
  {
    id: "3",
    name: "Eastland",
    description: "Luxury properties with spacious lots and stunning views",
    longDescription: "Eastland is known for its premium commercial spaces and luxury developments. This area attracts high-end retail, professional services, and businesses looking for prestige locations with modern amenities and upscale surroundings.",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "eastland",
    stats: {
      avgPrice: "$520,000",
      propertyCount: 12,
      popularity: "High"
    }
  },
  {
    id: "4",
    name: "Tuscola",
    description: "Premium commercial spaces in a growing business district",
    longDescription: "Tuscola is an emerging commercial hub with rapid development and growth. Businesses benefit from newer infrastructure, competitive pricing, and a strategic location that's becoming increasingly connected to the broader regional economy.",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "tuscola",
    stats: {
      avgPrice: "$380,000",
      propertyCount: 18,
      popularity: "Rising"
    }
  }
];

const Neighborhoods = () => {
  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Neighborhood Guides
            </h1>
            <p className="text-lg text-gray-600">
              Explore the diverse commercial areas in and around Abilene to find the perfect location for your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {neighborhoods.map((neighborhood) => (
              <Link
                key={neighborhood.id}
                to={`/neighborhoods/${neighborhood.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <AspectRatio ratio={16/9}>
                  <img
                    src={neighborhood.imageUrl}
                    alt={neighborhood.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </AspectRatio>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-estate-blue" />
                    <h3 className="text-xl font-semibold text-gray-900">{neighborhood.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{neighborhood.description}</p>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Avg. Price</p>
                      <p className="text-estate-blue font-medium">{neighborhood.stats.avgPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Properties</p>
                      <p className="font-medium">{neighborhood.stats.propertyCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Demand</p>
                      <p className="font-medium">{neighborhood.stats.popularity}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Neighborhoods;
