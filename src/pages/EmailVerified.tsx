import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout/Layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmailVerified = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(3);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleHashParameters = async () => {
      try {
        setVerifying(true);
        
        if (location.hash) {
          console.log("Processing auth redirect with hash:", location.hash);
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
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 bg-estate-blue text-white rounded hover:bg-estate-blue/90"
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
        <Alert className="bg-green-50 border-green-200 mb-4">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Verification Successful</AlertTitle>
          <AlertDescription className="text-green-700">
            Thank you{user?.name ? `, ${user.name}` : ''}. Your email has been verified.
            <p className="mt-2">You now have full access to all features including:</p>
            <ul className="list-disc list-inside mt-1 ml-2">
              <li>Saving favorite properties</li>
              <li>Contacting listing agents</li>
              <li>Scheduling property viewings</li>
              <li>Accessing exclusive listings</li>
              <li>Prefilled contact forms with your information</li>
              <li>Making offers on properties</li>
              <li>Receiving property alerts</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <p className="text-center text-muted-foreground">
          You will be redirected to the homepage in {countdown} seconds...
        </p>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-estate-blue text-white rounded hover:bg-estate-blue/90"
          >
            Go to Homepage Now
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EmailVerified;
