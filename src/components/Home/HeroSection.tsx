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
  return <>
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 h-[600px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/lovable-uploads/9478e2e8-6d1a-48e4-b7c3-2e60e9022800.png" alt="Abilene skyline" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"> Commercial Property in Abilene</h1>
          
          
          <div className="max-w-3xl mx-auto mb-12">
            
          </div>
          
          {/* Quiz CTA - Prominent Call to Action */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-3xl mx-auto mb-8 transform hover:scale-[1.01] transition-transform border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-3 justify-center">
              <MessageSquare size={28} className="text-estate-blue" />
              <h2 className="text-2xl font-bold text-white">Find Your Perfect Commercial Property</h2>
            </div>
            <p className="text-lg text-white/80 mb-6">
              Help us understand your needs better. Take our quick questionnaire to give our agent insights into what you're looking for.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/property-quiz')} size="xl" className="bg-estate-blue hover:bg-estate-dark-blue text-lg px-10 py-7 shadow-lg">
                <MessageSquare className="mr-2" />
                Take Our Commercial Property Questionnaire
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 flex items-center gap-2 text-lg py-6 px-8" onClick={() => navigate('/properties')}>
              <Building size={20} />
              Browse Properties
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 flex items-center gap-2 text-lg py-6 px-8" onClick={() => navigate('/valuation')}>
              <DollarSign size={20} />
              Property Valuation
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 flex items-center gap-2 text-lg py-6 px-8" onClick={() => navigate('/contact')}>
              <MapPin size={20} />
              Contact Agent
            </Button>
          </div>
        </div>
      </div>
      
      {showQuiz && <PropertyQuiz mode="fullscreen" onClose={() => setShowQuiz(false)} />}
    </>;
};
export default HeroSection;