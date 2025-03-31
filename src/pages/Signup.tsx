
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserPlus, Phone } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type FormValues = z.infer<typeof formSchema>;

const Signup = () => {
  const {
    signup,
    user,
    isLoading
  } = useUser();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Signup form submitted with:", values);

      // Log the phone number specifically to ensure it's passed correctly
      console.log("Phone number from form:", values.phone);
      console.log("Phone number type:", typeof values.phone);

      // Just pass the phone number as-is - the formatting will be handled in UserContext
      await signup(values.email, values.name, values.password, values.phone);
      
      // Show success message on the page instead of redirecting immediately
      setIsSuccess(true);
      
      // Show toast notification
      toast({
        title: 'Account Created!',
        description: 'Please check your email for a verification link.',
        variant: 'default',
        className: 'bg-amber-50 border-amber-200 text-amber-800'
      });

      // Clear the form
      form.reset();
    } catch (error) {
      // Error already handled in the signup function
      console.error('Signup error:', error);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto py-10">
          <Alert className="bg-amber-50 border-amber-200 mb-6">
            <MailCheck className="h-5 w-5 text-amber-800" />
            <AlertTitle className="text-amber-800 text-lg font-medium">Email Verification Required</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p className="mb-2">
                Your account has been created successfully! A verification link has been sent to your email.
              </p>
              <p className="mb-2">
                <strong>Important:</strong> You can now view property details, but to access all features of our site, 
                please verify your email by clicking the link we just sent you.
              </p>
              <p>
                After verification, you'll have full access to save properties, 
                get property valuations, and more.
              </p>
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/properties')} 
              className="w-full py-6 bg-blue-600 hover:bg-blue-700"
            >
              Browse Properties Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/login')} 
              className="w-full py-6"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return <Layout>
        <div className="container max-w-md mx-auto py-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-blue mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>;
  }

  return <Layout>
      <div className="container max-w-md mx-auto py-10">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
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
                control={form.control}
                name="email"
                render={({field}) => (
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
                control={form.control}
                name="phone"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          {...field}
                          className="py-6 pr-10"
                          onChange={e => {
                            console.log("Phone input changed:", e.target.value);
                            field.onChange(e);
                          }}
                        />
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
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
                control={form.control}
                name="confirmPassword"
                render={({field}) => (
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
                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 mt-4"
                disabled={form.formState.isSubmitting || isLoading}
              >
                {form.formState.isSubmitting ? (
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

              <div className="mt-6 text-center">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>;
};

export default Signup;
