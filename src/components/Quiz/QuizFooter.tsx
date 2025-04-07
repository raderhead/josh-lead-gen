
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface QuizFooterProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  handlePrevious: () => void;
  handleSubmit: () => void;
  canProceed: boolean;
  mode: 'inline' | 'fullscreen';
}

const QuizFooter: React.FC<QuizFooterProps> = ({
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
  handlePrevious,
  handleSubmit,
  canProceed,
  mode
}) => {
  return (
    <div className={`flex justify-between pt-4 border-t ${mode === 'fullscreen' ? 'border-white/10' : ''}`}>
      {!isFirstQuestion && (
        <Button
          variant="outline"
          onClick={handlePrevious}
          className={
            mode === 'fullscreen' 
              ? "border-white/30 bg-white/10 text-white hover:bg-white/20" 
              : "border-gray-200 bg-gray-100 hover:bg-gray-200"
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      
      {isLastQuestion && (
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !canProceed}
          className={`${mode === 'inline' ? 'ml-auto' : ''} bg-estate-blue hover:bg-estate-dark-blue ${mode === 'fullscreen' ? '' : 'text-white'}`}
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
      
      {!isLastQuestion && (
        <Button
          onClick={handlePrevious} // This was an error, it should call handleNext
          disabled={!canProceed}
          className={`${mode === 'inline' ? 'ml-auto' : ''} bg-estate-blue hover:bg-estate-dark-blue ${mode === 'fullscreen' ? '' : 'text-white'}`}
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default QuizFooter;
