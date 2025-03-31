
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'agent' | 'admin';
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, phone: string) => Promise<void>;
  signup: (email: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Convert Supabase user to our application User type
  const formatUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      // Use the user's email name as display name if no metadata is available
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
      role: 'user', // Default role
    };
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ? formatUser(currentSession.user) : null);
        setIsLoading(false);
      }
    );

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session:", currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ? formatUser(currentSession.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, phone: string) => {
    setIsLoading(true);
    try {
      // Clean phone number (remove any non-digit characters)
      const cleanedPhone = phone.replace(/\D/g, '');
      console.log("Attempting login with:", { email, phone: cleanedPhone });
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password: cleanedPhone // We're using phone as password
      });
      
      if (error) {
        console.error("Login error details:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Login successful:", data.user);
        // User set by the onAuthStateChange listener
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
      }
    } catch (error: any) {
      console.error("Login error full:", error);
      toast({
        title: 'Login failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, phone: string) => {
    setIsLoading(true);
    try {
      // Clean phone number (remove any non-digit characters)
      const cleanedPhone = phone.replace(/\D/g, '');
      console.log("Attempting signup with:", { email, name, phone: cleanedPhone });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: cleanedPhone, // Using phone as password
        options: {
          data: {
            name,
            phone: cleanedPhone,
          },
        },
      });
      
      if (error) {
        console.error("Signup error details:", error);
        throw error;
      }
      
      console.log("Signup successful:", data);
      // User set by the onAuthStateChange listener
      toast({
        title: 'Account created',
        description: 'Your account has been successfully created.',
      });
    } catch (error: any) {
      console.error("Signup error full:", error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      toast({
        title: 'Error logging out',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
