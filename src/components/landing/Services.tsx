"use client";

import { Eyebrow, Reveal, SectionHeading } from "./Reveal";
import { useBooking } from "@/components/booking/BookingContext";

type Specialty = {
  name: string;
  duration: string;
  claim: string;
  forText: string;
  featured?: boolean;
  featuredLabel?: string;
};

const SPECIALTIES: Specialty[] = [
  {
    name: "AI Agents",
    duration: "1–3 weeks",
    claim:
      "Autonomous systems. The workflows you used to run manually — now they run themselves.",
    forText: "For founders drowning in repeat operations.",
  },
  {
    name: "Chatbots",
    duration: "1–2 weeks",
    claim:
      "Conversational interfaces — support, sales, or internal. Wherever your team is answering the same questions twice.",
    forText: "For teams that need 24/7 touch points.",
  },
  {
    name: "On-Site Builds",
    duration: "3–6 weeks",
    claim:
      "We come to you. Software built around your physical operations — multi-location, field ops, brick-and-mortar.",
    forText: "Rare. Most firms won't do this.",
    featured: true,
    featuredLabel: "We come to you",
  },
];

function Card({ specialty, delay }: { specialty: Specialty; delay: number }) {
  const featured = specialty.featured;
  const { setOpen } = useBooking();
  return (
    <Reveal
      as="article"
      delay={delay}
      className={`group relative flex flex-col rounded-xl p-8 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-1 ${
        featured
          ? "border border-accent/50 bg-accent-soft shadow-[0_0_48px_-16px_rgb(0_146_202_/_0.55)] hover:border-accent hover:bg-accent-soft"
          : "border border-border bg-surface/30 hover:border-accent/50 hover:bg-surface/50"
      }`}
    >
      <div
        className={`mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] ${
          featured
            ? "border border-accent/60 bg-accent/10 text-accent"
            : "border border-border bg-bg/60 text-text-muted"
        }`}
      >
        <span
          aria-hidden
          className={`size-1.5 rounded-full ${featured ? "bg-accent shadow-[0_0_8px_1px_rgb(0_146_202_/_0.7)]" : "bg-accent"}`}
        />
        {featured ? specialty.featuredLabel : specialty.duration}
      </div>

      <h3 className="font-display text-3xl font-bold tracking-tight text-text">
        {specialty.name}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-text">
        {specialty.claim}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        {specialty.forText}
      </p>

      <div className="mt-auto pt-10">
        {featured && (
          <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-text-subtle tabular-nums">
            Typical sprint · {specialty.duration}
          </p>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-150 ease-out group-hover:gap-2.5 ${
            featured ? "text-accent" : "text-accent"
          }`}
        >
          Book a call
          <span aria-hidden>→</span>
        </button>
      </div>
    </Reveal>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="mx-auto w-full max-w-6xl px-6 py-28 md:py-44"
    >
      <Reveal>
        <Eyebrow number="02">Services</Eyebrow>
        <SectionHeading className="max-w-3xl">
          Three specialties. One outcome:{" "}
          <span className="italic-emph">shipped</span>.
        </SectionHeading>
      </Reveal>
      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {SPECIALTIES.map((specialty, i) => (
          <Card
            key={specialty.name}
            specialty={specialty}
            delay={0.1 + i * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
