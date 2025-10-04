"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

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
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', session.user.id)
            .single();

          setUser({ ...session.user, profile });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        
        if (!isMounted) return;

        // FIX: Use setTimeout to avoid deadlock with async operations
        setTimeout(async () => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('users')
              .select('name, email')
              .eq('id', session.user.id)
              .single();

            if (isMounted) {
              setUser({ ...session.user, profile });
            }
          } else {
            if (isMounted) {
              setUser(null);
            }
          }
          
          if (isMounted) {
            setLoading(false);
            setInitialized(true);
          }
        }, 0);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    loading,
    initialized,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
