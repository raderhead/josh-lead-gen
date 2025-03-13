
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

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
}

const PropertySearchInput: React.FC<PropertySearchInputProps> = ({
  placeholder = "Enter an address, city, or zip code",
  className = "",
  onAddressSelected
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (typeof window.google === 'undefined' || 
        typeof window.google.maps === 'undefined' || 
        typeof window.google.maps.places === 'undefined') {
      console.error('Google Maps API not loaded. Check your API key.');
      toast({
        title: "Google Maps API not loaded",
        description: "Please check your API key configuration.",
        variant: "destructive"
      });
      return;
    }

    // Initialize autocomplete if input is available
    if (inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      });

      // Add listener for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        if (!autocompleteRef.current) return;
        
        const place = autocompleteRef.current.getPlace();
        
        if (!place.geometry) {
          console.error('No location data available for this place');
          return;
        }

        setAddress(place.formatted_address || '');
        
        // Parse address components
        const addressData = {
          formattedAddress: place.formatted_address || '',
          streetNumber: '',
          route: '',
          locality: '',
          administrativeAreaLevel1: '',
          postalCode: '',
          country: '',
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0
        };

        // Extract address components
        place.address_components?.forEach(component => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            addressData.streetNumber = component.long_name;
          } else if (types.includes('route')) {
            addressData.route = component.long_name;
          } else if (types.includes('locality')) {
            addressData.locality = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            addressData.administrativeAreaLevel1 = component.short_name;
          } else if (types.includes('postal_code')) {
            addressData.postalCode = component.long_name;
          } else if (types.includes('country')) {
            addressData.country = component.long_name;
          }
        });

        // Call the callback if provided
        if (onAddressSelected) {
          onAddressSelected(addressData);
        }
      });
    }

    return () => {
      // Clean up by removing event listeners
      if (autocompleteRef.current && typeof window.google !== 'undefined') {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onAddressSelected]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/properties?search=${encodeURIComponent(address)}`);
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        <MapPin size={20} />
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`pl-12 ${className}`}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default PropertySearchInput;
