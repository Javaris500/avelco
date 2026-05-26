import { Eyebrow, Reveal, SectionHeading } from "./Reveal";

const PILLARS = [
  {
    n: "01",
    title: "Plan-first.",
    body: "Every build starts with a written plan — scope, dependencies, decisions, exit criteria. No code until the plan is locked.",
    why: "Scope doesn't drift if the plan is signed off.",
  },
  {
    n: "02",
    title: "Multi-pass review.",
    body: "Every part of the codebase passes through separate review processes — security, performance, integration — before it ships.",
    why: "Catches the mistakes that pile up in single-developer builds.",
  },
  {
    n: "03",
    title: "Documented as built.",
    body: "Each project ships with a written record: architecture decisions, what runs where, how to operate it. No tribal knowledge handed off in a Loom video.",
    why: "You actually own the software when we're done.",
  },
];

export function TheSystem() {
  return (
    <section
      id="the-system"
      className="relative isolate overflow-hidden border-y border-border bg-surface-muted/40"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-28 md:py-44">
        <Reveal>
          <Eyebrow number="04">Proof</Eyebrow>
          <h2
            className="max-w-4xl font-display font-bold leading-[1.02] tracking-tight text-text"
            style={{ fontSize: "clamp(3rem, 7.5vw, 7rem)" }}
          >
            The <span className="italic-emph">system</span>.
          </h2>
          <p className="mt-10 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            Avel runs on a proprietary build system. It&apos;s the reason scope
            is fixed, prices don&apos;t move, and the same quality ships every
            time.
          </p>
        </Reveal>

        {/* Manifesto rows — each pillar a full-width row with hairline divider */}
        <ul className="mt-24 border-t border-border">
          {PILLARS.map((pillar, i) => (
            <Reveal as="li" key={pillar.title} delay={0.1 + i * 0.1}>
              <div className="grid gap-8 border-b border-border py-14 md:grid-cols-12 md:gap-12 md:py-20">
                <div className="md:col-span-5">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] tabular-nums text-text-subtle">
                      {pillar.n}
                    </span>
                    <span aria-hidden className="h-px w-12 bg-accent" />
                  </div>
                  <h3
                    className="mt-6 font-display font-bold leading-[1.05] tracking-tight text-text"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                  >
                    {pillar.title}
                  </h3>
                </div>
                <div className="md:col-span-7 md:pt-2">
                  <p className="text-lg leading-relaxed text-text md:text-xl">
                    {pillar.body}
                  </p>
                  <p className="mt-8 font-display text-lg leading-snug text-text-muted md:text-xl">
                    <span className="italic-emph">{pillar.why}</span>
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.4} className="mt-32 text-center md:mt-40">
          <p
            className="mx-auto max-w-4xl font-display font-medium leading-[1.05] tracking-tight text-text"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
          >
            You hire a build firm.
            <br className="hidden md:inline" />{" "}
            You get the <span className="italic-emph">system</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
