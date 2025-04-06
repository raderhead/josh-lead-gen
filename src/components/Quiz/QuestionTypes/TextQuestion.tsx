
import React from 'react';
import { Input } from '@/components/ui/input';
import { QuizQuestion } from '../types';

interface TextQuestionProps {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onAuthRequired: () => void;
  isAuthenticated: boolean;
}

const TextQuestion: React.FC<TextQuestionProps> = ({ 
  question, value, onChange, onBlur, onAuthRequired, isAuthenticated 
}) => {
  return (
    <Input
      placeholder={question.placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="text-lg py-6 px-5"
      onBlur={onBlur}
      onClick={() => !isAuthenticated && onAuthRequired()}
    />
  );
};

export default TextQuestion;
