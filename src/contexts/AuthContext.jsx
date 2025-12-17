import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    
    if (currentSession?.user) {
      const isAdmin = currentSession.user.email === 'admin@minicars.com';
      
      setUser({
        ...currentSession.user,
        role: isAdmin ? 'admin' : 'user',
        name: currentSession.user.user_metadata?.name || currentSession.user.email.split('@')[0]
      });
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        handleSession(initialSession);
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        handleSession(newSession);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      const message = error?.message || String(error);
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: message,
      });
      return { success: false, error: message };
    }
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      const message = error?.message || String(error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: message,
      });
      return { success: false, error: message };
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
      return { success: false, error: error.message };
    }
    return { success: true };
  }, [toast]);

  const register = useCallback(async (name, email, password) => {
    return await signUp(email, password, name);
  }, [signUp]);

  const login = useCallback(async (email, password) => {
    return await signIn(email, password);
  }, [signIn]);

  const logout = useCallback(async () => {
    return await signOut();
  }, [signOut]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    // both the raw names and aliases for compatibility with pages
    signUp,
    signIn,
    register,
    login,
    signOut,
    logout,
  }), [user, session, loading, signUp, signIn, register, login, signOut, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
