
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { QuizMode } from './types';
import QuizContent from './QuizContent';
import AuthDialog from './AuthDialog';
import QuizProgress from './QuizProgress';
import QuizHeader from './QuizHeader';
import QuizFooter from './QuizFooter';
import QuizThankYou from './QuizThankYou';
import { useQuiz } from './useQuiz';

interface PropertyQuizProps {
  mode?: QuizMode;
  onClose?: () => void;
  className?: string;
}

const PropertyQuiz: React.FC<PropertyQuizProps> = ({ mode = 'inline', onClose, className }) => {
  const { user } = useUser();
  
  const {
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
  } = useQuiz({ user, onClose });

  if (isSubmitted) {
    return <QuizThankYou userName={user?.name || ""} mode={mode} className={className} />;
  }

  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-slate-900 to-estate-dark-blue z-50 overflow-y-auto">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <QuizProgress progress={progress} mode={mode} />
          
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
              <QuizHeader 
                currentQuestion={getCurrentQuestion()} 
                userType={userType} 
                mode={mode} 
              />
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">
                  {getCurrentQuestion()?.question}
                </h3>
                <QuizContent
                  currentQuestion={getCurrentQuestion()}
                  answers={answers}
                  setAnswers={setAnswers}
                  name={user?.name || ''}
                  setName={() => {}}
                  email={user?.email || ''}
                  setEmail={() => {}}
                  phone={user?.phone || ''}
                  setPhone={() => {}}
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
              <QuizFooter
                isFirstQuestion={isFirstQuestion}
                isLastQuestion={isLastQuestion}
                isSubmitting={isSubmitting}
                canProceed={canProceed}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleSubmit={handleSubmit}
                mode={mode}
              />
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
        <QuizHeader 
          currentQuestion={getCurrentQuestion()} 
          userType={userType}
          mode={mode}
        />
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {getCurrentQuestion()?.question}
          </h3>
          <QuizContent
            currentQuestion={getCurrentQuestion()}
            answers={answers}
            setAnswers={setAnswers}
            name={user?.name || ''}
            setName={() => {}}
            email={user?.email || ''}
            setEmail={() => {}}
            phone={user?.phone || ''}
            setPhone={() => {}}
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
        
        <QuizProgress progress={progress} mode={mode} />
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <QuizFooter
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          isSubmitting={isSubmitting}
          canProceed={canProceed}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          handleSubmit={handleSubmit}
          mode={mode}
        />
      </CardFooter>
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
    </Card>
  );
};

export default PropertyQuiz;
