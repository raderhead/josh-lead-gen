
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import Layout from "@/components/Layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface SavedProperty {
  id: string;
  property_id: string;
  address: string;
  price: number;
  image: string;
  saved_at: string;
}

const SavedProperties: React.FC = () => {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Load saved properties from Supabase
  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        setIsLoading(true);
        // Use a more typesafe approach with explicit typing
        const { data, error } = await supabase
          .from('saved_properties')
          .select('*')
          .order('saved_at', { ascending: false })
          .returns<any[]>();
        
        if (error) {
          console.error("Error fetching saved properties:", error);
          toast({
            title: "Error loading saved properties",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        console.log("Loaded saved properties:", data);
        
        // Transform the data to match our component's expected format
        const formattedProperties = data.map(item => {
          const propertyData = item.property_data || {};
          return {
            id: item.id,
            property_id: item.property_id,
            address: propertyData.address,
            price: propertyData.price,
            image: propertyData.image,
            saved_at: item.saved_at
          };
        });
        
        setSavedProperties(formattedProperties);
      } catch (err) {
        console.error("Error in fetchSavedProperties:", err);
        toast({
          title: "Error loading saved properties",
          description: "There was a problem loading your saved properties.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchSavedProperties();
    }
    
    // Set up realtime subscription for saved properties changes
    const channel = supabase
      .channel('public:saved_properties')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'saved_properties' 
      }, () => {
        fetchSavedProperties();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const removeProperty = async (id: string) => {
    try {
      // Use a typesafe approach
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('id', id)
        .returns<any>();
        
      if (error) {
        console.error("Error removing property:", error);
        toast({
          title: "Error removing property",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Update local state immediately for a responsive UI
      setSavedProperties(prevProperties => prevProperties.filter(p => p.id !== id));
      
      toast({
        title: "Property removed",
        description: "The property has been removed from your saved list."
      });
    } catch (err) {
      console.error("Error in removeProperty:", err);
      toast({
        title: "Error removing property",
        description: "There was a problem removing the property.",
        variant: "destructive"
      });
    }
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

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : savedProperties.length === 0 ? (
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
                    Saved on {new Date(property.saved_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 pt-0">
                  <span className="font-bold">{formatCurrency(property.price)}</span>
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/property/${property.property_id}`}>View Details</Link>
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
