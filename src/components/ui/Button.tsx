import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-[transform,background-color,border-color,color] duration-150 ease-out focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-bg hover:bg-accent-hover active:translate-y-px",
  ghost:
    "border border-border text-text hover:border-border-strong hover:bg-surface-muted active:translate-y-px",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

type AnchorProps = CommonProps & ComponentProps<typeof Link> & { href: string };

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...rest
}: AnchorProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`.trim();
  return (
    <Link className={classes} {...rest}>
      {children}
    </Link>
  );
}
