import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { createSessionSupabaseClient } from "@/lib/supabase/server-session";
import { ORDER_STATUSES } from "@/lib/order-options";
import { updateOrderStatus } from "../../../actions";

export const dynamic = "force-dynamic";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function Field({ label, value }: { label: string; value: ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="text-heading">{value}</p>
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSessionSupabaseClient();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();

  if (!order) {
    notFound();
  }

  let imageUrls: string[] = [];
  if (order.reference_image_urls?.length) {
    const signed = await Promise.all(
      order.reference_image_urls.map((path: string) =>
        supabase.storage
          .from("order-references")
          .createSignedUrl(path, SIGNED_URL_TTL_SECONDS),
      ),
    );
    imageUrls = signed
      .map((result) => result.data?.signedUrl)
      .filter((url): url is string => Boolean(url));
  }

  return (
    <Container className="flex flex-col gap-8 py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-heading">
            {order.customer_name}
          </h1>
          <p className="text-sm text-muted">
            Submitted {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <form action={updateOrderStatus.bind(null, order.id)} className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={order.status}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-deep focus:outline-none"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-accent-deep px-4 py-2 text-sm font-semibold text-surface hover:bg-accent"
          >
            Update status
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <Field label="Occasion" value={order.occasion} />
        <Field label="Event date" value={new Date(order.event_date).toLocaleDateString()} />
        <Field label="Cake or cupcakes" value={order.cake_type} />
        <Field label="Servings" value={order.servings} />
        <Field label="Flavor(s)" value={order.flavors} />
        <Field label="Filling / frosting" value={order.filling} />
        <Field label="Color palette" value={order.color_palette} />
        <Field label="Dietary restrictions" value={order.dietary_notes} />
        <Field label="Delivery or pickup" value={order.delivery_type} />
        <Field label="Delivery address" value={order.delivery_address} />
        <Field label="Budget range" value={order.budget_range} />
        <Field label="Email" value={order.email} />
        <Field label="Phone" value={order.phone} />
        <Field label="Referral source" value={order.referral_source} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Design vision
        </p>
        <p className="mt-1 text-heading">{order.design_description}</p>
      </div>

      {imageUrls.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold text-heading">
            Reference images
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {imageUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt="Customer reference"
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
