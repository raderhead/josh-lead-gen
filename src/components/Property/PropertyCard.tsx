
import React, { useState, useEffect } from "react";
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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const { user, signup, login, isLoading } = useUser();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the property is already in favorites when component mounts
  useEffect(() => {
    const savedProperties = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    const isAlreadySaved = savedProperties.some(p => p.id === property.id);
    setIsFavorite(isAlreadySaved);
  }, [property.id]);

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

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });

  const onSignup = async (values: SignupFormValues) => {
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

  const onLogin = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.phone);
      setIsAuthDialogOpen(false);
      openModal();
      toast({
        title: "Welcome back!",
        description: "You can now view property details and save favorites.",
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    const savedProperties = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    
    if (isFavorite) {
      // Remove from favorites
      const updatedProperties = savedProperties.filter(p => p.id !== property.id);
      localStorage.setItem("savedProperties", JSON.stringify(updatedProperties));
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: "Property removed from your saved properties",
      });
    } else {
      // Add to favorites
      const propertyToSave = {
        id: property.id,
        address: `${property.address.street}, ${property.address.city}`,
        price: property.price,
        image: property.images[0],
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem("savedProperties", JSON.stringify([...savedProperties, propertyToSave]));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: "Property saved to your favorites",
      });
    }
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
              
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="py-6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 555-5555" {...field} className="py-6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    className="w-full text-lg py-6" 
                    type="submit"
                    disabled={loginForm.formState.isSubmitting || isLoading}
                  >
                    {loginForm.formState.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="text-center mt-4">
                <p className="text-blue-600 hover:underline cursor-pointer" onClick={() => setShowSignInForm(false)}>
                  Don't have an account?
                </p>
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
              
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4 mt-4">
                  <FormField
                    control={signupForm.control}
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
                    control={signupForm.control}
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
                    control={signupForm.control}
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
                    disabled={signupForm.formState.isSubmitting || isLoading}
                  >
                    {signupForm.formState.isSubmitting ? (
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
