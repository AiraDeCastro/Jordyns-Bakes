import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// For Server Components/Actions that need the logged-in admin's session
// (via cookies), so Postgres RLS enforces access as "authenticated" —
// not the public anon client, and never the service_role key.
export async function createSessionSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render, which can't set
            // cookies — fine as long as middleware keeps the session
            // refreshed.
          }
        },
      },
    },
  );
}
