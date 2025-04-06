
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyQuiz from '@/components/Quiz/PropertyQuiz';
import { useUser } from '@/contexts/UserContext';

const PropertyQuizPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { state: { returnTo: '/property-quiz' } });
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-estate-blue"></div>
      </div>
    );
  }
  
  // Only render the quiz if the user is authenticated
  if (!user) {
    return null; // This will redirect in the useEffect
  }
  
  return (
    <PropertyQuiz 
      mode="fullscreen"
      onClose={() => navigate(-1)}
    />
  );
};

export default PropertyQuizPage;
