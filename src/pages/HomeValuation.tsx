
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, CheckCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { PropertyDetails, triggerValuationWebhook } from '@/utils/valuationUtils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zip: z.string().length(5, {
    message: "ZIP code must be 5 digits.",
  }),
  sqft: z.string().min(3, {
    message: "Square footage must be at least 3 digits.",
  }),
  propertyType: z.string({
    required_error: "Please select a property type.",
  }),
  propertyCondition: z.string({
    required_error: "Please select the property condition.",
  }),
  isCornerLot: z.boolean().default(false),
  hasParkingLot: z.boolean().default(false),
  hasLoadingDock: z.boolean().default(false),
  recentRenovations: z.boolean().default(false),
});

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

const propertyConditions = [
  "Excellent",
  "Good",
  "Average",
  "Fair",
  "Poor"
];

const HomeValuation = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      city: "Abilene",
      state: "TX",
      zip: "",
      sqft: "",
      propertyType: "Office",
      propertyCondition: "Good",
      isCornerLot: false,
      hasParkingLot: false,
      hasLoadingDock: false,
      recentRenovations: false,
    },
  });

  const handleAddressSelect = (address: string) => {
    form.setValue("address", address);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    try {
      // Convert form values to property details
      const propertyDetails: PropertyDetails = {
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        sqft: parseInt(values.sqft),
        propertyType: values.propertyType,
        propertyCondition: values.propertyCondition,
        isCornerLot: values.isCornerLot,
        hasParkingLot: values.hasParkingLot,
        hasLoadingDock: values.hasLoadingDock,
        recentRenovations: values.recentRenovations,
      };
      
      // Trigger the webhook with property details
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
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Valuation Request Submitted</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your valuation request. One of our commercial real estate experts 
                  will analyze your property details and contact you shortly with a 
                  comprehensive valuation report.
                </p>
                <Button 
                  onClick={() => {
                    setSubmitted(false);
                    form.reset();
                  }}
                  className="bg-estate-blue hover:bg-estate-dark-blue"
                >
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Building className="h-5 w-5 text-estate-blue mr-2" />
                      Property Location
                    </h2>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <AddressAutocomplete 
                              onAddressSelect={handleAddressSelect}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                  
                  <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Building className="h-5 w-5 text-estate-blue mr-2" />
                      Property Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
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
                        control={form.control}
                        name="propertyCondition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Condition</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {propertyConditions.map((condition) => (
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
                    
                    <FormField
                      control={form.control}
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
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Building className="h-5 w-5 text-estate-blue mr-2" />
                      Features & Amenities
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-estate-blue hover:bg-estate-dark-blue"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Request Valuation"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
          
          <div className="w-full lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Why Request a Valuation?</CardTitle>
                <CardDescription>
                  Our expert valuation provides crucial insights for property owners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Professional Assessment</h3>
                  <p className="text-sm text-gray-500">
                    Get a professional evaluation based on current market conditions and property features.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Informed Decisions</h3>
                  <p className="text-sm text-gray-500">
                    Make better business decisions with accurate property valuations from experienced agents.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Selling or Leasing</h3>
                  <p className="text-sm text-gray-500">
                    Determine optimal pricing strategy when selling or leasing your commercial property.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Insurance Purposes</h3>
                  <p className="text-sm text-gray-500">
                    Ensure your property is properly insured with an accurate valuation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeValuation;
