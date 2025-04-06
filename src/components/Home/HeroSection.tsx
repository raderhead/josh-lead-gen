
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building, MapPin, DollarSign, MessageSquare } from 'lucide-react';
import PropertySearchInput from '@/components/Property/PropertySearchInput';
import PropertyQuiz from '@/components/Quiz/PropertyQuiz';

const HeroSection = () => {
  const navigate = useNavigate();
  const [addressData, setAddressData] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const handleAddressSelected = (data: any) => {
    setAddressData(data);
    // You can optionally navigate here or store the data
  };
  
  return (
    <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 h-[600px] flex flex-col justify-between">
      <div className="absolute inset-0 overflow-hidden">
        <img src="/lovable-uploads/9478e2e8-6d1a-48e4-b7c3-2e60e9022800.png" alt="Abilene skyline" className="w-full h-full opacity-30 object-cover" />
      </div>
      
      {/* Main hero content */}
      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Commercial Property in Abilene</h1>
      </div>
      
      {/* Quiz CTA - Positioned at the bottom of the hero section */}
      <div className="relative z-10 w-full transform translate-y-1/2">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-3 justify-center">
            <MessageSquare size={24} className="text-estate-blue" />
            <h2 className="text-2xl font-bold text-white">Find Your Perfect Commercial Property</h2>
          </div>
          <p className="text-lg text-white/80 mb-6">
            Help us understand your needs better. Take our quick questionnaire to give our agent insights into what you're looking for.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/property-quiz')} 
              variant="glow"
              size="lg" 
              className="rounded-full group relative py-2.5 px-6"
            >
              <MessageSquare className="mr-2 size-5 animate-pulse" />
              <span>Take Our Questionnaire</span>
            </Button>
          </div>
        </div>
      </div>
      
      {showQuiz && <PropertyQuiz mode="fullscreen" onClose={() => setShowQuiz(false)} />}
    </div>
  );
};

export default HeroSection;
