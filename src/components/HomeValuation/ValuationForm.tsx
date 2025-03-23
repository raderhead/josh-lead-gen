
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './formSchema';
import ContactInfoSection from './ContactInfoSection';
import PropertyLocationSection from './PropertyLocationSection';
import PropertyDetailsSection from './PropertyDetailsSection';
import CommercialFeaturesSection from './CommercialFeaturesSection';
import LandFeaturesSection from './LandFeaturesSection';

type FormValues = z.infer<typeof formSchema>;

interface ValuationFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  loading: boolean;
  propertyType: string;
  handleAddressSelect: (address: string) => void;
  propertyTypes: string[];
  commercialConditions: string[];
  landConditions: string[];
}

const ValuationForm = ({ 
  form, 
  onSubmit, 
  loading, 
  propertyType,
  handleAddressSelect,
  propertyTypes,
  commercialConditions,
  landConditions
}: ValuationFormProps) => {
  const isLandProperty = propertyType === "Land";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ContactInfoSection control={form.control} />
        
        <PropertyLocationSection 
          control={form.control} 
          onAddressSelect={handleAddressSelect} 
        />
        
        <PropertyDetailsSection 
          control={form.control}
          propertyType={propertyType}
          propertyTypes={propertyTypes}
          commercialConditions={commercialConditions}
          landConditions={landConditions}
        />
        
        {!isLandProperty && (
          <CommercialFeaturesSection control={form.control} />
        )}
        
        {isLandProperty && (
          <LandFeaturesSection control={form.control} />
        )}
        
        <Button 
          type="submit" 
          variant="estate"
          size="xl"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Request Valuation"}
        </Button>
      </form>
    </Form>
  );
};

export default ValuationForm;
