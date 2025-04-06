
import React from 'react';
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { QuizQuestion, QuizMode } from '../types';

interface SelectQuestionProps {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
  mode?: QuizMode;
  onAuthRequired: () => void;
  isAuthenticated: boolean;
}

const SelectQuestion: React.FC<SelectQuestionProps> = ({ 
  question, value, onChange, mode = 'inline', onAuthRequired, isAuthenticated 
}) => {
  return (
    <Select
      value={value || ''}
      onValueChange={onChange}
      onOpenChange={() => !isAuthenticated && onAuthRequired()}
    >
      <SelectTrigger 
        className={cn(
          "text-lg py-6",
          mode === 'fullscreen' ? "bg-white/20 border-white/30 text-white" : ""
        )}
      >
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent className={mode === 'fullscreen' ? "bg-slate-800 text-white border-white/20" : ""}>
        {question.options?.map((option) => (
          <SelectItem 
            key={option} 
            value={option} 
            className={cn(
              "text-lg py-3",
              mode === 'fullscreen' ? "text-white hover:bg-slate-700 focus:bg-slate-700" : ""
            )}
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectQuestion;
