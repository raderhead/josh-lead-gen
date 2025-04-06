
import React, { createContext, useContext, useState } from 'react';

interface AuthDialogContextType {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  openLogin: () => void;
  openSignup: () => void;
  closeLogin: () => void;
  closeSignup: () => void;
  switchToLogin: () => void;
  switchToSignup: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(undefined);

export const AuthDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const closeSignup = () => {
    setIsSignupOpen(false);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const switchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  return (
    <AuthDialogContext.Provider
      value={{
        isLoginOpen,
        isSignupOpen,
        openLogin,
        openSignup,
        closeLogin,
        closeSignup,
        switchToLogin,
        switchToSignup
      }}
    >
      {children}
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = () => {
  const context = useContext(AuthDialogContext);
  if (context === undefined) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return context;
};
