
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyQuiz from '@/components/Quiz/PropertyQuiz';
import { useUser } from '@/contexts/UserContext';

const PropertyQuizPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/property-quiz' } });
    }
  }, [user, navigate]);
  
  return (
    <PropertyQuiz 
      mode="fullscreen"
      onClose={() => navigate(-1)}
    />
  );
};

export default PropertyQuizPage;
