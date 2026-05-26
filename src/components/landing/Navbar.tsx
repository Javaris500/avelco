"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingContext";

const NAV_LINKS = [
  { id: "services", label: "Services" },
  { id: "the-system", label: "The System" },
  { id: "faq", label: "FAQ" },
];

export function Navbar() {
  const { setOpen } = useBooking();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll-aware border + shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is in view to highlight the nav link
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  function openBooking() {
    setMobileOpen(false);
    setOpen(true);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-bg/80 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-border/60 shadow-[0_8px_28px_-20px_rgb(0_0_0_/_0.9)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Avel home"
          className="group inline-flex items-baseline font-display text-2xl font-bold tracking-tight text-text"
        >
          <span>avel</span>
          <span
            aria-hidden
            className="text-accent transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_16px_rgb(0_146_202_/_0.6)]"
          >
            .
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-9 text-sm md:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`group relative inline-flex items-center gap-2 transition-colors duration-150 ${
                  isActive ? "text-text" : "text-text-muted hover:text-text"
                }`}
              >
                <span
                  aria-hidden
                  className={`size-1 rounded-full bg-accent transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span className="relative">
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-accent/70 transition-transform duration-200 ease-out ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </span>
              </a>
            );
          })}
        </nav>

        {/* Right cluster — desktop CTA + mobile menu trigger */}
        <div className="flex items-center gap-3">
          {/* Desktop Book a call with pulse */}
          <span className="relative hidden md:inline-flex">
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
              <Button onClick={() => setOpen(true)} size="md">
                Book a call
              </Button>
            </span>
          </span>

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-md border border-border text-text-muted transition-colors hover:border-accent/50 hover:text-text md:hidden"
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 block h-[1.5px] w-full bg-current transition-transform duration-200 ${
                  mobileOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 block h-[1.5px] w-full bg-current transition-transform duration-200 ${
                  mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-panel"
            initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-border bg-bg md:hidden"
          >
            <nav
              aria-label="Mobile"
              className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-6"
            >
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between gap-3 border-b border-border py-4 font-display text-xl font-medium text-text"
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] tabular-nums text-text-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{link.label}</span>
                  </span>
                  <span aria-hidden className="text-text-subtle">
                    →
                  </span>
                </a>
              ))}
              <button
                type="button"
                onClick={openBooking}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent bg-accent px-8 py-4 font-display text-base font-medium tracking-tight text-bg transition-[background-color,box-shadow] duration-200 ease-out hover:bg-accent-hover"
              >
                Book a call
                <span aria-hidden>→</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
