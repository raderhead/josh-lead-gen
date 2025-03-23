
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from '@/components/Layout/Layout';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PropertyDetails, triggerValuationWebhook } from '@/utils/valuationUtils';
import { toast } from "@/hooks/use-toast";
import { formSchema } from '@/components/HomeValuation/formSchema';
import ValuationForm from '@/components/HomeValuation/ValuationForm';
import SuccessMessage from '@/components/HomeValuation/SuccessMessage';
import ValuationSidebar from '@/components/HomeValuation/ValuationSidebar';

const propertyTypes = [
  "Office",
  "Retail",
  "Industrial",
  "Mixed-Use",
  "Warehouse",
  "Restaurant",
  "Medical",
  "Hotel/Motel",
  "Land",
  "Other"
];

const commercialConditions = [
  "Excellent",
  "Good",
  "Average",
  "Fair",
  "Poor"
];

const landConditions = [
  "Wooded",
  "Cleared",
  "Partially Cleared",
  "Rocky",
  "Wetland",
  "Flat",
  "Sloped",
  "Hillside"
];

const HomeValuation = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Contact information
      name: "",
      email: "",
      phone: "",
      // Property information
      address: "",
      city: "Abilene",
      state: "TX",
      zip: "",
      sqft: "",
      propertyType: "Office",
      propertyCondition: "Good",
      acres: "",
      // Commercial property features
      isCornerLot: false,
      hasParkingLot: false,
      hasLoadingDock: false,
      recentRenovations: false,
      // Land-specific features
      hasWater: false,
      hasRoad: false,
      isLevelLot: false,
      hasMountainView: false,
    },
  });

  const propertyType = form.watch("propertyType");
  const isLandProperty = propertyType === "Land";
  
  React.useEffect(() => {
    if (isLandProperty && commercialConditions.includes(form.getValues("propertyCondition"))) {
      form.setValue("propertyCondition", landConditions[0]);
    } else if (!isLandProperty && landConditions.includes(form.getValues("propertyCondition"))) {
      form.setValue("propertyCondition", commercialConditions[0]);
    }
  }, [isLandProperty, form]);

  const handleAddressSelect = (address: string) => {
    form.setValue("address", address);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    setLoading(true);
    
    try {
      const propertyDetails: PropertyDetails = {
        name: values.name,
        email: values.email, 
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        sqft: isLandProperty ? 0 : parseInt(values.sqft || "0"),
        propertyType: values.propertyType,
        propertyCondition: values.propertyCondition,
        isCornerLot: values.isCornerLot,
        hasParkingLot: values.hasParkingLot,
        hasLoadingDock: values.hasLoadingDock,
        recentRenovations: values.recentRenovations,
        acres: values.acres,
      };
      
      if (isLandProperty) {
        propertyDetails.hasWater = values.hasWater;
        propertyDetails.hasRoad = values.hasRoad;
        propertyDetails.isLevelLot = values.isLevelLot;
        propertyDetails.hasMountainView = values.hasMountainView;
      }
      
      console.log("Calling triggerValuationWebhook with:", propertyDetails);
      await triggerValuationWebhook(propertyDetails);
      setSubmitted(true);
      
    } catch (error) {
      console.error("Valuation request error:", error);
      toast({
        title: "Valuation Request Error",
        description: "There was an error submitting your property valuation request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }
  
  const handleReset = () => {
    setSubmitted(false);
    form.reset();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Commercial Property Valuation</h1>
          <p className="mt-4 text-lg text-gray-600">
            Request a detailed valuation of your commercial property from our expert real estate agents.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
            {submitted ? (
              <SuccessMessage onReset={handleReset} />
            ) : (
              <ValuationForm 
                form={form}
                onSubmit={onSubmit}
                loading={loading}
                propertyType={propertyType}
                handleAddressSelect={handleAddressSelect}
                propertyTypes={propertyTypes}
                commercialConditions={commercialConditions}
                landConditions={landConditions}
              />
            )}
          </div>
          
          <div className="w-full lg:w-1/3">
            <ValuationSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeValuation;
