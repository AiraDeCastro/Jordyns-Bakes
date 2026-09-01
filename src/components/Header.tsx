import Link from "next/link";
import { Container } from "./Container";

const NAV_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/order", label: "Order" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
        <Link href="/" className="font-display text-2xl font-semibold text-heading">
          Jordyn&apos;s Bakes
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-foreground"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent-deep">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
