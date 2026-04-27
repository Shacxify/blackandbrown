import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

export type Role = 'admin' | 'employee' | null;

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Defer role fetch to avoid deadlock
        setTimeout(() => fetchRole(newSession.user.id), 0);
      } else {
        setRole(null);
      }
    });

    // Then fetch initial session — wait for role before clearing loading
    (async () => {
      const { data: { session: initial } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(initial);
      setUser(initial?.user ?? null);
      if (initial?.user) {
        await fetchRole(initial.user.id);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    const roles = (data ?? []).map((r) => r.role as string);
    if (roles.includes('admin')) setRole('admin');
    else if (roles.includes('employee')) setRole('employee');
    else setRole(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return {
    session,
    user,
    role,
    isEmployee: role === 'employee' || role === 'admin',
    isAdmin: role === 'admin',
    loading,
    signOut,
  };
};
