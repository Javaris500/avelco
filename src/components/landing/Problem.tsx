import { Eyebrow, Reveal, SectionHeading } from "./Reveal";

const LEFT = {
  label: "For SaaS founders shipping AI",
  items: [
    "Your competitors just shipped AI.",
    "Your roadmap is three quarters behind.",
    "Your best engineer is already maxed.",
    "Every contractor wants a retainer for work that should take two weeks.",
  ],
};

const RIGHT = {
  label: "For owners running 2–5 businesses",
  items: [
    "You manage three businesses from six different spreadsheets.",
    "One process is bleeding money every month. You already know which one.",
    "You spend more time running it than growing it.",
    'Every "all-in-one platform" wants $40k upfront and a six-month rollout.',
  ],
};

function Column({ data, delay }: { data: typeof LEFT; delay: number }) {
  return (
    <Reveal delay={delay} className="border-l border-accent/40 pl-6 md:pl-8">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-text-subtle">
        {data.label}
      </p>
      <ul className="mt-8 space-y-6">
        {data.items.map((item) => (
          <li
            key={item}
            className="font-display text-xl font-medium leading-snug text-text md:text-2xl"
          >
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Problem() {
  return (
    <section
      id="problem"
      className="mx-auto w-full max-w-6xl px-6 py-28 md:py-44"
    >
      <Reveal>
        <Eyebrow number="01">The problem</Eyebrow>
        <SectionHeading className="max-w-3xl">
          You&apos;re in one of two <span className="italic-emph">spots</span>.
        </SectionHeading>
      </Reveal>
      <div className="mt-20 grid gap-14 md:grid-cols-2 md:gap-16">
        <Column data={LEFT} delay={0.1} />
        <Column data={RIGHT} delay={0.2} />
      </div>
    </section>
  );
}
