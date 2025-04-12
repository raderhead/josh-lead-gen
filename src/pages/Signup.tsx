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
import { UserPlus, Phone, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [showVerificationAlert, setShowVerificationAlert] = React.useState(false);

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

      console.log("Phone number from form:", values.phone);
      console.log("Phone number type:", typeof values.phone);

      await signup(values.email, values.name, values.password, values.phone);
      
      setShowVerificationAlert(true);
      
      toast({
        title: 'Verification Required',
        description: 'Please check your email (including spam folder) for a verification link.',
        variant: 'default',
        className: 'bg-amber-50 border-amber-200 text-amber-800'
      });

      form.reset();

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

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
        {showVerificationAlert && (
          <Alert className="mb-6 bg-amber-50 border-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-800" />
            <AlertDescription className="text-amber-800">
              <p className="font-medium">Please check your email for a verification link.</p>
              <p>If you don't see it in your inbox, please check your spam/junk folder as verification emails sometimes end up there.</p>
            </AlertDescription>
          </Alert>
        )}
        
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
