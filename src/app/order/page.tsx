import { Container } from "@/components/Container";
import { OrderForm } from "@/components/OrderForm";

export default function OrderPage() {
  return (
    <div className="flex flex-1 flex-col py-16">
      <Container className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
        <h1 className="font-display text-3xl font-semibold text-heading">
          Request an order
        </h1>
        <p className="text-muted">
          Tell us about your event and we&apos;ll follow up with a quote.
        </p>
      </Container>
      <Container className="mx-auto mt-10 max-w-2xl">
        <OrderForm />
      </Container>
    </div>
  );
}
