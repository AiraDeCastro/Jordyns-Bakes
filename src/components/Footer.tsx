import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col gap-1 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Jordyn&apos;s Bakes</p>
        <p>Custom cakes &amp; cupcakes for weddings, events, birthdays, holidays &amp; graduations.</p>
      </Container>
    </footer>
  );
}
