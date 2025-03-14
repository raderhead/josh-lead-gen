
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import Layout from "@/components/Layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface SavedProperty {
  id: string;
  address: string;
  price: number;
  image: string;
  savedAt: string;
}

const SavedProperties: React.FC = () => {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved properties from localStorage
    const properties = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    setSavedProperties(properties);
  }, []);

  const removeProperty = (id: string) => {
    const updatedProperties = savedProperties.filter(p => p.id !== id);
    localStorage.setItem("savedProperties", JSON.stringify(updatedProperties));
    setSavedProperties(updatedProperties);
    
    toast({
      title: "Property removed",
      description: "The property has been removed from your saved list."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
            <p className="text-gray-600 mt-2">
              View and manage your favorite listings
            </p>
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No saved properties</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              You haven't saved any properties yet. Browse our listings and click the heart icon to save properties you're interested in.
            </p>
            <Button asChild className="mt-6">
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={property.image}
                      alt={property.address}
                      className="object-cover w-full"
                    />
                  </AspectRatio>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeProperty(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    {property.address}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Saved on {new Date(property.savedAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 pt-0">
                  <span className="font-bold">{formatCurrency(property.price)}</span>
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/property/${property.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedProperties;
