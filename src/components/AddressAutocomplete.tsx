
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { GoogleAddressData } from '@/lib/utils';

interface AddressAutocompleteProps {
  onAddressSelect: (address: GoogleAddressData | null) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

const AddressAutocomplete = ({
  onAddressSelect,
  placeholder = "Enter your address",
  defaultValue = "",
  className
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  
  useEffect(() => {
    if (!inputRef.current) return;
    
    // Initialize Google Places Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'formatted_address', 'geometry'],
      types: ['address']
    });
    
    // Add listener for place selection
    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place || !place.address_components) {
        onAddressSelect(null);
        return;
      }
      
      // Parse address components
      const addressData: GoogleAddressData = {
        formattedAddress: place.formatted_address || '',
        streetNumber: '',
        route: '',
        locality: '',
        administrativeAreaLevel1: '',
        postalCode: '',
        country: '',
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0
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
      
      onAddressSelect(addressData);
    });
    
    // Cleanup
    return () => {
      google.maps.event.clearInstanceListeners(autocompleteRef.current as any);
    };
  }, [onAddressSelect]);
  
  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={className}
      autoComplete="off"
    />
  );
};

export default AddressAutocomplete;
