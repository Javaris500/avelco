"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useBooking } from "./BookingContext";

const BUILD_OPTIONS = [
  "AI agent",
  "Chatbot",
  "On-site build",
  "MVP",
  "AI feature",
  "Internal tool",
  "Operations system",
  "Other",
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "This month",
  "Next quarter",
  "Exploring",
];

export function BookingFormModal() {
  const { open, setOpen } = useBooking();
  const reduce = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  function close() {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setSending(false);
    }, 350);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // TODO: replace with real endpoint (Resend / webhook)
    console.log("[BookingForm] submission:", data);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    setSubmitted(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="booking-overlay"
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close booking form"
            onClick={close}
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-bg/85 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.32, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="no-scrollbar relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-accent/30 bg-surface-muted p-7 shadow-[0_0_64px_-12px_rgb(0_146_202_/_0.35)] md:p-10"
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-border text-text-muted transition-colors duration-150 hover:border-accent/60 hover:text-text"
            >
              <span aria-hidden className="text-lg leading-none">×</span>
            </button>

            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessState key="success" onClose={close} />
              ) : (
                <motion.div
                  key="form"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Eyebrow */}
                  <div className="mb-5 flex items-center gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
                    <span aria-hidden className="h-px w-10 bg-accent" />
                    <span>Book a call</span>
                  </div>

                  <h2
                    id="booking-title"
                    className="font-display font-bold leading-[1.05] tracking-tight text-text"
                    style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
                  >
                    Let&apos;s <span className="italic-emph">talk</span>.
                  </h2>
                  <p className="mt-3 text-text-muted">
                    30 minutes. We scope, you decide. No retainers, no surprises.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                    <Field label="Name" name="name" required autoComplete="name" />
                    <Field label="Email" name="email" type="email" required autoComplete="email" />
                    <Field
                      label="Company / role"
                      name="company"
                      placeholder="Founder at X · CTO at Y"
                      autoComplete="organization"
                    />
                    <Select
                      label="What do you want built?"
                      name="build_type"
                      options={BUILD_OPTIONS}
                    />
                    <Textarea
                      label="Tell us about it"
                      name="details"
                      required
                      rows={4}
                      placeholder="What's the problem you need solved?"
                    />
                    <Select
                      label="When do you need it shipped?"
                      name="timeline"
                      options={TIMELINE_OPTIONS}
                    />

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={sending}
                        className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-accent bg-accent px-8 py-4 font-display text-base font-medium tracking-tight text-bg transition-[background-color,border-color,box-shadow,opacity] duration-200 ease-out hover:bg-accent-hover hover:shadow-[0_0_32px_4px_rgb(0_146_202_/_0.4)] disabled:opacity-60"
                      >
                        <span>{sending ? "Sending…" : "Send"}</span>
                        {!sending && (
                          <span
                            aria-hidden
                            className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                          >
                            →
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Label({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-text-subtle">
      {children}
      {required && (
        <span aria-hidden className="text-accent">
          *
        </span>
      )}
    </span>
  );
}

const inputClasses =
  "w-full border-b border-border bg-transparent py-2.5 text-base text-text placeholder:text-text-subtle/70 transition-colors duration-150 focus:border-accent focus:outline-none";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <Label required={required}>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClasses}
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  required,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label required={required}>{label}</Label>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className={`${inputClasses} resize-none`}
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="relative block">
      <Label>{label}</Label>
      <select
        name={name}
        defaultValue=""
        className={`${inputClasses} cursor-pointer appearance-none pr-8`}
      >
        <option value="" className="bg-surface-muted text-text-subtle">
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface-muted text-text">
            {opt}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-1 text-text-subtle"
      >
        ▾
      </span>
    </label>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        aria-hidden
        className="mx-auto mb-6 grid size-16 place-items-center rounded-full border border-accent/60 bg-accent-soft text-accent shadow-[0_0_32px_-4px_rgb(0_146_202_/_0.4)]"
      >
        <span className="text-2xl leading-none">✓</span>
      </motion.div>
      <h3
        className="font-display font-bold leading-[1.05] tracking-tight text-text"
        style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
      >
        Thanks. We&apos;ll be in <span className="italic-emph">touch</span>.
      </h3>
      <p className="mt-4 text-text-muted">
        You&apos;ll hear from us within one business day.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:text-text"
      >
        Close
      </button>
    </motion.div>
  );
}
