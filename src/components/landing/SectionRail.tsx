"use client";

import { useEffect, useState } from "react";

const SECTIONS: { id: string; label: string }[] = [
  { id: "problem", label: "01 Problem" },
  { id: "services", label: "02 Services" },
  { id: "the-system", label: "03 System" },
  { id: "faq", label: "04 FAQ" },
  { id: "cta", label: "05 Book" },
];

export function SectionRail() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`pointer-events-auto flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${
              isActive ? "text-accent" : "text-text-subtle hover:text-text-muted"
            }`}
          >
            <span
              aria-hidden
              className={`h-px transition-all duration-300 ${
                isActive ? "w-8 bg-accent" : "w-3 bg-border"
              }`}
            />
            <span>{s.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
