
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizCompletionPageProps {
  userName: string;
  className?: string;
  onClose?: () => void;
  mode?: 'inline' | 'fullscreen';
}

const QuizCompletionPage: React.FC<QuizCompletionPageProps> = ({ 
  userName, 
  className,
  onClose,
  mode = 'inline'
}) => {
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };
  
  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-slate-900 to-estate-dark-blue z-50 overflow-y-auto">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Card className={cn("w-full max-w-4xl bg-white/10 border-white/20 shadow-xl text-white", className)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl">Thank You!</CardTitle>
                {onClose && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose} 
                    className="text-white hover:bg-white/10"
                  >
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 py-6">
              <p className="text-xl">
                Thank you, <span className="font-semibold">{userName}</span>, for completing the commercial property questionnaire.
              </p>
              
              <p className="text-lg">
                Josh Rader will review your preferences and contact you as soon as possible to discuss the next steps.
              </p>
              
              <p className="text-lg">
                Your input helps us understand your specific needs so we can provide the most relevant commercial property options.
              </p>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handleHomeClick} 
                className="bg-estate-blue hover:bg-estate-dark-blue w-full sm:w-auto"
                size="lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Browse Properties
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <Card className={cn("w-full bg-white border shadow-md", className)}>
      <CardHeader>
        <CardTitle>Thank You!</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p>
          Thank you, <span className="font-semibold">{userName}</span>, for completing the commercial property questionnaire.
        </p>
        
        <p>
          Josh Rader will review your preferences and contact you as soon as possible to discuss the next steps.
        </p>
        
        <p>
          Your input helps us understand your specific needs so we can provide the most relevant commercial property options.
        </p>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleHomeClick} 
          className="bg-estate-blue hover:bg-estate-dark-blue"
        >
          <Home className="mr-2 h-4 w-4" />
          Browse Properties
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCompletionPage;
