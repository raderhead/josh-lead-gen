
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QuizQuestion } from '../types';

interface RadioQuestionProps {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
}

const RadioQuestion: React.FC<RadioQuestionProps> = ({ question, value, onChange }) => {
  return (
    <RadioGroup
      value={value || ''}
      onValueChange={onChange}
    >
      <div className="grid grid-cols-1 gap-3">
        {question.options?.map((option) => (
          <div 
            key={option} 
            className="flex items-center space-x-3 bg-white/5 p-4 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => onChange(option)}
          >
            <RadioGroupItem value={option} id={`radio-${question.id}-${option}`} className="h-5 w-5" />
            <label
              htmlFor={`radio-${question.id}-${option}`}
              className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RadioQuestion;
