
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
import { Building, DollarSign, BarChart2, AreaChart, Share2, Info, Clock, PieChart } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { GoogleAddressData } from '@/lib/utils';
import { PropertyDetails, ValuationResult, calculatePropertyValuation } from '@/utils/valuationUtils';

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
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [addressData, setAddressData] = useState<GoogleAddressData | null>(null);

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

  const handleAddressSelect = (data: GoogleAddressData | null) => {
    if (!data) return;
    
    setAddressData(data);
    
    form.setValue("address", data.formattedAddress);
    
    if (data.locality) {
      form.setValue("city", data.locality);
    }
    
    if (data.administrativeAreaLevel1) {
      form.setValue("state", data.administrativeAreaLevel1);
    }
    
    if (data.postalCode) {
      form.setValue("zip", data.postalCode);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setValuationResult(null);
    
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
      
      // Calculate valuation
      const result = await calculatePropertyValuation(propertyDetails);
      setValuationResult(result);
      
      toast({
        title: "Valuation Complete",
        description: "Your commercial property valuation has been calculated.",
      });
    } catch (error) {
      console.error("Valuation error:", error);
      toast({
        title: "Valuation Error",
        description: "There was an error calculating your property's value. Please try again.",
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
            Get an accurate estimate of your commercial property's value based on detailed property information and recent market trends.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
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
                              Property includes a parking lot
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
                              Property has a loading dock
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
                              Major renovations in past 5 years
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
                  {loading ? "Calculating..." : "Get Commercial Property Valuation"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            {valuationResult ? (
              <div className="space-y-6">
                <Card className="bg-white shadow-md border-t-4 border-t-estate-blue">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <DollarSign className="h-5 w-5 text-estate-blue mr-2" />
                      Estimated Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-estate-blue mb-2">
                      ${valuationResult.estimatedValue.toLocaleString()}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Range: ${valuationResult.valueRange.low.toLocaleString()} - ${valuationResult.valueRange.high.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-3">
                      <PieChart className="h-4 w-4 text-estate-blue mr-2" />
                      <span className="text-sm text-gray-600">
                        {valuationResult.confidenceScore}% confidence score
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <BarChart2 className="h-5 w-5 text-estate-blue mr-2" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <AreaChart className="h-4 w-4 text-estate-blue mr-2" />
                        Annual Growth
                      </span>
                      <span className="font-medium text-estate-blue">
                        {valuationResult.marketTrends.annualGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 text-estate-blue mr-2" />
                        Avg. Days on Market
                      </span>
                      <span className="font-medium text-estate-blue">
                        {valuationResult.marketTrends.averageDaysOnMarket} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Share2 className="h-4 w-4 text-estate-blue mr-2" />
                        List to Sale Ratio
                      </span>
                      <span className="font-medium text-estate-blue">
                        {valuationResult.marketTrends.listToSaleRatio * 100}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Info className="h-4 w-4 text-estate-blue mr-2" />
                        Price per Sq. Ft.
                      </span>
                      <span className="font-medium text-estate-blue">
                        ${valuationResult.pricePerSqFt}/sqft
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Building className="h-4 w-4 text-estate-blue mr-2" />
                        Comparable Properties
                      </span>
                      <span className="font-medium text-estate-blue">
                        {valuationResult.comparableHomes} properties
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Request Professional Valuation
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Get a more detailed valuation from a local commercial real estate expert.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 text-estate-blue mr-2" />
                  Why Get a Commercial Valuation?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Understand your property's current market value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Make informed decisions about selling or leasing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Track your investment over time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    <span>Compare your property to others in the commercial market</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">
                    Note: This is an automated estimate and should not replace a professional appraisal or comparative market analysis by a licensed commercial real estate agent.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeValuation;
