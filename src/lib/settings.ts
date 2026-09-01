import { createPublicSupabaseClient } from "./supabase/server";

// Fails closed (treated as "not accepting") if the read fails, since
// that's the safer default for the business if something's misconfigured.
export async function getAcceptingOrders(): Promise<boolean> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("settings")
    .select("accepting_orders")
    .eq("id", 1)
    .single();

  if (error || !data) {
    console.error("Failed to read accepting_orders setting:", error);
    return false;
  }

  return data.accepting_orders;
}
