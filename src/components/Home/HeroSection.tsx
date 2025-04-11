
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAuthDialog } from '@/contexts/AuthDialogContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { LogIn } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openLogin, openSignup } = useAuthDialog();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const handleQuestionnaireClick = () => {
    if (user) {
      navigate('/property-quiz');
    } else {
      setShowAuthDialog(true);
    }
  };
  
  return (
    <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 h-screen flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/lovable-uploads/9478e2e8-6d1a-48e4-b7c3-2e60e9022800.png" 
          alt="Abilene skyline" 
          className="w-full h-full opacity-30 object-cover" 
        />
      </div>
      
      {/* Large heading at the top */}
      <div className="absolute top-32 w-full text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 px-4">
          Your Gateway to Commercial Real Estate Success in Abilene
        </h1>
      </div>
      
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full mt-60">
        <div className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 w-full">
          <div className="mb-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What's Your Commercial Real Estate Game Plan?
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 text-lg"
              onClick={() => navigate('/properties')}
            >
              Browse All Properties
            </Button>
            <Button 
              size="xl" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg flex items-center justify-center group"
              onClick={handleQuestionnaireClick}
            >
              Take The Quiz
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to be signed in to use the property questionnaire. 
              Please sign in or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              className="w-full bg-estate-blue hover:bg-estate-dark-blue"
              onClick={() => {
                setShowAuthDialog(false);
                openLogin();
              }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Button>
            <Button
              variant="outline" 
              className="w-full"
              onClick={() => {
                setShowAuthDialog(false);
                openSignup();
              }}
            >
              Create an account
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={() => setShowAuthDialog(false)}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroSection;
