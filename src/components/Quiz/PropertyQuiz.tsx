
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
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Loader2, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";

type QuizQuestionType = 'text' | 'select' | 'checkbox' | 'radio' | 'range';

type QuizQuestion = {
  id: number;
  question: string;
  description?: string;
  type: QuizQuestionType;
  options?: string[];
  placeholder?: string;
  forUserType: 'buyer' | 'seller' | 'both';
};

const initialQuestions: QuizQuestion[] = [
  {
    id: 0,
    question: "Are you looking to buy or sell commercial property?",
    type: 'radio',
    options: ['Buy', 'Sell'],
    forUserType: 'both'
  },
  // Buyer questions
  {
    id: 1,
    question: "What type of commercial property are you looking for?",
    description: "Select the property type that best fits your needs",
    type: 'radio',
    options: ['Office Space', 'Retail/Storefront', 'Industrial/Warehouse', 'Multi-family', 'Restaurant', 'Mixed-use', 'Land/Development', 'Other'],
    forUserType: 'buyer'
  },
  {
    id: 2,
    question: "What other areas are you considering besides Abilene?",
    description: "Select all that apply",
    type: 'checkbox',
    options: ['San Angelo', 'Lubbock', 'San Antonio', 'Dallas/Fort Worth', 'Austin', 'Midland/Odessa', 'Not considering other areas', 'Other'],
    forUserType: 'buyer'
  },
  {
    id: 3,
    question: "What is your approximate budget?",
    type: 'select',
    options: ['Under $200,000', '$200,000 - $500,000', '$500,000 - $1,000,000', '$1,000,000 - $2,000,000', '$2,000,000 - $5,000,000', 'Over $5,000,000'],
    forUserType: 'buyer'
  },
  {
    id: 4,
    question: "What is your preferred square footage?",
    type: 'select',
    options: ['Under 1,000 sq ft', '1,000 - 2,500 sq ft', '2,500 - 5,000 sq ft', '5,000 - 10,000 sq ft', '10,000 - 25,000 sq ft', 'Over 25,000 sq ft'],
    forUserType: 'buyer'
  },
  {
    id: 5,
    question: "What features are most important to you?",
    description: "Select all that apply",
    type: 'checkbox',
    options: ['High visibility location', 'Ample parking', 'Loading dock', 'Open floor plan', 'Multiple offices', 'Reception area', 'Kitchen/break room', 'Conference rooms', 'Storage space', 'Energy efficient'],
    forUserType: 'buyer'
  },
  {
    id: 6,
    question: "When are you looking to make your investment?",
    type: 'radio',
    options: ['Immediately (0-3 months)', 'Soon (3-6 months)', 'This year (6-12 months)', 'Just exploring (>12 months)'],
    forUserType: 'buyer'
  },
  {
    id: 7,
    question: "Are you a first-time investor, experienced buyer, or business owner?",
    type: 'radio',
    options: ['First-time investor', 'Experienced buyer', 'Business owner', 'Other'],
    forUserType: 'buyer'
  },
  // Seller questions
  {
    id: 8,
    question: "What type of commercial property are you selling?",
    type: 'radio',
    options: ['Office Space', 'Retail/Storefront', 'Industrial/Warehouse', 'Multi-family', 'Restaurant', 'Mixed-use', 'Land/Development', 'Other'],
    forUserType: 'seller'
  },
  {
    id: 9,
    question: "What is the approximate square footage of your property?",
    type: 'select',
    options: ['Under 1,000 sq ft', '1,000 - 2,500 sq ft', '2,500 - 5,000 sq ft', '5,000 - 10,000 sq ft', '10,000 - 25,000 sq ft', 'Over 25,000 sq ft'],
    forUserType: 'seller'
  },
  {
    id: 10,
    question: "How long have you owned the property?",
    type: 'radio',
    options: ['Less than 1 year', '1-5 years', '5-10 years', '10+ years'],
    forUserType: 'seller'
  },
  {
    id: 11,
    question: "What is your reason for selling?",
    type: 'radio',
    options: ['Upgrading to larger space', 'Downsizing', 'Relocating', 'Investment strategy', 'Retirement', 'Financial reasons', 'Other'],
    forUserType: 'seller'
  },
  {
    id: 12,
    question: "Is the property currently occupied?",
    type: 'radio',
    options: ['Yes, owner-occupied', 'Yes, tenant-occupied', 'No, vacant', 'Partially occupied'],
    forUserType: 'seller'
  },
  {
    id: 13,
    question: "Have you had the property appraised recently?",
    type: 'radio',
    options: ['Yes, within the last 6 months', 'Yes, within the last year', 'Yes, more than a year ago', 'No'],
    forUserType: 'seller'
  },
  {
    id: 14,
    question: "How soon are you looking to sell?",
    type: 'radio',
    options: ['Immediately', 'Within 3 months', 'Within 6 months', 'Within a year', 'Just exploring options'],
    forUserType: 'seller'
  },
];

