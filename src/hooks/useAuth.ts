import type {Session, User} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {supabase} from '@/src/lib/supabase';

export type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      setSession(data.session);
      setLoading(false);
    });

    const {data: listener} = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return {session, user: session?.user ?? null, loading};
}

export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({email, password});
}

export async function signInWithMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {emailRedirectTo: `${window.location.origin}/auth/callback`},
  });
}

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {emailRedirectTo: `${window.location.origin}/auth/callback`},
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
