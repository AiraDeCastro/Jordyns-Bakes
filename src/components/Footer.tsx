import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Jordyn&apos;s Bakes</p>
        <p>Custom cakes &amp; cupcakes for weddings, events, birthdays, holidays &amp; graduations.</p>
        <a
          href="https://www.instagram.com/jordynsbakes"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Jordyn's Bakes on Instagram"
          className="text-heading transition-colors hover:text-accent-deep"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </Container>
    </footer>
  );
}
