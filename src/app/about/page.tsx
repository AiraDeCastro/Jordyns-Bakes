import { Container } from "@/components/Container";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col py-16">
      <Container className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
        <h1 className="font-display text-3xl font-semibold text-heading">About Jordyn</h1>

        {/* Draft bio (Milestone 7) — written for Jordyn to edit or approve, not her own words yet. */}
        <div className="flex flex-col gap-4 text-left text-muted">
          <p>
            Jordyn&apos;s Bakes grew out of a simple love for baking — the kind that started
            with cakes for family and friends, made with whatever was in the kitchen and a
            lot of trial and error along the way. That love turned into something bigger: a
            small, made-to-order cake and cupcake business built one request at a time.
          </p>
          <p>
            Every order is handmade from scratch in small batches, designed around your
            event and your vision. Whether you&apos;re celebrating a wedding, a birthday, a
            holiday, or a graduation, the goal is the same: a cake that feels made just for
            you — because it is.
          </p>
        </div>

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
