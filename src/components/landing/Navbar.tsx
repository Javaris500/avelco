import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Avel home"
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-text"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-md bg-text text-bg"
          >
            <span className="-mt-px font-display text-sm font-bold leading-none">
              a
            </span>
          </span>
          <span className="lowercase">avel</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm text-text-muted md:flex"
        >
          <a className="hover:text-text" href="#how-it-works">
            How it works
          </a>
          <a className="hover:text-text" href="#services">
            Services
          </a>
          <a className="hover:text-text" href="#faq">
            FAQ
          </a>
        </nav>

        <span className="relative inline-flex">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-md border-2 border-accent animate-cta-pulse"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-md border-2 border-accent animate-cta-pulse"
            style={{ animationDelay: "1.2s" }}
          />
          <span className="relative z-10 inline-flex">
            <Button href="#cta" size="md">
              Book a call
            </Button>
          </span>
        </span>
      </div>
    </header>
  );
}
