
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
import { Heart, LogIn, Phone, ArrowRight, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface PropertyCardProps {
  property: Property;
}

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const { user, signup, login, isLoading } = useUser();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavoriteStatus, setCheckingFavoriteStatus] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsFavorite(false);
        setCheckingFavoriteStatus(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('property_id', property.id)
          .maybeSingle()
          .returns<any>();

        if (error) {
          console.error("Error checking favorite status:", error);
          return;
        }

        setIsFavorite(!!data);
      } catch (err) {
        console.error("Exception checking favorite status:", err);
      } finally {
        setCheckingFavoriteStatus(false);
      }
    };

    checkFavoriteStatus();
  }, [property.id, user]);

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
      password: '',
      confirmPassword: '',
    },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignup = async (values: SignupFormValues) => {
    try {
      await signup(values.email, values.name, values.password, values.phone);
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
      await login(values.email, values.password);
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

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    try {
      if (isFavorite) {
        // Find the saved property record first
        const { data: savedProperty, error: findError } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('property_id', property.id)
          .maybeSingle()
          .returns<any>();
          
        if (findError) {
          throw findError;
        }
        
        if (savedProperty) {
          // Remove from favorites
          const { error: deleteError } = await supabase
            .from('saved_properties')
            .delete()
            .eq('id', savedProperty.id)
            .returns<any>();
            
          if (deleteError) {
            throw deleteError;
          }
          
          setIsFavorite(false);
          toast({
            title: "Removed from favorites",
            description: "Property removed from your saved properties",
          });
        }
      } else {
        // Add to favorites
        const propertyToSave = {
          property_id: property.id,
          property_data: {
            address: `${property.address.street}, ${property.address.city}`,
            price: property.price,
            image: property.images[0],
          },
          user_id: user.id
        };
        
        const { error: insertError } = await supabase
          .from('saved_properties')
          .insert(propertyToSave)
          .returns<any>();
          
        if (insertError) {
          throw insertError;
        }
        
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Property saved to your favorites",
        });
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem updating your favorites",
        variant: "destructive"
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
            disabled={checkingFavoriteStatus}
            className={`absolute top-2 right-2 ${isFavorite ? "bg-rose-500 hover:bg-rose-600" : "bg-white/80 hover:bg-white"} ${property.isFeatured ? "top-12" : "top-2"}`}
          >
            {checkingFavoriteStatus ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Heart className={isFavorite ? "fill-white" : ""} />
            )}
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="py-6" />
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
              
              <div className="space-y-4 mt-4">
                <div>
                  <Input 
                    placeholder="Full Name" 
                    className="py-6 text-base" 
                    value={signupForm.watch('name')}
                    onChange={(e) => signupForm.setValue('name', e.target.value)}
                  />
                  {signupForm.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Input 
                    placeholder="Email" 
                    className="py-6 text-base"
                    value={signupForm.watch('email')}
                    onChange={(e) => signupForm.setValue('email', e.target.value)}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="relative">
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="py-6 text-base pr-10"
                    value={signupForm.watch('phone')}
                    onChange={(e) => signupForm.setValue('phone', e.target.value)}
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {signupForm.formState.errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    className="py-6 text-base"
                    value={signupForm.watch('password')}
                    onChange={(e) => signupForm.setValue('password', e.target.value)}
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Input 
                    type="password" 
                    placeholder="Confirm Password" 
                    className="py-6 text-base"
                    value={signupForm.watch('confirmPassword')}
                    onChange={(e) => signupForm.setValue('confirmPassword', e.target.value)}
                  />
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  onClick={signupForm.handleSubmit(onSignup)}
                  className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700" 
                  disabled={signupForm.formState.isSubmitting || isLoading}
                >
                  {signupForm.formState.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-blue-600 hover:underline cursor-pointer" onClick={() => setShowSignInForm(true)}>
                  Already have an account? <span className="font-semibold">Sign in</span>
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
