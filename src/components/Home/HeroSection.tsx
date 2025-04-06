
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Building } from 'lucide-react';
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
    <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 h-screen flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/lovable-uploads/9478e2e8-6d1a-48e4-b7c3-2e60e9022800.png" 
          alt="Abilene skyline" 
          className="w-full h-full opacity-30 object-cover" 
        />
      </div>
      
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Commercial Property in Abilene</h1>
        </div>
        
        {/* Redesigned Quiz CTA - Modern card with gradient border */}
        <div className="w-full max-w-3xl backdrop-blur-md p-8 rounded-2xl border border-white/20 bg-gradient-to-br from-black/70 to-slate-800/80 shadow-xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-estate-blue/20 rounded-full flex items-center justify-center">
              <Building size={40} className="text-estate-blue" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Find Your Perfect Commercial Space</h2>
              <p className="text-white/80 mb-6 text-lg">
                Tell us your needs and preferences, and we'll help you find the ideal property for your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/property-quiz')} 
                  size="lg" 
                  className="bg-estate-blue hover:bg-estate-blue/90 text-white rounded-full px-6 py-6 flex-1 group"
                >
                  <span className="mr-2">Start Questionnaire</span>
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button
                  onClick={() => navigate('/properties')}
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-full px-6 py-6 flex-1"
                >
                  Browse Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showQuiz && <PropertyQuiz mode="fullscreen" onClose={() => setShowQuiz(false)} />}
    </div>
  );
};

export default HeroSection;
