
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
import { UserPlus, LogIn } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const { user, signup, isLoading } = useUser();

  const handlePropertyClick = () => {
    if (user) {
      openModal();
    } else {
      setIsAuthDialogOpen(true);
      setShowSignInForm(false); // Default to signup form
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values.email, values.name, values.password);
      setIsAuthDialogOpen(false);
      openModal(); // Open the property modal after successful signup
    } catch (error) {
      // Error already handled in the signup function
      console.error('Signup error:', error);
    }
  };

  return (
    <>
      <div 
        className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-1 bg-card"
        onClick={handlePropertyClick}
      >
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <img
              src={property.images[0]}
              alt={property.address.street}
              className="object-cover w-full h-full"
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
        </div>

        <div className="p-4">
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
        <DialogContent className="sm:max-w-[425px]">
          {showSignInForm ? (
            <>
              <DialogHeader>
                <DialogTitle>Sign in to your account</DialogTitle>
                <DialogDescription>
                  Sign in to view property details and save your favorite listings.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex justify-center">
                <Button asChild className="w-full">
                  <Link to="/login" onClick={() => setIsAuthDialogOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Continue to sign in
                  </Link>
                </Button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setShowSignInForm(false)} 
                    className="text-estate-blue hover:underline font-medium"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Create an account</DialogTitle>
                <DialogDescription>
                  Create an account to view property details and save your favorite listings.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={form.formState.isSubmitting || isLoading}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button 
                    onClick={() => setShowSignInForm(true)} 
                    className="text-estate-blue hover:underline font-medium"
                  >
                    Sign in
                  </button>
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
