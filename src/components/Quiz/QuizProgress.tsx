
import React from 'react';

interface QuizProgressProps {
  progress: number;
  mode: 'inline' | 'fullscreen';
}

const QuizProgress: React.FC<QuizProgressProps> = ({ progress, mode }) => {
  return mode === 'fullscreen' ? (
    <div className="w-full max-w-4xl mb-4 bg-slate-600 rounded-full h-2 overflow-hidden">
      <div 
        className="bg-estate-blue h-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  ) : (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div 
        className="bg-estate-blue h-full rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default QuizProgress;
