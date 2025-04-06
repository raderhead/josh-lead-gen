
export type QuizQuestionType = 'text' | 'select' | 'checkbox' | 'radio' | 'range';

export type QuizQuestion = {
  id: number;
  question: string;
  description?: string;
  type: QuizQuestionType;
  options?: string[];
  placeholder?: string;
  forUserType: 'buyer' | 'seller' | 'both';
};

export type QuizMode = 'inline' | 'fullscreen';

export interface PropertyQuizProps {
  mode?: QuizMode;
  onClose?: () => void;
  className?: string;
}

export type UserType = 'buyer' | 'seller' | null;
