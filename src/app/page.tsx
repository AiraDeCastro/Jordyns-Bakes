import Link from "next/link";
import { Container } from "@/components/Container";
import { StatusBanner } from "@/components/StatusBanner";
import { OCCASIONS } from "@/lib/occasions";
import { getAcceptingOrders } from "@/lib/settings";

// Mirrors the "How ordering works" list on the About page — keep these
// in sync if the policy ever changes (lead time, quoting approach).
const ORDER_STEPS = [
  "Submit an order request with your event details — occasion, date, size, and design inspiration.",
  "Orders need at least 2 weeks' notice, since every cake is made to order.",
  "Every order is quoted individually — there's no fixed price list, so you'll hear back with a quote after submitting your request.",
];

// The accepting-orders banner must reflect the live database value, not
// a value baked in at build time, since Jordyn can flip it at any point.
export const dynamic = "force-dynamic";

export default async function Home() {
  const acceptingOrders = await getAcceptingOrders();

  return (
    <div className="flex flex-1 flex-col">
      <StatusBanner acceptingOrders={acceptingOrders} />

      <section
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-cover bg-center py-20 sm:py-28"
        style={{ backgroundImage: "url(/video/hero-poster.jpg)" }}
      >
        {/* Hidden entirely under prefers-reduced-motion — the section's own
            poster background (set above) shows through as a static fallback
            instead of an autoplaying video. */}
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero-mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
          <source src="/video/hero-desktop.mp4" type="video/mp4" />
        </video>
        {/* Dark scrim so the headline card and its text stay legible no
            matter what's happening in the footage behind it. */}
        <div className="absolute inset-0 bg-heading/35" />

        <Container className="relative flex flex-col items-center text-center">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-surface/90 px-8 py-10 backdrop-blur-sm sm:px-12">
            <h1 className="font-display max-w-xl text-4xl font-semibold text-heading sm:text-5xl">
              Custom cakes &amp; cupcakes for life&apos;s sweetest moments
            </h1>
            <p className="max-w-md text-lg text-muted">
              Handmade in small batches for weddings, events, birthdays, holidays, and
              graduations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/order"
                className="rounded-full bg-accent-deep px-6 py-3 text-sm font-semibold text-surface transition-colors hover:bg-accent"
              >
                Request an order
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-heading transition-colors hover:border-accent-deep hover:text-accent-deep"
              >
                View the gallery
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="border-t border-border bg-repeat py-14"
        style={{ backgroundImage: "url(/images/occasions-pattern.jpg)", backgroundSize: "320px" }}
      >
        <Container className="flex flex-col items-center gap-6 rounded-2xl bg-surface/90 px-8 py-8 backdrop-blur-sm sm:px-12">
          <h2 className="font-display text-xl font-semibold text-heading">
            Cakes &amp; cupcakes for every occasion
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {OCCASIONS.map((occasion) => (
              <Link
                key={occasion}
                href={`/gallery?occasion=${encodeURIComponent(occasion)}`}
                className="rounded-full bg-accent-tint px-4 py-2 text-sm font-medium text-accent-deep transition-colors hover:bg-accent hover:text-surface"
              >
                {occasion}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16">
        <Container className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="font-display text-xl font-semibold text-heading">About Jordyn</h2>
          <p className="text-muted">
            Jordyn&apos;s Bakes grew out of a simple love for baking — the kind that started
            with cakes for family and friends, made with whatever was in the kitchen and a
            lot of trial and error along the way. Every order today is still handmade from
            scratch in small batches, designed around your event and your vision.
          </p>
          <Link
            href="/about"
            className="text-sm font-semibold text-accent-deep hover:text-accent"
          >
            Read Jordyn&apos;s story →
          </Link>
        </Container>
      </section>

      <section
        className="border-t border-border bg-repeat py-16"
        style={{ backgroundImage: "url(/images/how-it-works-pattern.jpg)", backgroundSize: "320px" }}
      >
        <Container className="flex flex-col items-center gap-10 rounded-2xl bg-surface/90 px-8 py-10 backdrop-blur-sm sm:px-12">
          <h2 className="font-display text-xl font-semibold text-heading">
            How ordering works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {ORDER_STEPS.map((step, index) => (
              <div key={step} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-deep text-sm font-semibold text-surface">
                  {index + 1}
                </span>
                <p className="max-w-xs text-sm text-muted">{step}</p>
              </div>
            ))}
          </div>
          <Link
            href="/order"
            className="rounded-full bg-accent-deep px-6 py-3 text-sm font-semibold text-surface transition-colors hover:bg-accent"
          >
            Request an order
          </Link>
        </Container>
      </section>
    </div>
  );
}
