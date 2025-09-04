"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', session.user.id)
          .single();
        
        setUser({ ...session.user, profile });
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        if(event=='TOKEN_REFRESHED' && initialized){
          if (session?.user) {
            // Fetch fresh profile data
            const { data: profile } = await supabase
              .from('users')
              .select('name, email')
              .eq('id', session.user.id)
              .single();
            
            setUser({ ...session.user, profile });
          }
          return;
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (session?.user) {
            const { data: profile } = await supabase
                .from('users')
                .select('name, email')
                .eq('id', session.user.id)
                .single();
            setUser({ ...session.user, profile });
        }
        setLoading(false);
        setInitialized(true);
      }
    );

    return () => subscription.unsubscribe();
  }, [initialized]);

  const logout = async () => {
    await supabase.auth.signOut();
    console.log('Logging out...');
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    loading,
    initialized,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
