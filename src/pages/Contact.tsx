
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Phone, Calendar, MessageSquare, User, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useUser } from '@/contexts/UserContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits."
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters."
  }),
  preferredContactMethod: z.enum(["email", "phone", "either"], {
    required_error: "Please select a preferred contact method."
  })
});

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowingSubmitting, setIsShowingSubmitting] = useState(false);
  const [showingDate, setShowingDate] = useState("");
  const [showingTime, setShowingTime] = useState("");
  const [showingMessage, setShowingMessage] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user } = useUser();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredContactMethod: "either"
    }
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
      form.setValue('phone', user.phone || '');
    }
  }, [user, form]);

  async function sendToWebhook(formData: any) {
    try {
      const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook/51f17603-ea6a-4b27-abfb-b0106d76b5db";
      
      const queryParams = new URLSearchParams();
      queryParams.append('name', formData.name);
      queryParams.append('email', formData.email);
      queryParams.append('phone', formData.phone);
      queryParams.append('message', formData.message);
      queryParams.append('preferredContactMethod', formData.preferredContactMethod);
      queryParams.append('formType', formData.formType);
      queryParams.append('timestamp', formData.timestamp);
      
      const response = await fetch(`${webhookUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }
      
      console.log('Webhook response:', await response.text());
      return true;
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      throw error;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      const formData = {
        ...values,
        formType: "Contact Form",
        timestamp: new Date().toISOString()
      };
      
      console.log('Submitting contact form data:', formData);
      
      await sendToWebhook(formData);
      
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!"
      });
      
      form.reset();
      
      if (user) {
        form.setValue('name', user.name || '');
        form.setValue('email', user.email || '');
        form.setValue('phone', user.phone || '');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleRequestShowing = async () => {
    if (!user?.name && !user?.email && !showingDate && !showingTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsShowingSubmitting(true);
    
    try {
      const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook/42172b32-2eaf-48e9-a912-9229f59e21be";
      
      const queryParams = new URLSearchParams();
      queryParams.append('propertyId', "general-showing");
      queryParams.append('propertyStreet', "Office Visit");
      queryParams.append('propertyCity', "Abilene");
      queryParams.append('propertyPrice', "0");
      queryParams.append('date', showingDate);
      queryParams.append('time', showingTime);
      queryParams.append('name', user?.name || '');
      queryParams.append('email', user?.email || '');
      queryParams.append('phone', user?.phone || '');
      queryParams.append('message', showingMessage || '');
      
      const response = await fetch(`${webhookUrl}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      toast({
        title: "Showing request sent",
        description: `An agent will contact you soon to confirm your showing on ${showingDate} at ${showingTime}.`,
      });
      
      setShowingDate("");
      setShowingTime("");
      setShowingMessage("");
      setIsSheetOpen(false);
      
    } catch (error) {
      console.error("Error sending showing request to webhook:", error);
      toast({
        title: "Error sending request",
        description: "There was a problem submitting your showing request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsShowingSubmitting(false);
    }
  };

  return <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Contact Our Agent</h1>
          <p className="mt-4 text-lg text-gray-600">
            Have questions about buying or selling a home? Our experienced agent is here to help.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <User className="h-5 w-5 text-gray-400 mr-2 mt-3" />
                            <Input placeholder="John Doe" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Mail className="h-5 w-5 text-gray-400 mr-2 mt-3" />
                              <Input placeholder="you@example.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={form.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Phone className="h-5 w-5 text-gray-400 mr-2 mt-3" />
                              <Input placeholder="(555) 123-4567" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  
                  <FormField control={form.control} name="message" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-1" />
                            <Textarea placeholder="I'm interested in learning more about properties in the Abilene area..." className="min-h-32" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="preferredContactMethod" render={({
                  field
                }) => <FormItem className="space-y-3">
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="radio" className="h-4 w-4 text-estate-blue" checked={field.value === "email"} onChange={() => field.onChange("email")} />
                              <span>Email</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="radio" className="h-4 w-4 text-estate-blue" checked={field.value === "phone"} onChange={() => field.onChange("phone")} />
                              <span>Phone</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input type="radio" className="h-4 w-4 text-estate-blue" checked={field.value === "either"} onChange={() => field.onChange("either")} />
                              <span>Either</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-estate-blue hover:bg-estate-dark-blue"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Meet Your Agent</h2>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img alt="Josh Rader" className="w-32 h-32 object-cover rounded-full" src="/lovable-uploads/a4c82100-4d68-4bc5-9bbb-772c16042215.png" />
                <div>
                  <h3 className="text-lg font-semibold">Josh Rader</h3>
                  <p className="text-gray-600">Licensed Real Estate Agent</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-estate-blue mr-2" />
                      <span>(325) 665-9244</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-estate-blue mr-2" />
                      <span>Josh.Rader@McCullerProperties.com</span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">
                    With over 10 years of experience in the Abilene commercial real estate market, 
                    Josh specializes in helping businesses find the perfect location for growth and success. 
                    From retail spaces to office buildings, his expertise ensures you find the ideal 
                    commercial property to meet your business needs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-estate-blue mr-2" />
                Schedule a Showing
              </h2>
              
              <p className="text-gray-600 mb-4">
                Want to see a property in person? Schedule a showing with Josh at your convenience.
              </p>
              
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button 
                    className="w-full"
                    variant="pulse"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Request Showing
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Request a Showing</SheetTitle>
                    <SheetDescription>
                      Fill out the form below to schedule a showing.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="date" className="text-sm font-medium">
                          Preferred Date*
                        </label>
                        <input
                          id="date"
                          type="date"
                          value={showingDate}
                          onChange={(e) => setShowingDate(e.target.value)}
                          className="w-full p-2 border rounded-md mt-1"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor="time" className="text-sm font-medium">
                          Preferred Time*
                        </label>
                        <input
                          id="time"
                          type="time"
                          value={showingTime}
                          onChange={(e) => setShowingTime(e.target.value)}
                          className="w-full p-2 border rounded-md mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          value={showingMessage}
                          onChange={(e) => setShowingMessage(e.target.value)}
                          className="w-full mt-1"
                          placeholder="Add any additional information or questions..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleRequestShowing}
                      disabled={isShowingSubmitting}
                    >
                      {isShowingSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Office Hours</h3>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>By Appointment</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">
                  Our office is located at 1234 Main Street, Suite 100, Abilene, TX 79601. Feel free to stop by during business hours!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};

export default Contact;
