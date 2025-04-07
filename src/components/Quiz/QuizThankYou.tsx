
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuizMode } from './types';

interface QuizThankYouProps {
  userName: string;
  mode: QuizMode;
  className?: string;
}

const QuizThankYou: React.FC<QuizThankYouProps> = ({ userName, mode, className }) => {
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const navigate = useNavigate();

  // Handle countdown and redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirectCountdown > 0) {
        setRedirectCountdown(redirectCountdown - 1);
      } else {
        navigate('/');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);

  return (
    <div className={mode === 'fullscreen' ? "fixed inset-0 bg-gradient-to-r from-slate-900 to-estate-dark-blue z-50 overflow-y-auto" : ""}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className={cn(
          "w-full max-w-lg text-center bg-white", 
          mode === 'fullscreen' ? "bg-white/10 border-white/20 text-white" : "",
          className
        )}>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <CardTitle className={cn("text-3xl", mode === 'fullscreen' ? "text-white" : "")}>
              Thank You, {userName || ""}!
            </CardTitle>
            <CardDescription className={cn("text-lg mt-2", mode === 'fullscreen' ? "text-white/80" : "")}>
              Your preferences have been submitted. Our agent will contact you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={cn("mb-6", mode === 'fullscreen' ? "text-white/80" : "")}>
              Redirecting to homepage in {redirectCountdown} seconds...
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-estate-blue hover:bg-estate-dark-blue text-white"
            >
              Return Home Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizThankYou;
