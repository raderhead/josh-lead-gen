
import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { QuizQuestion, QuizMode } from './types';
import TextQuestion from './QuestionTypes/TextQuestion';
import SelectQuestion from './QuestionTypes/SelectQuestion';
import CheckboxQuestion from './QuestionTypes/CheckboxQuestion';
import RadioQuestion from './QuestionTypes/RadioQuestion';
import ContactInfoForm from './ContactInfoForm';

interface QuizContentProps {
  currentQuestion: QuizQuestion | undefined;
  answers: Record<number, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, any>>>;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  handleNext: () => void;
  handleCheckboxChange: (questionId: number, option: string) => void;
  handleRadioChange: (questionId: number, value: string) => void;
  handleSelectChange: (questionId: number, value: string) => void;
  isCheckboxSelected: (option: string) => boolean;
  mode: QuizMode;
  isAuthenticated: boolean;
  showAuthDialog: () => void;
}

const QuizContent: React.FC<QuizContentProps> = ({
  currentQuestion,
  answers,
  setAnswers,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  handleNext,
  handleCheckboxChange,
  handleRadioChange,
  handleSelectChange,
  isCheckboxSelected,
  mode,
  isAuthenticated,
  showAuthDialog
}) => {
  // If there's no current question, show contact info form
  if (!currentQuestion) {
    return (
      <ContactInfoForm 
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
      />
    );
  }

  // Render appropriate input based on question type
  switch (currentQuestion.type) {
    case 'text':
      return (
        <TextQuestion
          question={currentQuestion}
          value={answers[currentQuestion.id] || ''}
          onChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
          onBlur={handleNext}
          onAuthRequired={showAuthDialog}
          isAuthenticated={isAuthenticated}
        />
      );
    
    case 'select':
      return (
        <SelectQuestion
          question={currentQuestion}
          value={answers[currentQuestion.id] || ''}
          onChange={(value) => handleSelectChange(currentQuestion.id, value)}
          mode={mode}
          onAuthRequired={showAuthDialog}
          isAuthenticated={isAuthenticated}
        />
      );
    
    case 'checkbox':
      return (
        <CheckboxQuestion
          question={currentQuestion}
          value={answers[currentQuestion.id] || []}
          onChange={(option) => handleCheckboxChange(currentQuestion.id, option)}
          isOptionSelected={isCheckboxSelected}
        />
      );
    
    case 'radio':
      return (
        <RadioQuestion
          question={currentQuestion}
          value={answers[currentQuestion.id] || ''}
          onChange={(value) => handleRadioChange(currentQuestion.id, value)}
        />
      );
    
    default:
      return null;
  }
};

export default QuizContent;
