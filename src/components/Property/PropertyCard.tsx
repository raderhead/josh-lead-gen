
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types/property";
import PropertyModal from "./PropertyModal";
import { useUser } from "@/contexts/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Heart, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property;
}

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const { user, signup, isLoading } = useUser();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePropertyClick = () => {
    if (user) {
      openModal();
    } else {
      setIsAuthDialogOpen(true);
      setShowSignInForm(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values.email, values.name, values.phone);
      setIsAuthDialogOpen(false);
      openModal();
      toast({
        title: "Account created successfully",
        description: "You can now view property details and save favorites.",
      });
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Property removed from your favorites" : "Property added to your favorites",
    });
  };

  return (
    <>
      <div 
        className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-1 bg-card relative"
      >
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <img
              src={property.images[0]}
              alt={property.address.street}
              className="object-cover w-full h-full"
              onClick={handlePropertyClick}
            />
          </AspectRatio>
          {property.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground font-semibold">
              Featured
            </Badge>
          )}
          {property.propertyType && (
            <Badge className="absolute top-2 left-2 bg-black/70 dark:bg-white/20 text-white">
              {property.propertyType}
            </Badge>
          )}
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            size="icon" 
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 ${isFavorite ? "bg-rose-500 hover:bg-rose-600" : "bg-white/80 hover:bg-white"} ${property.isFeatured ? "top-12" : "top-2"}`}
          >
            <Heart className={isFavorite ? "fill-white" : ""} />
          </Button>
        </div>

        <div className="p-4" onClick={handlePropertyClick}>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-3xl font-bold text-primary dark:text-estate-dark-blue">
              {formatCurrency(property.price)}
            </h3>
            {property.mls && (
              <div className="text-right">
                <span className="text-xs text-muted-foreground">MLS</span>
                <p className="text-sm">{property.mls}</p>
              </div>
            )}
          </div>
          
          <p className="text-lg text-foreground">{property.address.street}</p>
          <p className="text-muted-foreground">
            {property.address.city} {property.address.state}, {property.address.zipCode} USA
          </p>
        </div>
      </div>
      
      <PropertyModal 
        property={property} 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {showSignInForm ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold">Sign In</DialogTitle>
                <DialogDescription className="text-center">
                  Sign in to view property details and save your favorite listings.
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <Input placeholder="Email" type="email" className="w-full" />
                </div>
                <div>
                  <Input placeholder="Phone (used as your password)" type="tel" className="w-full" />
                </div>
                
                <Button className="w-full text-lg py-6" type="submit">
                  Continue to Photos →
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-blue-600 hover:underline cursor-pointer" onClick={() => setShowSignInForm(false)}>
                    Don't have an account?
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold">Free Access</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Access full property details and exclusive listings.
                  <p className="italic mt-1">(Prices and inventory current as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})</p>
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} className="py-6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Email" {...field} className="py-6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Phone (also used as your password)" 
                            {...field} 
                            className="py-6" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6" 
                    disabled={form.formState.isSubmitting || isLoading}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      "Continue to Photos →"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="text-center mt-2">
                <p className="text-blue-600 hover:underline cursor-pointer" onClick={() => setShowSignInForm(true)}>
                  Already have an account?
                </p>
              </div>

              <div className="text-xs text-muted-foreground text-center mt-4">
                By clicking "Continue to Photos" you are expressly consenting, in writing, to 
                receive telemarketing and other messages, including artificial or prerecorded 
                voices, via automated calls or texts from <span className="font-semibold">estatesearch.com</span> at the 
                number you provided above. This consent is not required to purchase any 
                good or service. Message and data rates may apply, frequency varies. Text 
                HELP for help or STOP to cancel.
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
