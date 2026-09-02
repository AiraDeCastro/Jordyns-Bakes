"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionSupabaseClient } from "@/lib/supabase/server-session";
import { statusUpdateSchema } from "@/lib/validation/admin";

export async function signOut() {
  const supabase = await createSessionSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function toggleAccepting(formData: FormData) {
  const next = formData.get("next") === "true";

  const supabase = await createSessionSupabaseClient();
  await supabase
    .from("settings")
    .update({ accepting_orders: next, updated_at: new Date().toISOString() })
    .eq("id", 1);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/order");
}

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const parsed = statusUpdateSchema.safeParse({ status: formData.get("status") });
  if (!parsed.success) return;

  const supabase = await createSessionSupabaseClient();
  await supabase.from("orders").update({ status: parsed.data.status }).eq("id", orderId);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}

export async function deleteOrder(orderId: string) {
  const supabase = await createSessionSupabaseClient();
  await supabase.from("orders").delete().eq("id", orderId);

  revalidatePath("/admin");
  redirect("/admin");
}
