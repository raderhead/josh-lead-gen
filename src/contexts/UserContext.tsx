
// Make sure React is imported and available
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

// Update the return type of login to match what it actually returns
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{
    user: SupabaseUser | null;
    session: Session | null;
  } | undefined>;
  signup: (email: string, name: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Make sure we're using React's useState explicitly
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  // Convert Supabase user to our application User type
  const formatUser = (supabaseUser: SupabaseUser): User => {
    console.log("Formatting user with metadata:", supabaseUser.user_metadata);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      // First try to get name from user_metadata, then fall back to email username
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
      phone: supabaseUser.user_metadata?.phone || supabaseUser.user_metadata?.phone_number || supabaseUser.user_metadata?.user_phone || '',
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

      return data;
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
      console.log("Attempting signup with:", { email, name, phone: phone || "No phone provided" });
      
      // Use window.location.origin to get the current URL dynamically
      const origin = window.location.origin;
      console.log("Setting redirectTo to:", `${origin}/email-verified`);
      
      // CRITICAL: Make sure phone is always stored correctly
      // Remove all non-numeric characters from phone number
      const cleanedPhone = phone ? phone.replace(/\D/g, '') : '';
      console.log("Raw phone input:", phone);
      console.log("Cleaned phone (digits only):", cleanedPhone);
      
      // Create a complete user metadata object with all phone fields
      const userMetadata = {
        name,
        full_name: name,
        display_name: name,
        // Store phone in multiple fields to ensure it's captured somewhere
        phone: cleanedPhone,
        phone_number: cleanedPhone,
        user_phone: cleanedPhone
      };
      
      console.log("Sending user metadata to Supabase:", userMetadata);
      
      // Signup with user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${origin}/email-verified`,
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
            data: userMetadata
          });
          
          if (updateError) {
            console.error("Error updating user metadata:", updateError);
          } else {
            console.log("User metadata updated successfully:", updateData);
            
            // Verify the phone number was stored in metadata
            console.log("Updated user metadata phone:", 
              updateData.user.user_metadata?.phone,
              updateData.user.user_metadata?.phone_number,
              updateData.user.user_metadata?.user_phone
            );
          }
        } catch (updateErr) {
          console.error("Exception during metadata update:", updateErr);
        }
      }
      
      toast({
        title: 'Verification Required',
        description: 'Please check your email for a verification link.',
        variant: 'default',
        className: 'bg-amber-50 border-amber-200 text-amber-800', // Add yellow styling
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
