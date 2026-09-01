import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createSessionSupabaseClient } from "@/lib/supabase/server-session";
import { Container } from "@/components/Container";
import { signOut } from "../actions";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSessionSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects unauthenticated
  // visitors, but this keeps the dashboard safe even if a middleware
  // matcher ever gets misconfigured.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border bg-surface">
        <Container className="flex items-center justify-between py-4">
          <Link href="/admin" className="font-display text-lg font-semibold text-heading">
            Admin
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-muted hover:text-accent-deep"
            >
              Sign out
            </button>
          </form>
        </Container>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
