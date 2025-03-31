
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from 'lucide-react';

type QuizStep = {
  id: number;
  question: string;
  description?: string;
  type: 'text' | 'select' | 'checkbox' | 'radio' | 'range';
  options?: string[];
  placeholder?: string;
};

const quizSteps: QuizStep[] = [
  {
    id: 1,
    question: "What other areas are you considering besides Abilene?",
    description: "Select all areas you're interested in",
    type: 'checkbox',
    options: ['San Angelo', 'Lubbock', 'San Antonio', 'Dallas/Fort Worth', 'Austin', 'Midland/Odessa', 'Not considering other areas', 'Other']
  },
  {
    id: 2,
    question: "What features are you looking for in a commercial property?",
    description: "Select all that apply",
    type: 'checkbox',
    options: ['High visibility', 'Ample parking', 'Loading dock', 'Open floor plan', 'Multiple offices', 'Reception area', 'Kitchen/break room', 'Conference rooms', 'Storage space', 'Energy efficient']
  },
  {
    id: 3,
    question: "What is a comfortable price range?",
    type: 'select',
    options: ['Under $200,000', '$200,000 - $500,000', '$500,000 - $1,000,000', '$1,000,000 - $2,000,000', '$2,000,000 - $5,000,000', 'Over $5,000,000']
  },
  {
    id: 4,
    question: "When are you looking to make your investment?",
    type: 'radio',
    options: ['Immediately (0-3 months)', 'Soon (3-6 months)', 'This year (6-12 months)', 'Just exploring (>12 months)']
  },
  {
    id: 5,
    question: "Are you a first-time investor, an experienced buyer, or a business owner?",
    type: 'radio',
    options: ['First-time investor', 'Experienced buyer', 'Business owner', 'Other']
  },
  {
    id: 6,
    question: "Do you need to sell a property first?",
    type: 'radio',
    options: ['Yes', 'No', 'Not sure yet']
  }
];

const BuyerQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  
  // Prefill contact information when user is logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user, isOpen]);
  
  const handleNext = () => {
    if (currentStep < quizSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleCheckboxChange = (questionId: number, option: string) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (currentAnswers.includes(option)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((item: string) => item !== option)
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentAnswers, option]
        };
      }
    });
  };
  
  const isCheckboxSelected = (questionId: number, option: string) => {
    return (answers[questionId] || []).includes(option);
  };
  
  const sendToWebhook = async (formData: any) => {
    try {
      const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/1b0f7b13-ae37-436b-8aae-fb9ed0a07b32";
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
  };
  
  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      toast({
        title: "Missing Information",
        description: "Please provide your name, email, and phone number.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
        const question = quizSteps.find(step => step.id === Number(questionId));
        return {
          question: question?.question,
          answer: Array.isArray(answer) ? answer.join(", ") : answer
        };
      });
      
      const formData = {
        name,
        email,
        phone,
        formType: "Commercial Property Questionnaire",
        answers: formattedAnswers,
        timestamp: new Date().toISOString()
      };
      
      console.log('Submitting quiz data:', formData);
      
      // Send data to webhook
      await sendToWebhook(formData);
      
      // If webhook succeeds, reset form and show success message
      setCurrentStep(0);
      setAnswers({});
      
      // Don't reset user info since they might want to fill out another form
      if (!user) {
        setName('');
        setEmail('');
        setPhone('');
      }
      
      toast({
        title: "Thank You!",
        description: "Your preferences have been submitted. Our agent will contact you soon."
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (currentStep === quizSteps.length) {
      return (
        <>
          <CardHeader>
            <CardTitle>Almost Done!</CardTitle>
            <CardDescription>
              Please provide your contact information so our agent can get in touch with you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
              <Input 
                id="phone" 
                placeholder="(555) 123-4567" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={isSubmitting}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </CardFooter>
        </>
      );
    }

    const currentQuestion = quizSteps[currentStep];
    
    return (
      <>
        <CardHeader>
          <CardTitle>Question {currentStep + 1} of {quizSteps.length}</CardTitle>
          <CardDescription>
            {currentQuestion.question}
            {currentQuestion.description && (
              <p className="mt-2 text-sm">{currentQuestion.description}</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'text' && (
            <Input
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            />
          )}
          
          {currentQuestion.type === 'select' && (
            <Select
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {currentQuestion.type === 'checkbox' && (
            <div className="grid grid-cols-1 gap-2">
              {currentQuestion.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`checkbox-${currentQuestion.id}-${option}`}
                    checked={isCheckboxSelected(currentQuestion.id, option)}
                    onCheckedChange={() => handleCheckboxChange(currentQuestion.id, option)}
                  />
                  <label
                    htmlFor={`checkbox-${currentQuestion.id}-${option}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'radio' && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
            >
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`radio-${currentQuestion.id}-${option}`} />
                    <label
                      htmlFor={`radio-${currentQuestion.id}-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentQuestion.type !== 'checkbox' && !answers[currentQuestion.id]}
          >
            {currentStep === quizSteps.length - 1 ? 'Continue' : 'Next'}
          </Button>
        </CardFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-estate-blue hover:bg-estate-dark-blue">
          Take Our Commercial Property Questionnaire
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Card className="border-0 shadow-none">
          {renderQuestion()}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerQuiz;
