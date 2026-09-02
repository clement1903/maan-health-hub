import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";


export type Soin = {
  n: string;
  tag: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
  points: string[];
  slug: string;
};

export function SoinsShowcase({ soins }: { soins: Soin[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const current = soins[active]!;

  return (
    <div className="mt-10">
      {/* Selector */}
      <div className="flex flex-wrap gap-2">
        {soins.map((s, i) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={cn(
              "group relative overflow-hidden rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-500 ease-[var(--ease)]",
              active === i
                ? "border-clay bg-clay text-cream shadow-[0_10px_30px_-12px_var(--clay)]"
                : "border-border bg-background text-muted hover:border-clay/40 hover:text-foreground",
            )}
          >
            <span className="relative z-10">
              {s.n} · {s.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-border bg-border lg:grid-cols-12">
        <div className="relative overflow-hidden bg-background lg:col-span-6">
          {soins.map((s, i) => (
            <img
              key={s.n}
              src={s.img}
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              width={1024}
              height={768}
              className={cn(
                "h-full min-h-[300px] w-full object-cover transition-all duration-[900ms] ease-[var(--ease)]",
                i === active
                  ? "scale-100 opacity-100"
                  : "absolute inset-0 scale-105 opacity-0",
              )}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,transparent,color-mix(in_oklab,var(--foreground)_18%,transparent))]" />

        </div>

        <div key={current.n} className="animate-[rise_0.55s_var(--ease)_both] bg-background p-8 lg:col-span-6 lg:p-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-clay">
            {current.n} · {current.tag}
          </span>
          <p className="mt-3 max-w-[42ch] text-pretty text-muted">{current.desc}</p>
          <ul className="mt-7 space-y-3">
            {current.points.map((p, i) => (
              <li
                key={p}
                style={{ animationDelay: `${100 + i * 70}ms` }}
                className="flex animate-[rise_0.5s_var(--ease)_both] items-start gap-3 border-b border-border pb-3 text-sm"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span className="text-pretty">{p}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/questionnaire/$slug"
            params={{ slug: current.slug }}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:bg-clay-deep hover:gap-3"
          >
            {t("Commencer ma consultation médicale", "Start my medical consultation")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
