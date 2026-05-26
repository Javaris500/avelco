"use client";

import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "./MagneticWrap";
import { Reveal } from "./Reveal";
import { useBooking } from "@/components/booking/BookingContext";

export function CTA() {
  const { setOpen } = useBooking();
  return (
    <section
      id="cta"
      className="relative isolate overflow-hidden border-t border-border bg-surface-muted/60"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 py-32 text-center md:py-44">
        <Reveal>
          <h2
            className="font-display font-bold leading-[1.02] tracking-tight text-text"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Pick a sprint. <span className="italic-emph">Book the call</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="mt-12">
          <div className="flex justify-center">
            <MagneticWrap strength={0.28}>
              <Button onClick={() => setOpen(true)} size="lg">
                Book a call →
              </Button>
            </MagneticWrap>
          </div>
        </Reveal>
        <Reveal delay={0.25} className="mt-6">
          <p className="text-text-muted">
            30 minutes. We scope, you decide. No retainers, no surprises.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
