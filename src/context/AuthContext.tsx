import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  trackAuthAttempt,
  createAuthSession,
  getUserSessions,
  terminateSession,
  terminateAllSessions,
  getAuthPreferences,
  updateAuthPreferences,
  checkAccountLocked,
  sendMagicLink,
  AuthSession,
  AuthPreferences,
} from '../lib/authDb';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  sessions: AuthSession[];
  preferences: AuthPreferences | null;
  signUp: (email: string, password: string, fullName?: string, rememberMe?: boolean) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null; accountLocked?: boolean }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signOut: (allDevices?: boolean) => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: { fullName?: string }) => Promise<{ error: AuthError | null }>;
  refreshSessions: () => Promise<void>;
  terminateOtherSessions: () => Promise<boolean>;
  updatePreferences: (prefs: Partial<Omit<AuthPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [preferences, setPreferences] = useState<AuthPreferences | null>(null);
  const sessionRefreshInterval = useRef<NodeJS.Timeout | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('auth_state', 'signed_in');
      } else if (event === 'SIGNED_OUT') {
        localStorage.setItem('auth_state', 'signed_out');
        if (sessionRefreshInterval.current) {
          clearInterval(sessionRefreshInterval.current);
          sessionRefreshInterval.current = null;
        }
      } else if (event === 'TOKEN_REFRESHED') {
      }
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_state') {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      if (sessionRefreshInterval.current) {
        clearInterval(sessionRefreshInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (session && !sessionRefreshInterval.current) {
      sessionRefreshInterval.current = setInterval(() => {
        refreshSession();
      }, 15 * 60 * 1000);
    }

    return () => {
      if (sessionRefreshInterval.current) {
        clearInterval(sessionRefreshInterval.current);
        sessionRefreshInterval.current = null;
      }
    };
  }, [session, refreshSession]);

  const loadUserData = useCallback(async (userId: string) => {
    const [userSessions, userPreferences] = await Promise.all([
      getUserSessions(userId),
      getAuthPreferences(userId),
    ]);

    setSessions(userSessions);
    setPreferences(userPreferences);
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string, rememberMe: boolean = false) => {
    try {
      const locked = await checkAccountLocked(email);
      if (locked) {
        await trackAuthAttempt(email, 'signup', false, 'Account temporarily locked');
        return { error: { message: 'Account temporarily locked. Please try again later.' } as AuthError };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      await trackAuthAttempt(email, 'signup', !error, error?.message);

      if (data.user && !error) {
        setUser(data.user);
        await createAuthSession(data.user.id, 'password', rememberMe);
        await loadUserData(data.user.id);
      }

      return { error };
    } catch (err) {
      return { error: { message: 'An unexpected error occurred' } as AuthError };
    }
  }, [loadUserData]);

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const locked = await checkAccountLocked(email);
      if (locked) {
        await trackAuthAttempt(email, 'signin', false, 'Account temporarily locked');
        return {
          error: { message: 'Too many failed attempts. Please try again in 1 hour.' } as AuthError,
          accountLocked: true
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      await trackAuthAttempt(email, 'signin', !error, error?.message);

      if (data.user && !error) {
        setUser(data.user);
        setSession(data.session);
        await createAuthSession(data.user.id, 'password', rememberMe);
        await loadUserData(data.user.id);
      }

      return { error };
    } catch (err) {
      return { error: { message: 'An unexpected error occurred' } as AuthError };
    }
  }, [loadUserData]);

  const signInWithMagicLink = useCallback(async (email: string) => {
    return await sendMagicLink(email);
  }, []);

  const signOut = useCallback(async (allDevices: boolean = false) => {
    if (user && allDevices) {
      await terminateAllSessions(user.id);
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSessions([]);
    setPreferences(null);
  }, [user]);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    await trackAuthAttempt(email, 'reset', !error, error?.message);

    return { error };
  }, []);

  const refreshSessions = useCallback(async () => {
    if (user) {
      const userSessions = await getUserSessions(user.id);
      setSessions(userSessions);
    }
  }, [user]);

  const terminateOtherSessions = useCallback(async (): Promise<boolean> => {
    if (!user || sessions.length === 0) return false;

    const currentSession = sessions[0];
    return await terminateAllSessions(user.id, currentSession.id);
  }, [user, sessions]);

  const updatePreferences = useCallback(async (prefs: Partial<Omit<AuthPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return;

    const updated = await updateAuthPreferences(user.id, prefs);
    if (updated) {
      setPreferences(updated);
    }
  }, [user]);

  const updateProfile = useCallback(async (data: { fullName?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.fullName,
      },
    });

    return { error };
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData(user.id);
    }
  }, [user, loadUserData]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    sessions,
    preferences,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    resetPassword,
    updateProfile,
    refreshSessions,
    terminateOtherSessions,
    updatePreferences,
  }), [user, session, loading, sessions, preferences, signUp, signIn, signInWithMagicLink, signOut, resetPassword, updateProfile, refreshSessions, terminateOtherSessions, updatePreferences]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
