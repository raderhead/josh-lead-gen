
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Neighborhood = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
};

const neighborhoods: Neighborhood[] = [
  {
    id: "1",
    name: "Abilene",
    description: "Upscale family homes with excellent schools and shopping",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "abilene",
  },
  {
    id: "2",
    name: "Buffalo Gap",
    description: "Rural charm with modern amenities and beautiful landscapes",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "buffalo-gap",
  },
  {
    id: "3",
    name: "Eastland",
    description: "Luxury properties with spacious lots and stunning views",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "eastland",
  },
  {
    id: "4",
    name: "Tuscola",
    description: "Premium commercial spaces in a growing business district",
    imageUrl: "/public/lovable-uploads/55deabfb-d38d-4cf3-ad88-d5e416c3ae39.png",
    slug: "tuscola",
  },
];

const NeighborhoodGuides: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Neighborhood Guides</h2>
            <p className="mt-2 text-lg text-gray-600">
              Explore top commercial areas in and around Abilene
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 border-estate-blue text-estate-blue hover:bg-estate-light-blue"
            asChild
          >
            <Link to="/neighborhoods">
              View All Neighborhoods
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {neighborhoods.map((neighborhood) => (
            <Link
              key={neighborhood.id}
              to={`/neighborhoods/${neighborhood.slug}`}
              className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <AspectRatio ratio={1}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <img
                  src={neighborhood.imageUrl}
                  alt={neighborhood.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <div className="flex items-center gap-1 text-white mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{neighborhood.name}</span>
                  </div>
                  <p className="text-white/90 text-sm line-clamp-2">{neighborhood.description}</p>
                </div>
              </AspectRatio>
            </Link>
          ))}
        </div>

        {/* Mobile View - Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {neighborhoods.map((neighborhood) => (
                <CarouselItem key={neighborhood.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link
                    to={`/neighborhoods/${neighborhood.slug}`}
                    className="group relative overflow-hidden rounded-lg shadow-md block"
                  >
                    <AspectRatio ratio={1}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                      <img
                        src={neighborhood.imageUrl}
                        alt={neighborhood.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="flex items-center gap-1 text-white mb-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm font-medium">{neighborhood.name}</span>
                        </div>
                        <p className="text-white/90 text-sm line-clamp-2">{neighborhood.description}</p>
                      </div>
                    </AspectRatio>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-estate-blue text-estate-blue"
              asChild
            >
              <Link to="/neighborhoods">
                View All Neighborhoods
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeighborhoodGuides;
