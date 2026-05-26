import Link from "next/link";
import { Eyebrow, Reveal, SectionHeading } from "./Reveal";
import { AnimatedPrice } from "./AnimatedPrice";

type Tier = {
  name: string;
  duration: string;
  claim: string;
  forText: string;
  priceValue: number;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    duration: "~1 week",
    claim: "Ship one feature. End to end. In a week.",
    forText:
      "One well-scoped feature, in production. For validating a hypothesis before a bigger build.",
    priceValue: 4000,
  },
  {
    name: "Standard",
    duration: "~2 weeks",
    claim: "An MVP, an AI feature, or a working internal tool — built and shipped.",
    forText: "Real software, not a prototype. Production-ready in two weeks.",
    priceValue: 10000,
  },
  {
    name: "Enterprise",
    duration: "3–6 weeks",
    claim: "A full system. Multi-feature, integrated, shipped.",
    forText:
      "For replacing a stitched-together mess — spreadsheets, contractors, half-built tools — with one product that runs.",
    priceValue: 25000,
  },
];

function Card({ tier, delay }: { tier: Tier; delay: number }) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className="group relative flex flex-col rounded-xl border border-border bg-surface/30 p-8 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent/50 hover:bg-surface/50"
    >
      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        {tier.duration}
      </div>
      <h3 className="font-display text-3xl font-bold tracking-tight text-text">
        {tier.name}
      </h3>
      <p className="mt-4 text-base text-text">{tier.claim}</p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        {tier.forText}
      </p>
      <div className="mt-auto pt-10">
        <div className="font-display text-2xl font-bold tabular-nums text-text">
          <AnimatedPrice value={tier.priceValue} />
        </div>
        <Link
          href="#cta"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-all duration-150 ease-out group-hover:gap-2.5"
        >
          Book a call
          <span aria-hidden>→</span>
        </Link>
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
          Three sprints. One outcome:{" "}
          <span className="italic-emph">shipped</span>.
        </SectionHeading>
      </Reveal>
      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier, i) => (
          <Card key={tier.name} tier={tier} delay={0.1 + i * 0.1} />
        ))}
      </div>
    </section>
  );
}
