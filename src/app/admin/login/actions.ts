"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/admin";
import { createSessionSupabaseClient } from "@/lib/supabase/server-session";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email and password." };
  }

  const supabase = await createSessionSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: "Invalid email or password." };
  }

  redirect("/admin");
}
