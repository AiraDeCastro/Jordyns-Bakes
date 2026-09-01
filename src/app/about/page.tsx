import { Container } from "@/components/Container";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col py-16">
      <Container className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
        <h1 className="font-display text-3xl font-semibold text-heading">About Jordyn</h1>

        {/* Placeholder copy — replace with Jordyn's real bio (Milestone 7: Content & assets). */}
        <p className="text-muted">
          Jordyn&apos;s Bakes started as a love of baking for the people closest to me, and
          grew into a small custom cake and cupcake business. Every order is handmade in
          small batches, designed around your event and your vision — whether that&apos;s a
          wedding, a birthday, a holiday gathering, or a graduation to celebrate.
        </p>

        <div className="rounded-2xl border border-border bg-surface p-6 text-left">
          <h2 className="font-display text-lg font-semibold text-heading">
            How ordering works
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <li>
              Submit an order request with your event details — occasion, date, size, and
              design inspiration.
            </li>
            <li>
              Orders need at least <strong className="text-heading">2 weeks</strong>&apos;
              notice, since every cake is made to order.
            </li>
            <li>
              Every order is quoted individually based on design and size — there&apos;s no
              fixed price list, so you&apos;ll hear back with a quote after submitting your
              request.
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
