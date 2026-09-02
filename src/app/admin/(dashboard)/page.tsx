import { Container } from "@/components/Container";
import { createSessionSupabaseClient } from "@/lib/supabase/server-session";
import { toggleAccepting } from "../actions";
import { OrdersTable } from "./OrdersTable";
import { NotifySignupsList } from "./NotifySignupsList";

// Always reflect the live database, never a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSessionSupabaseClient();

  const [{ data: settings }, { data: orders }, { data: signups }] = await Promise.all([
    supabase.from("settings").select("accepting_orders").eq("id", 1).single(),
    supabase
      .from("orders")
      .select("id, created_at, occasion, event_date, customer_name, status")
      .order("created_at", { ascending: false }),
    supabase
      .from("notify_signups")
      .select("email, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const acceptingOrders = settings?.accepting_orders ?? false;

  const CLOSED_STATUSES = new Set(["Completed", "Declined"]);
  const activeOrders = (orders ?? []).filter((order) => !CLOSED_STATUSES.has(order.status));
  const previousOrders = (orders ?? []).filter((order) => CLOSED_STATUSES.has(order.status));

  return (
    <Container className="flex flex-col gap-10 py-12">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg font-semibold text-heading">
            {acceptingOrders ? "Accepting orders" : "Not accepting orders"}
          </p>
          <p className="text-sm text-muted">
            Customers {acceptingOrders ? "can" : "can't"} currently submit new order requests.
          </p>
        </div>
        <form action={toggleAccepting}>
          <input type="hidden" name="next" value={(!acceptingOrders).toString()} />
          <button
            type="submit"
            className="rounded-full bg-accent-deep px-5 py-2 text-sm font-semibold text-surface transition-colors hover:bg-accent"
          >
            {acceptingOrders ? "Turn off" : "Turn on"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-heading">Order requests</h2>
        <OrdersTable orders={activeOrders} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-heading">
          Notify-me signups
        </h2>
        <NotifySignupsList signups={signups ?? []} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-heading">
          Previous order requests
        </h2>
        <p className="text-sm text-muted">Completed or declined orders.</p>
        <OrdersTable orders={previousOrders} emptyMessage="No completed or declined orders yet." />
      </div>
    </Container>
  );
}
