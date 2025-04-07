
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { QuizQuestion, UserType } from './types';

interface QuizHeaderProps {
  currentQuestion: QuizQuestion | undefined;
  userType: UserType;
  mode: 'inline' | 'fullscreen';
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ currentQuestion, userType, mode }) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare size={mode === 'fullscreen' ? 28 : 24} className="text-estate-blue" />
        <CardTitle className={cn(mode === 'fullscreen' ? "text-3xl" : "")}>
          {userType === null 
            ? "Commercial Property Questionnaire" 
            : userType === 'buyer' 
              ? "Buyer Questionnaire" 
              : "Seller Questionnaire"}
        </CardTitle>
      </div>
      <CardDescription className={cn(
        mode === 'fullscreen' ? "text-white/80 text-lg" : "text-base"
      )}>
        {currentQuestion?.description || "Please help us understand your needs better."}
      </CardDescription>
    </>
  );
};

export default QuizHeader;
