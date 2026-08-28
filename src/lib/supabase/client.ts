"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { AuthChangeEvent } from "@supabase/supabase-js";

let client: ReturnType<typeof createBrowserClient> | null = null;

function getClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}

export function createClient() {
  return getClient();
}

/**
 * Hook to get the current auth session.
 * Returns null while loading, then the user or null.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getClient();

    supabase.auth.getUser().then(({ data: userData }: { data: { user: User | null } }) => {
      setUser(userData.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
