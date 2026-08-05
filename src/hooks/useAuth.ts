import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type AppUser } from '@/lib/supabase';

function toAppUser(session: Session | null): AppUser | null {
  const user = session?.user;
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const name =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta.user_name as string) ||
    (user.email ? user.email.split('@')[0] : 'Analyst');
  return {
    id: user.id,
    email: user.email ?? '',
    name,
    avatarUrl: (meta.avatar_url as string) ?? (meta.picture as string) ?? null,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // Get the existing session on mount (persists across reloads).
    // Always settle loading, even if the call rejects or hangs.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted.current) return;
        setSession(data.session);
        setUser(toAppUser(data.session));
      })
      .catch(() => {
        // Network/initialization error — treat as no session.
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    // Safety net: never leave loading stuck if getSession stalls.
    const timeout = setTimeout(() => {
      if (mounted.current) setLoading(false);
    }, 3000);

    // Listen for auth state changes (sign in, sign out, OAuth redirect, etc.)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted.current) return;
      setSession(newSession);
      setUser(toAppUser(newSession));
      setLoading(false);
    });

    return () => {
      mounted.current = false;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, []);

  const isEmailVerified = !!session?.user?.email_confirmed_at || !!session?.user?.confirmed_at;

  return { user, session, loading, isEmailVerified };
}
