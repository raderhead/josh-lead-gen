
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [inputValue, setInputValue] = useState(value || '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };
  
  const handleNext = () => {
    if (inputValue.trim()) {
      onBlur();
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder={question.placeholder}
        value={inputValue}
        onChange={handleChange}
        className="text-lg py-6 px-5 text-gray-800 dark:text-white"
        onClick={() => !isAuthenticated && onAuthRequired()}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!inputValue.trim()}
          className="bg-estate-blue hover:bg-estate-dark-blue text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TextQuestion;
