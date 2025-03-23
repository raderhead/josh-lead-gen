import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { GoogleAddressData } from '@/lib/utils';
import { toast } from "@/components/ui/use-toast";

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
  const [apiError, setApiError] = useState(false);
  
  useEffect(() => {
    if (!inputRef.current) return;
    
    try {
      // Initialize Google Places Autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry'],
        types: ['address']
      });
      
      // Add listener for place selection
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        try {
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
        } catch (error) {
          console.error("Error processing place selection:", error);
          setApiError(true);
        }
      });
      
      // Handle API initialization errors
      window.gm_authFailure = () => {
        console.error("Google Maps API authentication failed");
        setApiError(true);
        toast({
          title: "Google Maps API Error",
          description: "Unable to load address autocomplete. Please enter your address manually.",
          variant: "destructive"
        });
      };
      
      // Cleanup
      return () => {
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
        // Reset the global error handler
        if (window.gm_authFailure) {
          window.gm_authFailure = undefined;
        }
      };
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
      setApiError(true);
      toast({
        title: "Address Autocomplete Error",
        description: "Unable to initialize autocomplete. Please enter your address manually.",
        variant: "destructive"
      });
    }
  }, [onAddressSelect]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If we have an API error but the user is typing, we still want to capture their manual input
    if (apiError && value) {
      const manualAddress: GoogleAddressData = {
        formattedAddress: value,
        streetNumber: '',
        route: '',
        locality: '',
        administrativeAreaLevel1: '',
        postalCode: '',
        country: '',
        lat: 0,
        lng: 0
      };
      onAddressSelect(manualAddress);
    }
  };
  
  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className={className}
        autoComplete="off"
      />
      {apiError && (
        <p className="text-sm text-amber-600 mt-1">
          Address autocomplete unavailable. Please enter your address manually.
        </p>
      )}
    </>
  );
};

export default AddressAutocomplete;
