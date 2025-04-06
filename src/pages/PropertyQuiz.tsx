
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyQuiz from '@/components/Quiz/PropertyQuiz';

const PropertyQuizPage = () => {
  const navigate = useNavigate();
  
  return (
    <PropertyQuiz 
      mode="fullscreen"
      onClose={() => navigate(-1)}
    />
  );
};

export default PropertyQuizPage;
