import Link from "next/link";
import { Container } from "@/components/Container";
import { StatusBanner } from "@/components/StatusBanner";
import { CakeIllustration } from "@/components/CakeIllustration";
import { OCCASIONS } from "@/lib/occasions";
import { getAcceptingOrders } from "@/lib/settings";

// The accepting-orders banner must reflect the live database value, not
// a value baked in at build time, since Jordyn can flip it at any point.
export const dynamic = "force-dynamic";

export default async function Home() {
  const acceptingOrders = await getAcceptingOrders();

  return (
    <div className="flex flex-1 flex-col">
      <StatusBanner acceptingOrders={acceptingOrders} />

      <section className="flex flex-1 flex-col items-center justify-center py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-6 text-center">
          <CakeIllustration className="h-20 w-20" />
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
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <Container className="flex flex-col items-center gap-6">
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
    </div>
  );
}
