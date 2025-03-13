
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Building, DollarSign, Home, MapPin, BarChart2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  zip: z.string().length(5, {
    message: "ZIP code must be 5 digits.",
  }),
  sqft: z.string().min(3, {
    message: "Square footage must be at least 3 digits.",
  }),
  bedrooms: z.string().min(1, {
    message: "Number of bedrooms is required.",
  }),
  bathrooms: z.string().min(1, {
    message: "Number of bathrooms is required.",
  }),
  yearBuilt: z.string().min(4, {
    message: "Year built must be 4 digits.",
  }),
});

const HomeValuation = () => {
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      city: "Abilene",
      zip: "",
      sqft: "",
      bedrooms: "",
      bathrooms: "",
      yearBuilt: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Simple valuation algorithm (this would typically be a backend call or more complex algorithm)
      const baseValue = 100000;
      const sqftValue = parseInt(values.sqft) * 100;
      const bedroomValue = parseInt(values.bedrooms) * 15000;
      const bathroomValue = parseInt(values.bathrooms) * 10000;
      const yearValue = (2024 - parseInt(values.yearBuilt)) * 500;
      
      const calculatedValue = baseValue + sqftValue + bedroomValue + bathroomValue - yearValue;
      setEstimatedValue(calculatedValue);
      setLoading(false);
      
      toast({
        title: "Valuation Complete",
        description: "Your home valuation has been calculated.",
      });
    }, 1500);
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Home Valuation</h1>
          <p className="mt-4 text-lg text-gray-600">
            Get an estimate of your home's value based on recent market trends in Abilene.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-3" />
                          <Input placeholder="123 Main St" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Building className="h-5 w-5 text-gray-400 mr-2 mt-3" />
                            <Input {...field} />
                          </div>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="yearBuilt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-estate-blue hover:bg-estate-dark-blue"
                  disabled={loading}
                >
                  {loading ? "Calculating..." : "Get Home Valuation"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            {estimatedValue ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 text-estate-blue mr-2" />
                  Estimated Value
                </h2>
                <div className="text-3xl font-bold text-estate-blue mb-2">
                  ${estimatedValue.toLocaleString()}
                </div>
                <p className="text-gray-600 mb-4">
                  This estimate is based on recent sales in the Abilene area and the information you provided.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <BarChart2 className="h-5 w-5 text-estate-blue mr-2" />
                    Market Insights
                  </h3>
                  <p className="text-gray-600 mb-2">
                    • Abilene home values have increased 5.2% over the past year
                  </p>
                  <p className="text-gray-600 mb-2">
                    • Average time on market: 32 days
                  </p>
                  <p className="text-gray-600">
                    • Homes in your area sell for 97% of list price on average
                  </p>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Request Professional Valuation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Home className="h-5 w-5 text-estate-blue mr-2" />
                  Why Get a Valuation?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Understand your home's current market value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Make informed decisions about selling or refinancing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Track your investment over time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-estate-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    <span>Compare your home to others in the neighborhood</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">
                    Note: This is an automated estimate and should not replace a professional appraisal or comparative market analysis by a licensed real estate agent.
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
