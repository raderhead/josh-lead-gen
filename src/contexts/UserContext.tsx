
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin';
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, phone?: string) => Promise<void>;
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
    console.log("Formatting user with metadata:", supabaseUser.user_metadata);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      // First try to get name from user_metadata, then fall back to email username
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
      phone: supabaseUser.user_metadata?.phone || '',
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
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

  const signup = async (email: string, name: string, password: string, phone?: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup with:", { email, name, phone });
      
      // IMPORTANT: We need to pass the name in the signup options to ensure it's stored correctly
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // This is the critical line that sets the user metadata
            full_name: name, // Adding a second field as a backup
            display_name: name, // Adding a third field to ensure it's captured
            phone: phone || '', // Add the phone number to user metadata
            phone_number: phone || '', // Add additional phone field as backup
            user_phone: phone || '' // Add yet another phone field to ensure it's captured
          },
        },
      });
      
      if (error) {
        console.error("Signup error details:", error);
        throw error;
      }
      
      console.log("Signup response:", data);
      
      // After signup, explicitly update the user metadata again to ensure it's set
      if (data.user) {
        console.log("User created, updating metadata for:", data.user.id);
        
        try {
          const { data: updateData, error: updateError } = await supabase.auth.updateUser({
            data: { 
              name: name,
              full_name: name,
              display_name: name,
              phone: phone || '',
              phone_number: phone || '',
              user_phone: phone || ''
            }
          });
          
          if (updateError) {
            console.error("Error updating user metadata:", updateError);
          } else {
            console.log("User metadata updated successfully:", updateData);
          }
        } catch (updateErr) {
          console.error("Exception during metadata update:", updateErr);
        }
      }
      
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
