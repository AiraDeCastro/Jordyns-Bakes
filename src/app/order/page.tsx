import { Container } from "@/components/Container";
import { OrderForm } from "@/components/OrderForm";
import { NotifyMeForm } from "@/components/NotifyMeForm";
import { getAcceptingOrders } from "@/lib/settings";

// Must reflect the live database value, not one baked in at build time —
// same reasoning as the Home page banner.
export const dynamic = "force-dynamic";

export default async function OrderPage() {
  const acceptingOrders = await getAcceptingOrders();

  return (
    <div className="flex flex-1 flex-col py-16">
      <Container className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
        <h1 className="font-display text-3xl font-semibold text-heading">
          Request an order
        </h1>
        <p className="text-muted">
          {acceptingOrders
            ? "Tell us about your event and we'll follow up with a quote."
            : "We're not currently accepting new orders — check back soon."}
        </p>
      </Container>
      <Container className="mx-auto mt-10 max-w-2xl">
        {acceptingOrders ? (
          <OrderForm />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-muted">
              Want to know when we&apos;re open for orders again? Leave your email and
              we&apos;ll let you know.
            </p>
            <NotifyMeForm />
          </div>
        )}
      </Container>
    </div>
  );
}
