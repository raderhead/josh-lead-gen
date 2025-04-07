
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserType, QuizSubmission } from './types';
import { getFilteredQuestions, sendToWebhook } from './quizUtils';

interface UseQuizProps {
  user: any;
  onClose?: () => void;
}

export const useQuiz = ({ user, onClose }: UseQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [userType, setUserType] = useState<UserType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Set user type based on first question answer
  useEffect(() => {
    if (answers[0] === 'Buy') {
      setUserType('buyer');
    } else if (answers[0] === 'Sell') {
      setUserType('seller');
    }
  }, [answers[0]]);

  // Calculate progress
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
      // Submit the form when all questions are answered
      handleSubmit();
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit your quiz.",
        variant: "destructive"
      });
      setShowAuthDialog(true);
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
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        userType: answers[0] === 'Buy' ? 'Buyer' : 'Seller',
        formType: answers[0] === 'Buy' ? "Commercial Property Buyer Questionnaire" : "Commercial Property Seller Questionnaire",
        answers: formattedAnswers,
        timestamp: new Date().toISOString()
      };
      
      console.log('Submitting quiz data:', formData);
      
      const webhookResult = await sendToWebhook(formData);
      
      if (webhookResult && typeof webhookResult === 'object' && 'error' in webhookResult) {
        console.error('Webhook submission failed:', webhookResult.message);
        toast({
          title: "Submission Error",
          description: "There was a problem submitting your information. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
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
      
      setIsSubmitted(true);
      
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
      return false; 
    }
    
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length > 0;
    }
    
    return !!answers[currentQuestion.id];
  };

  const filteredQuestions = getFilteredQuestions(userType);
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return {
    currentQuestionIndex,
    answers,
    setAnswers,
    userType,
    isSubmitting,
    progress,
    showAuthDialog,
    setShowAuthDialog,
    isSubmitted,
    getCurrentQuestion,
    handleNext,
    handlePrevious,
    handleCheckboxChange,
    handleRadioChange,
    handleSelectChange,
    isCheckboxSelected,
    handleSubmit,
    canProceed,
    isFirstQuestion,
    isLastQuestion,
  };
};
