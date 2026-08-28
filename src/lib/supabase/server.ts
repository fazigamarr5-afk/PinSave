import { cookies } from "next/headers";

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes("placeholder") && !key.includes("placeholder"));
}

export async function createClient() {
  if (!isConfigured()) {
    // Return mock client when Supabase is not configured
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: async () => ({ data: [], error: null }),
          }),
          order: async () => ({ data: [], error: null }),
        }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({
          eq: async () => ({ data: null, error: null }),
        }),
        delete: () => ({
          eq: async () => ({ data: null, error: null }),
        }),
        upsert: async () => ({ data: null, error: null }),
      }),
    } as any;
  }

  const { createServerClient: createSSRClient } = await import("@supabase/ssr");
  const cookieStore = await cookies();

  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component
          }
        },
      },
    }
  );
}

export async function createServiceClient() {
  if (!isConfigured()) {
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({
          eq: async () => ({ data: null, error: null }),
        }),
        delete: () => ({
          eq: async () => ({ data: null, error: null }),
        }),
        upsert: async () => ({ data: null, error: null }),
      }),
    } as any;
  }

  const { createClient } = await import("@supabase/supabase-js");

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
