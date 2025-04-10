
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from 'lucide-react';
import { Control } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './formSchema';

type FormValues = z.infer<typeof formSchema>;

interface PropertyDetailsSectionProps {
  control: Control<FormValues>;
  propertyType: string;
  propertyTypes: string[];
  commercialConditions: string[];
  landConditions: string[];
}

const PropertyDetailsSection = ({ 
  control, 
  propertyType, 
  propertyTypes,
  commercialConditions,
  landConditions
}: PropertyDetailsSectionProps) => {
  const isLandProperty = propertyType === "Land";

  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Building className="h-5 w-5 text-estate-blue mr-2" />
        Property Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="propertyCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Condition</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLandProperty ? landConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  )) : commercialConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {!isLandProperty && (
        <FormField
          control={control}
          name="sqft"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Square Footage</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {isLandProperty && (
        <FormField
          control={control}
          name="acres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Land Size (acres)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="2.5" 
                  step="0.01"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Please specify the size of the land in acres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default PropertyDetailsSection;
