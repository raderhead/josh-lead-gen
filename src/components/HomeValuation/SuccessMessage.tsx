
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  onReset: () => void;
}

const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  return (
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
        onClick={onReset}
        variant="estate"
      >
        Submit Another Request
      </Button>
    </div>
  );
};

export default SuccessMessage;