type QuizMode = 'inline' | 'fullscreen';

interface PropertyQuizProps {
  mode?: QuizMode;
  onClose?: () => void;
  className?: string;
}

const PropertyQuiz: React.FC<PropertyQuizProps> = ({ mode = 'inline', onClose, className }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [userType, setUserType] = useState<'buyer' | 'seller' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);
  
  useEffect(() => {
    // Set user type based on first question answer
    if (answers[0] === 'Buy') {
      setUserType('buyer');
    } else if (answers[0] === 'Sell') {
      setUserType('seller');
    }
  }, [answers[0]]);

  useEffect(() => {
    // Calculate progress percentage
    if (userType === null) {
      setProgress(0);
    } else {
      const filteredQuestions = getFilteredQuestions();
      const totalQuestions = filteredQuestions.length;
      const answeredCount = currentQuestionIndex;
      setProgress((answeredCount / totalQuestions) * 100);
    }
  }, [currentQuestionIndex, userType]);

  const getFilteredQuestions = () => {
    // First question is always shown
    if (userType === null) {
      return [initialQuestions[0]];
    }
    
    // Filter questions based on user type
    return initialQuestions.filter(q => 
      q.forUserType === userType || q.forUserType === 'both'
    );
  };

  const getCurrentQuestion = () => {
    const filteredQuestions = getFilteredQuestions();
    return filteredQuestions[currentQuestionIndex];
  };
  
  const handleNext = () => {
    const filteredQuestions = getFilteredQuestions();
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to contact info
      setCurrentQuestionIndex(filteredQuestions.length);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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
  
  const isCheckboxSelected = (option: string) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return false;
    const currentAnswers = answers[currentQuestion.id] || [];
    return currentAnswers.includes(option);
  };
  
  const sendToWebhook = async (formData: any) => {
    try {
      const webhookUrl = "https://n8n-1-yvtq.onrender.com/webhook-test/4813340d-f86b-46d7-a82a-39db8631e043";
      
      const queryParams = new URLSearchParams();
      queryParams.append('data', JSON.stringify(formData));
      
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
      const filteredQuestions = getFilteredQuestions();
      
      const formattedAnswers = Object.entries(answers)
        .map(([questionIdStr, answer]) => {
          const questionId = Number(questionIdStr);
          const question = initialQuestions.find(q => q.id === questionId);
          
          if (!question) return null;
          
          return {
            question: question.question,
            answer: Array.isArray(answer) ? answer.join(", ") : answer
          };
        })
        .filter(Boolean);
      
      const formData = {
        name,
        email,
        phone,
        userType: answers[0] === 'Buy' ? 'Buyer' : 'Seller',
        formType: answers[0] === 'Buy' ? "Commercial Property Buyer Questionnaire" : "Commercial Property Seller Questionnaire",
        answers: formattedAnswers,
        timestamp: new Date().toISOString()
      };
      
      console.log('Submitting quiz data:', formData);
      
      await sendToWebhook(formData);
      
      setCurrentQuestionIndex(0);
      setAnswers({});
      setUserType(null);
      
      if (!user) {
        setName('');
        setEmail('');
        setPhone('');
      }
      
      toast({
        title: "Thank You!",
        description: "Your preferences have been submitted. Our agent will contact you soon."
      });
      
      if (onClose) {
        onClose();
      }
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
  
  const renderQuestionContent = () => {
    const currentQuestion = getCurrentQuestion();
    
    if (!currentQuestion) {
      // Render contact information form
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
    }
    
    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            className="text-lg py-6 px-5"
          />
        );
      
      case 'select':
        return (
          <Select
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
          >
            <SelectTrigger className="text-lg py-6">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {currentQuestion.options?.map((option) => (
                <SelectItem key={option} value={option} className="text-lg py-3">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3 bg-white/5 p-4 rounded-md hover:bg-white/10 transition-colors">
                <Checkbox
                  id={`checkbox-${currentQuestion.id}-${option}`}
                  checked={isCheckboxSelected(option)}
                  onCheckedChange={() => handleCheckboxChange(currentQuestion.id, option)}
                  className="h-5 w-5"
                />
                <label
                  htmlFor={`checkbox-${currentQuestion.id}-${option}`}
                  className="text-lg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
          >
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option) => (
                <div key={option} className="flex items-center space-x-3 bg-white/5 p-4 rounded-md hover:bg-white/10 transition-colors">
                  <RadioGroupItem value={option} id={`radio-${currentQuestion.id}-${option}`} className="h-5 w-5" />
                  <label
                    htmlFor={`radio-${currentQuestion.id}-${option}`}
                    className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
      
      default:
        return null;
    }
  };

  const canProceed = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) {
      // On contact info screen
      return !!name && !!email && !!phone;
    }
    
    if (currentQuestion.type === 'checkbox') {
      // For checkbox questions, allow proceeding if at least one option is selected
      return Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length > 0;
    }
    
    return !!answers[currentQuestion.id];
  };
  
  const filteredQuestions = getFilteredQuestions();
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length;
  const isContactInfoScreen = currentQuestionIndex >= filteredQuestions.length;

  // Full screen mode styling
  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-slate-900 to-estate-dark-blue z-50 overflow-y-auto">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          {/* Progress bar */}
          <div className="w-full max-w-4xl mb-4 bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-estate-blue h-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <Card className={cn("w-full max-w-4xl bg-white/10 border-white/20 shadow-xl text-white", className)}>
            <CardHeader className="relative">
              <div className="absolute top-4 right-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="text-white hover:bg-white/10"
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={28} className="text-estate-blue" />
                <CardTitle className="text-3xl">
                  {isContactInfoScreen 
                    ? "Almost Done!" 
                    : userType === null 
                      ? "Commercial Property Questionnaire" 
                      : userType === 'buyer' 
                        ? "Buyer Questionnaire" 
                        : "Seller Questionnaire"}
                </CardTitle>
              </div>
              <CardDescription className="text-white/80 text-lg">
                {isContactInfoScreen 
                  ? "Please provide your contact information so our agent can get in touch with you." 
                  : getCurrentQuestion()?.description || "Please help us understand your needs better."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">
                  {isContactInfoScreen 
                    ? "Your Contact Information" 
                    : getCurrentQuestion()?.question}
                </h3>
                {renderQuestionContent()}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                  className="bg-estate-blue hover:bg-estate-dark-blue"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-estate-blue hover:bg-estate-dark-blue"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Inline mode
  return (
    <Card className={cn("w-full bg-white border shadow-md", className)}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare size={24} className="text-estate-blue" />
          <CardTitle>
            {isContactInfoScreen 
              ? "Almost Done!" 
              : userType === null 
                ? "Commercial Property Questionnaire" 
                : userType === 'buyer' 
                  ? "Buyer Questionnaire" 
                  : "Seller Questionnaire"}
          </CardTitle>
        </div>
        <CardDescription className="text-base">
          {isContactInfoScreen 
            ? "Please provide your contact information so our agent can get in touch with you." 
            : getCurrentQuestion()?.description || "Please help us understand your needs better."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isContactInfoScreen 
              ? "Your Contact Information" 
              : getCurrentQuestion()?.question}
          </h3>
          {renderQuestionContent()}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-estate-blue h-full rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {isLastQuestion ? (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !canProceed()}
            className="bg-estate-blue hover:bg-estate-dark-blue"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-estate-blue hover:bg-estate-dark-blue"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyQuiz;
