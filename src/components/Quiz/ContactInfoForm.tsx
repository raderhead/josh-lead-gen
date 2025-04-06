
import React from 'react';
import { Input } from '@/components/ui/input';

interface ContactInfoFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ 
  name, setName, email, setEmail, phone, setPhone 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-lg font-medium">Your Name</label>
        <Input 
          id="name" 
          placeholder="John Doe" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="text-lg py-6 px-5"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-lg font-medium">Email Address</label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="text-lg py-6 px-5"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-lg font-medium">Phone Number</label>
        <Input 
          id="phone" 
          placeholder="(555) 123-4567" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          className="text-lg py-6 px-5"
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
