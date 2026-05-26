import { Eyebrow, Reveal, SectionHeading } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Scope the sprint.",
    body: "Pick a tier. We lock scope and price in a 30-minute call.",
  },
  {
    n: "02",
    title: "We build.",
    body: "You don't manage contractors, run standups, or chase status. 50% upfront, 50% on delivery.",
  },
  {
    n: "03",
    title: "Ship.",
    body: "Production code, full handoff, ready to run.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl px-6 py-28 md:py-44"
    >
      <Reveal>
        <Eyebrow number="03">Process</Eyebrow>
        <SectionHeading className="max-w-3xl">
          How we <span className="italic-emph">ship</span>.
        </SectionHeading>
      </Reveal>

      <div className="relative mt-20">
        {/* Connecting hairline behind the numerals (desktop only) */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[3.5rem] hidden h-px bg-gradient-to-r from-accent/70 via-accent/30 to-accent/0 md:block"
        />
        <ol className="grid gap-14 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delay={0.1 + i * 0.1} className="relative">
              {/* Per-step top hairline on mobile */}
              <div
                aria-hidden
                className="mb-6 h-px w-12 bg-accent md:hidden"
              />
              <div className="flex items-baseline gap-6">
                <span className="font-display text-6xl font-bold leading-none tracking-tight tabular-nums text-accent md:text-8xl">
                  {step.n}
                </span>
                <h3 className="font-display text-xl font-bold tracking-tight text-text md:text-2xl">
                  {step.title}
                </h3>
              </div>
              <p className="mt-6 max-w-sm text-text-muted">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
