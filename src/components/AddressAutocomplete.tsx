
import React from 'react';
import { Input } from '@/components/ui/input';

interface AddressAutocompleteProps {
  onAddressSelect: (address: string) => void;
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onAddressSelect(value);
  };
  
  return (
    <Input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={handleInputChange}
      className={`text-gray-800 dark:text-white ${className || ''}`}
      autoComplete="off"
    />
  );
};

export default AddressAutocomplete;
