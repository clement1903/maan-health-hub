import { useState } from "react";
import { cn } from "@/lib/utils";

export type Etape = { n: string; title: string; desc: string; detail: string };

export function ParcoursStepper({ etapes }: { etapes: Etape[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {etapes.map((e, i) => {
        const active = open === i;
        return (
          <button
            key={e.n}
            type="button"
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
            aria-pressed={active}
            className={cn(
              "group relative overflow-hidden rounded-[20px] border p-7 text-left transition-all duration-500 ease-[var(--ease)] lg:p-8",
              active
                ? "-translate-y-1 border-clay/40 bg-cream shadow-[0_24px_60px_-32px_var(--clay)]"
                : "border-border bg-background hover:border-clay/25",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-0 h-full w-[3px] origin-top bg-clay transition-transform duration-700 ease-[var(--ease)]",
                active ? "scale-y-100" : "scale-y-0",
              )}
            />
            <div className="flex items-baseline justify-between">
              <span className="font-display text-5xl font-medium text-clay/40 transition-colors duration-500 group-hover:text-clay/70">
                {e.n}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                Étape
              </span>
            </div>
            <h3 className="mt-6 font-section text-xl font-medium tracking-tight">{e.title}</h3>
            <p className="mt-2 text-pretty text-sm text-muted">{e.desc}</p>
            <div
              className={cn(
                "grid transition-all duration-500 ease-[var(--ease)]",
                active ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <p className="overflow-hidden text-pretty border-t border-border pt-4 text-sm text-foreground/80">
                {e.detail}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
