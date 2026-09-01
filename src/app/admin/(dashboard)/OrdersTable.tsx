import Link from "next/link";

export type OrderListItem = {
  id: string;
  created_at: string;
  occasion: string;
  event_date: string;
  customer_name: string;
  status: string;
};

const STATUS_STYLES: Record<string, string> = {
  New: "bg-accent-tint text-accent-deep",
  Reviewing: "bg-accent-tint text-accent-deep",
  Quoted: "bg-border text-heading",
  Confirmed: "bg-border text-heading",
  Completed: "bg-surface text-muted border border-border",
  Declined: "bg-surface text-muted border border-border",
};

export function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-muted">No order requests yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Occasion</th>
            <th className="px-4 py-3">Event date</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-muted">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-medium text-heading hover:text-accent-deep"
                >
                  {order.customer_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">{order.occasion}</td>
              <td className="px-4 py-3 text-muted">
                {new Date(order.event_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    STATUS_STYLES[order.status] ?? "bg-border text-heading"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
