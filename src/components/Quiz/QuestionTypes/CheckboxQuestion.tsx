
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { QuizQuestion } from '../types';

interface CheckboxQuestionProps {
  question: QuizQuestion;
  value: string[];
  onChange: (option: string) => void;
  isOptionSelected: (option: string) => boolean;
}

const CheckboxQuestion: React.FC<CheckboxQuestionProps> = ({ 
  question, onChange, isOptionSelected 
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {question.options?.map((option) => (
        <div 
          key={option} 
          className="flex items-center space-x-3 bg-white/5 p-4 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => onChange(option)}
        >
          <Checkbox
            id={`checkbox-${question.id}-${option}`}
            checked={isOptionSelected(option)}
            onCheckedChange={() => onChange(option)}
            className="h-5 w-5"
          />
          <label
            htmlFor={`checkbox-${question.id}-${option}`}
            className="text-lg leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxQuestion;
