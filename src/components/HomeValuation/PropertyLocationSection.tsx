
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Building } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { Control } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './formSchema';

type FormValues = z.infer<typeof formSchema>;

interface PropertyLocationSectionProps {
  control: Control<FormValues>;
  onAddressSelect: (address: string) => void;
}

const PropertyLocationSection = ({ control, onAddressSelect }: PropertyLocationSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Building className="h-5 w-5 text-estate-blue mr-2" />
        Property Location
      </h2>
      
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <AddressAutocomplete 
                onAddressSelect={onAddressSelect}
                placeholder="123 Main St"
                defaultValue={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input type="text" placeholder="79601" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PropertyLocationSection;
