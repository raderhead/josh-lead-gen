import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface PropertySearchInputProps {
  placeholder?: string;
  className?: string;
  onAddressSelected?: (address: {
    formattedAddress: string;
    streetNumber: string;
    route: string;
    locality: string;
    administrativeAreaLevel1: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
  onSearch?: (term: string) => void; // Added the missing onSearch prop
}
const PropertySearchInput: React.FC<PropertySearchInputProps> = ({
  placeholder = "Enter an address, city, or zip code",
  className = "",
  onAddressSelected,
  onSearch // Add this to the destructured props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    // Call onSearch if it's provided
    if (onSearch) {
      onSearch(newAddress);
    }
  };
  const handleAddressSubmit = () => {
    if (!address.trim()) return;

    // Create a simple mock address object with the entered address
    const addressData = {
      formattedAddress: address,
      streetNumber: '',
      route: '',
      locality: '',
      administrativeAreaLevel1: '',
      postalCode: '',
      country: '',
      lat: 0,
      lng: 0
    };
    if (onAddressSelected) {
      onAddressSelected(addressData);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddressSubmit();
      navigate(`/properties?search=${encodeURIComponent(address)}`);
    }
  };
  const handleBlur = () => {
    if (address.trim()) {
      handleAddressSubmit();
    }
  };
  return <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        <MapPin size={20} />
      </div>
      
    </div>;
};
export default PropertySearchInput;