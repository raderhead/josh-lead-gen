
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthDialogProvider, useAuthDialog } from "./contexts/AuthDialogContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import HomeValuation from "./pages/HomeValuation";
import Contact from "./pages/Contact";
import SavedProperties from "./pages/SavedProperties";
import EmailVerified from "./pages/EmailVerified";
import PropertyQuizPage from "./pages/PropertyQuiz";
import LoginDialog from "./components/Auth/LoginDialog";
import SignupDialog from "./components/Auth/SignupDialog";

const queryClient = new QueryClient();

// Move AuthDialogs component inside the App component to use it correctly within the provider
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider>
          <AuthDialogProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/valuation" element={<HomeValuation />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/saved-properties" element={<SavedProperties />} />
                  <Route path="/email-verified" element={<EmailVerified />} />
                  <Route path="/property-quiz" element={<PropertyQuizPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <AuthDialogs />
              </BrowserRouter>
            </TooltipProvider>
          </AuthDialogProvider>
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

// Component to handle auth dialogs globally - now it's defined after the main App component
const AuthDialogs = () => {
  const { isLoginOpen, isSignupOpen, closeLogin, closeSignup, switchToSignup, switchToLogin } = useAuthDialog();
  
  return (
    <>
      <LoginDialog 
        open={isLoginOpen} 
        onOpenChange={closeLogin} 
        onSignUpClick={switchToSignup} 
      />
      <SignupDialog 
        open={isSignupOpen} 
        onOpenChange={closeSignup} 
        onSignInClick={switchToLogin} 
      />
    </>
  );
};

export default App;
