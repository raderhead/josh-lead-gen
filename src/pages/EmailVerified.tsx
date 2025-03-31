
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Layout from '@/components/Layout/Layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check } from 'lucide-react';

const EmailVerified = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Start countdown to redirect
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
  }, [navigate]);

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-10">
        <Alert className="bg-green-50 border-green-200 mb-4">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Verification Successful</AlertTitle>
          <AlertDescription className="text-green-700">
            Thank you{user?.name ? `, ${user.name}` : ''}. Your email has been verified.
          </AlertDescription>
        </Alert>
        
        <p className="text-center text-muted-foreground">
          You will be redirected to the homepage in {countdown} seconds...
        </p>
      </div>
    </Layout>
  );
};

export default EmailVerified;
