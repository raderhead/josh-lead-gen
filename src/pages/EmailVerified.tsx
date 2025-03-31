
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout/Layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Check, Home, Building } from 'lucide-react';

const EmailVerified = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle hash fragment if present (for Supabase auth redirects)
    const handleHashParameters = async () => {
      try {
        setVerifying(true);
        
        // If we have a hash in the URL, it might contain auth tokens
        if (location.hash) {
          console.log("Processing auth redirect with hash:", location.hash);
          
          // Let Supabase auth handle the hash parameters
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error processing authentication redirect:", error);
            setError(error.message);
          } else {
            console.log("Successfully processed auth redirect:", data);
          }
        }
      } catch (err) {
        console.error("Error handling auth redirect:", err);
        setError("Failed to process verification");
      } finally {
        setVerifying(false);
      }
    };
    
    handleHashParameters();
  }, [location]);

  useEffect(() => {
    // Start countdown to redirect only after verification is complete
    if (!verifying && !error) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup timer on unmount
      return () => clearInterval(timer);
    }
  }, [navigate, verifying, error]);

  if (verifying) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto py-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-blue mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verifying your email...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto py-10">
          <Alert className="bg-red-50 border-red-200 mb-4">
            <AlertTitle className="text-red-800">Verification Failed</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4 gap-4">
            <Button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-10">
        <Alert className="bg-green-50 border-green-200 mb-6">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 text-xl">Email Verified Successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            <p className="mb-3">
              Thank you{user?.name ? `, ${user.name}` : ''}! Your email has been verified.
            </p>
            <p className="mb-3">
              <strong>You now have full access to all features:</strong>
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>View detailed property information</li>
              <li>Save your favorite properties</li>
              <li>Request property valuations</li>
              <li>Contact property owners</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => navigate('/properties')} 
            className="w-full py-6 bg-blue-600 hover:bg-blue-700"
          >
            <Building className="mr-2 h-5 w-5" />
            Browse Properties
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/')} 
            className="w-full py-6"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Button>
          
          <p className="text-center text-muted-foreground mt-2">
            Redirecting to homepage in {countdown} seconds...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EmailVerified;
