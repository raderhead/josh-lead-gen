
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Building } from 'lucide-react';
import PropertySearchInput from '@/components/Property/PropertySearchInput';

const HeroSection = () => {
  const navigate = useNavigate();
  const [addressData, setAddressData] = useState<any>(null);
  
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
      </div>
    </div>
  );
};

export default HeroSection;
