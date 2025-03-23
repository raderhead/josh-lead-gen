
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import { TreePine } from 'lucide-react';
import { Control } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './formSchema';

type FormValues = z.infer<typeof formSchema>;

interface LandFeaturesSectionProps {
  control: Control<FormValues>;
}

const LandFeaturesSection = ({ control }: LandFeaturesSectionProps) => {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-semibold flex items-center">
        <TreePine className="h-5 w-5 text-estate-blue mr-2" />
        Land Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="hasWater"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Water Access</FormLabel>
                <FormDescription>
                  Property has access to water (stream, river, or lake)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="hasRoad"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Road Access</FormLabel>
                <FormDescription>
                  Property has direct access to a paved road
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="isLevelLot"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Level Lot</FormLabel>
                <FormDescription>
                  Property is primarily flat and level
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="hasMountainView"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Mountain View</FormLabel>
                <FormDescription>
                  Property has scenic mountain or hill views
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LandFeaturesSection;
