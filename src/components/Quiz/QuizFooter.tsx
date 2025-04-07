
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface QuizFooterProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  canProceed: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  mode: 'inline' | 'fullscreen';
}

const QuizFooter: React.FC<QuizFooterProps> = ({
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
  canProceed,
  handlePrevious,
  handleNext,
  handleSubmit,
  mode
}) => {
  const buttonStyles = mode === 'fullscreen' 
    ? "border-white/30 bg-white/10 text-white hover:bg-white/20" 
    : "border-gray-200 bg-gray-100 hover:bg-gray-200";
  
  return (
    <>
      {!isFirstQuestion && (
        <Button
          variant="outline"
          onClick={handlePrevious}
          className={buttonStyles}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      
      {isLastQuestion ? (
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !canProceed}
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
      ) : (
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="ml-auto bg-estate-blue hover:bg-estate-dark-blue text-white"
        >
          Next
        </Button>
      )}
    </>
  );
};

export default QuizFooter;
