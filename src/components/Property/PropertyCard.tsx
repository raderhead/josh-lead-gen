
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Heart, LogIn, Phone, AlertTriangle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyCardProps {
  property: Property;
}

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignupFormValues = z.infer<typeof signupSchema>;

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const showingRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  message: z.string().optional(),
});

type ShowingRequestFormValues = z.infer<typeof showingRequestSchema>;

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isShowingDialogOpen, setIsShowingDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showVerificationWarning, setShowVerificationWarning] = useState(false);
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
      setShowVerificationWarning(false);
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
      phone: '',
    },
  });

  const showingRequestForm = useForm<ShowingRequestFormValues>({
    resolver: zodResolver(showingRequestSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      date: '',
      time: '',
      message: '',
    },
  });

  const onSignup = async (values: SignupFormValues) => {
    try {
      console.log("Signup form submitted with:", values);

      console.log("Phone number from form:", values.phone);
      console.log("Phone number type:", typeof values.phone);

      await signup(values.email, values.name, values.password, values.phone);
      
      setShowVerificationWarning(true);
      
      signupForm.reset();
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

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    try {
      if (isFavorite) {
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

  const onShowingRequest = (values: ShowingRequestFormValues) => {
    try {
      console.log("Showing request submitted with:", values);
      
      const showingRequest = {
        propertyId: property.id,
        propertyAddress: `${property.address.street}, ${property.address.city}`,
        propertyPrice: property.price,
        date: values.date,
        time: values.time,
        name: values.name,
        email: values.email,
        phone: values.phone || '',
        message: values.message || ''
      };
      
      const showingRequests = JSON.parse(
        localStorage.getItem("showingRequests") || "[]"
      );
      localStorage.setItem("showingRequests", JSON.stringify([...showingRequests, showingRequest]));

      setIsShowingDialogOpen(false);
      toast({
        title: "Showing request sent",
        description: `An agent will contact you soon to confirm your showing on ${values.date} at ${values.time}.`,
      });
      
      showingRequestForm.reset({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        date: '',
        time: '',
        message: '',
      });
    } catch (error) {
      console.error("Error submitting showing request:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your showing request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShowingRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    showingRequestForm.reset({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      date: '',
      time: '',
      message: '',
    });
    
    setIsShowingDialogOpen(true);
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

        <div className="p-4">
          <div onClick={handlePropertyClick}>
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
          
          <div className="mt-4">
            <Button 
              variant="showing" 
              className="w-full" 
              onClick={handleShowingRequest}
            >
              <Calendar className="h-4 w-4" />
              Request Showing
            </Button>
          </div>
        </div>
      </div>
      
      <PropertyModal 
        property={property} 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />

      <Dialog open={isShowingDialogOpen} onOpenChange={setIsShowingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request a Showing</DialogTitle>
            <DialogDescription>
              Fill out the form below to schedule a showing of this property.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...showingRequestForm}>
            <form onSubmit={showingRequestForm.handleSubmit(onShowingRequest)} className="space-y-4 mt-4">
              <FormField
                control={showingRequestForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={showingRequestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={showingRequestForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={showingRequestForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date*</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={showingRequestForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time*</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={showingRequestForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information or questions..." 
                        className="resize-none" 
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {showVerificationWarning ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold">Account Created</DialogTitle>
                <DialogDescription className="text-center">
                  Your account has been created successfully.
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Email Verification Required</p>
                    <p className="text-sm text-amber-700 mt-1">
                      You can now view this property's details, but to access all features of the site 
                      (saving favorites, contacting agents, etc.), please verify your email address.
                      Check your inbox for a verification link.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAuthDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsAuthDialogOpen(false);
                    openModal();
                  }}
                >
                  View Property Details
                </Button>
              </div>
            </>
          ) : showSignInForm ? (
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
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
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
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="py-6" />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="py-6" />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="tel" 
                              placeholder="(555) 123-4567" 
                              {...field} 
                              className="py-6 pr-10" 
                            />
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
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

                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="py-6" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700" 
                    disabled={signupForm.formState.isSubmitting || isLoading}
                  >
                    {signupForm.formState.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="text-center mt-2">
                <p>
                  Already have an account? 
                  <span 
                    className="text-blue-600 hover:underline cursor-pointer ml-1" 
                    onClick={() => setShowSignInForm(true)}
                  >
                    Sign in
                  </span>
                </p>
              </div>

              <div className="text-xs text-muted-foreground text-center mt-4">
                By clicking "Create Account" you are expressly consenting, in writing, to 
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
