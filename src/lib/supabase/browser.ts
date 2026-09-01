import { createBrowserClient } from "@supabase/ssr";

// For client components (the login form). Session lives in cookies so
// it's shared with the server client used by middleware/Server Actions.
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
