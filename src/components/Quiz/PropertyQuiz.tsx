import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { QuizMode, UserType, QuizSubmission } from './types';
import { getFilteredQuestions, sendToWebhook } from './quizUtils';
import QuizContent from './QuizContent';
import AuthDialog from './AuthDialog';
import { supabase } from '@/integrations/supabase/client';

interface PropertyQuizProps {
  mode?: QuizMode;
  onClose?: () => void;
  className?: string;
}

const PropertyQuiz: React.FC<PropertyQuizProps> = ({ mode = 'inline', onClose, className }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [userType, setUserType] = useState<UserType>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.phone) {
        setPhone(user.phone);
        console.log("Found phone in user.phone:", user.phone);
      }
    }
  }, [user]);
  
  useEffect(() => {
    if (answers[0] === 'Buy') {
      setUserType('buyer');
    } else if (answers[0] === 'Sell') {
      setUserType('seller');
    }
  }, [answers[0]]);

  useEffect(() => {
    if (userType === null) {
      setProgress(0);
    } else {
      const filteredQuestions = getFilteredQuestions(userType);
      const totalQuestions = filteredQuestions.length;
      const answeredCount = currentQuestionIndex;
      setProgress((answeredCount / totalQuestions) * 100);
    }
  }, [currentQuestionIndex, userType]);

  const getCurrentQuestion = () => {
    const filteredQuestions = getFilteredQuestions(userType);
    return filteredQuestions[currentQuestionIndex];
  };
  
  const handleNext = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    const filteredQuestions = getFilteredQuestions(userType);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(filteredQuestions.length);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleCheckboxChange = (questionId: number, option: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
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
  
  const handleRadioChange = (questionId: number, value: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setAnswers({ ...answers, [questionId]: value });
    setTimeout(() => handleNext(), 300);
  };
  
  const handleSelectChange = (questionId: number, value: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setAnswers({ ...answers, [questionId]: value });
    setTimeout(() => handleNext(), 300);
  };
  
  const isCheckboxSelected = (option: string) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return false;
    const currentAnswers = answers[currentQuestion.id] || [];
    return currentAnswers.includes(option);
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
      const filteredQuestions = getFilteredQuestions(userType);
      
      const formattedAnswers = Object.entries(answers)
        .map(([questionIdStr, answer]) => {
          const questionId = Number(questionIdStr);
          const question = filteredQuestions.find(q => q.id === questionId);
          
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
      
      const webhookResult = await sendToWebhook(formData);
      
      if (webhookResult && typeof webhookResult === 'object' && 'error' in webhookResult) {
        console.error('Webhook submission failed:', webhookResult.message);
      } else {
        console.log('Webhook submission successful');
      }
      
      if (user) {
        try {
          const { data, error } = await supabase
            .from('quiz_submissions')
            .insert({
              user_id: user.id,
              user_type: formData.userType.toLowerCase(),
              quiz_data: formData
            } as QuizSubmission);
          
          if (error) {
            console.error('Supabase submission error:', error);
          } else {
            console.log('Saved to Supabase:', data);
          }
        } catch (supabaseError) {
          console.error('Supabase submission exception:', supabaseError);
        }
      }
      
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

  const canProceed = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) {
      return !!name && !!email && !!phone;
    }
    
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length > 0;
    }
    
    return !!answers[currentQuestion.id];
  };
  
  const filteredQuestions = getFilteredQuestions(userType);
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length;
  const isContactInfoScreen = currentQuestionIndex >= filteredQuestions.length;
  const isFirstQuestion = currentQuestionIndex === 0;

  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-slate-900 to-estate-dark-blue z-50 overflow-y-auto">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl mb-4 bg-slate-600 rounded-full h-2 overflow-hidden">
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
                <QuizContent
                  currentQuestion={getCurrentQuestion()}
                  answers={answers}
                  setAnswers={setAnswers}
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  handleNext={handleNext}
                  handleCheckboxChange={handleCheckboxChange}
                  handleRadioChange={handleRadioChange}
                  handleSelectChange={handleSelectChange}
                  isCheckboxSelected={isCheckboxSelected}
                  mode={mode}
                  isAuthenticated={!!user}
                  showAuthDialog={() => setShowAuthDialog(true)}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4 border-t border-white/10">
              {!isFirstQuestion && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              
              {isLastQuestion && (
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
              )}
            </CardFooter>
          </Card>
        </div>
        
        <AuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog} 
        />
      </div>
    );
  }

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
          <QuizContent
            currentQuestion={getCurrentQuestion()}
            answers={answers}
            setAnswers={setAnswers}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            handleNext={handleNext}
            handleCheckboxChange={handleCheckboxChange}
            handleRadioChange={handleRadioChange}
            handleSelectChange={handleSelectChange}
            isCheckboxSelected={isCheckboxSelected}
            mode={mode}
            isAuthenticated={!!user}
            showAuthDialog={() => setShowAuthDialog(true)}
          />
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-estate-blue h-full rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        {!isFirstQuestion && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="border-gray-200 bg-gray-100 hover:bg-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        
        {!isLastQuestion ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="ml-auto bg-estate-blue hover:bg-estate-dark-blue text-white"
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !canProceed()}
            className="ml-auto bg-estate-blue hover:bg-estate-dark-blue text-white"
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
        )}
      </CardFooter>
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
    </Card>
  );
};

export default PropertyQuiz;
