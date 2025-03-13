
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MapPin, DollarSign } from 'lucide-react';
import PropertySearchInput from '@/components/Property/PropertySearchInput';

const HeroSection = () => {
  const navigate = useNavigate();
  const [addressData, setAddressData] = useState<any>(null);

  const handleAddressSelected = (data: any) => {
    setAddressData(data);
    // You can optionally navigate here or store the data
  };

  return (
    <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 h-[600px] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470" 
          alt="Modern luxury home" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Find Your Dream Home in Abilene
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Search the most complete source of homes for sale & real estate near you
        </p>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
            <PropertySearchInput 
              className="flex-grow border-none focus:ring-0 text-lg py-4"
              onAddressSelected={handleAddressSelected}
            />
            <Button 
              type="button" 
              className="m-1 bg-estate-blue hover:bg-estate-dark-blue text-lg px-6 py-6"
              onClick={() => navigate(`/properties${addressData ? `?search=${encodeURIComponent(addressData.formattedAddress)}` : ''}`)}
            >
              Search
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Button 
            variant="outline" 
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 flex items-center gap-2 text-lg py-6 px-8"
            onClick={() => navigate('/properties')}
          >
            <Home size={20} />
            Browse Properties
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 flex items-center gap-2 text-lg py-6 px-8"
            onClick={() => navigate('/valuation')}
          >
            <DollarSign size={20} />
            Home Valuation
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 flex items-center gap-2 text-lg py-6 px-8"
            onClick={() => navigate('/contact')}
          >
            <MapPin size={20} />
            Contact Agent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
