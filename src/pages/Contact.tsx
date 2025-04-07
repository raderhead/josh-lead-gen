
import React from 'react';
import { Mail, Phone, MapPin, Clock, BriefcaseBusiness } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://hooks.zapier.com/hooks/catch/123456/abcdef/', {
        method: 'POST',
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        toast({
          title: "Message sent",
          description: "We've received your message and will get back to you soon.",
        });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        toast({
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p>(325) 555-1234</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>info@abilenecommercialproperties.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p>1234 Main Street, Suite 100</p>
                  <p>Abilene, TX 79601</p>
                </div>
              </div>
              <div className="flex items-start">
                <BriefcaseBusiness className="h-5 w-5 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Commercial Inquiries</h3>
                  <p>commercial@abilenecommercialproperties.com</p>
                  <p>(325) 555-5678</p>
                </div>
              </div>
            </div>
            
            <Card className="mt-8 p-6">
              <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>By Appointment</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Our office is located at 1234 Main Street, Suite 100, Abilene, TX 79601. Feel
                  free to stop by during business hours!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
