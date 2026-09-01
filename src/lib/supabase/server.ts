import { createClient } from "@supabase/supabase-js";

// Public, anon-key client for reads that are meant to be publicly
// visible (e.g. the accepting_orders switch). Not for anything
// requiring the admin session — that's built in Milestone 6.
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
