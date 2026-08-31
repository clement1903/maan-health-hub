import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Surface({
  children,
  className,
  interactive,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-border bg-cream p-6 shadow-[0_20px_60px_-56px_var(--foreground)] transition-all duration-500 ease-[var(--ease)]",
        interactive && "hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-52px_var(--foreground)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{children}</p>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "clay" | "soft";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
        tone === "clay" && "bg-clay text-cream",
        tone === "soft" && "bg-sand text-foreground/80",
        tone === "neutral" && "border border-border text-muted",
      )}
    >
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[16px] bg-sand/70",
        className,
      )}
    />
  );
}

export function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-border bg-background/60 px-8 py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sand text-clay">
        <span className="text-lg">◍</span>
      </div>
      <h3 className="mt-5 font-section text-lg font-medium tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-[42ch] text-pretty text-sm text-muted">{desc}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ClayButton({
  children,
  onClick,
  disabled,
  variant = "solid",
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-300 ease-[var(--ease)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
        variant === "solid"
          ? "bg-clay text-cream hover:bg-clay-deep"
          : "border border-border bg-background text-foreground hover:border-clay hover:text-clay",
        className,
      )}
    >
      {children}
    </button>
  );
}
