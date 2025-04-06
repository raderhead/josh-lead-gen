
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
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
      
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
        <div className="bg-slate-900/70 backdrop-blur-sm p-12 rounded-2xl border border-slate-700 w-full max-w-3xl">
          <div className="flex items-start mb-8">
            <div className="flex-shrink-0 bg-blue-900/80 rounded-full p-5 mr-6">
              <Building className="h-10 w-10 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Perfect Commercial Space
              </h1>
              <p className="text-xl text-gray-300">
                Tell us your needs and preferences, and we'll help you find the ideal 
                property for your business.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Button 
              size="xl" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg flex items-center justify-center"
              onClick={handleQuestionnaireClick}
            >
              Start Questionnaire
              <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 text-lg"
              onClick={() => navigate('/properties')}
            >
              Browse All Properties
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
                navigate('/login', { state: { returnTo: '/property-quiz' } });
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
                navigate('/signup', { state: { returnTo: '/property-quiz' } });
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
