
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import { Building } from 'lucide-react';
import { Control } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './formSchema';

type FormValues = z.infer<typeof formSchema>;

interface CommercialFeaturesSectionProps {
  control: Control<FormValues>;
}

const CommercialFeaturesSection = ({ control }: CommercialFeaturesSectionProps) => {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Building className="h-5 w-5 text-estate-blue mr-2" />
        Commercial Features & Amenities
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="isCornerLot"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Corner Lot</FormLabel>
                <FormDescription>
                  Property is located on a corner lot
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="hasParkingLot"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Parking Lot</FormLabel>
                <FormDescription>
                  Property includes a dedicated parking lot
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="hasLoadingDock"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Loading Dock</FormLabel>
                <FormDescription>
                  Property has a loading dock for deliveries
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="recentRenovations"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Recent Renovations</FormLabel>
                <FormDescription>
                  Property has been renovated in the last 5 years
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CommercialFeaturesSection;
