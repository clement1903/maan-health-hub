import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * MANIFESTE — section storytelling pleine largeur.
 * Grandes lignes serif qui se révèlent au scroll, ton DTC assumé.
 */
export function Manifeste() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 quand la section entre, 1 quand son centre atteint le milieu de l'écran
        const p = (vh * 0.85 - rect.top) / (vh * 0.9);
        setProgress(Math.max(0, Math.min(1, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lines = [
    {
      text: t("RIEN À SIGNALER.", "NOTHING TO REPORT."),
      accent: false,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label={t("Manifeste MAAN", "MAAN manifesto")}
      className="relative overflow-hidden bg-foreground text-cream"
    >
      {/* halo terracotta */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--clay)_32%,transparent),transparent_65%)] blur-3xl"
        style={{ opacity: 0.35 + progress * 0.4 }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-36">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-clay transition-opacity duration-700"
          style={{ opacity: Math.min(1, progress * 2) }}
        >
          {t("Le manifeste", "The manifesto")}
        </p>

        <h2 className="mt-8 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
          {lines.map((line, i) => {
            // chaque ligne apparaît à un tiers de la progression
            const local = Math.max(0, Math.min(1, progress * 3 - i * 0.75));
            return (
              <span
                key={line.text}
                className={cn(
                  "block will-change-transform",
                  line.accent && "italic text-clay",
                )}
                style={{
                  opacity: 0.08 + local * 0.92,
                  transform: `translateY(${(1 - local) * 28}px)`,
                  filter: `blur(${(1 - local) * 4}px)`,
                  transition: "opacity 0.15s linear",
                }}
              >
                {line.text}
              </span>
            );
          })}
        </h2>

        <div
          className="mt-12 flex flex-wrap items-center gap-6 transition-all duration-700"
          style={{
            opacity: Math.max(0, progress * 3 - 2.2),
            transform: `translateY(${Math.max(0, (1 - (progress * 3 - 2.2)) * 20)}px)`,
          }}
        >
          <p className="max-w-[46ch] text-sm leading-relaxed text-cream/70">
            {t(
              "Un médecin en ligne, un traitement livré à domicile, un suivi dans votre poche. La santé masculine, sans détour et sans salle d'attente.",
              "A doctor online, treatment delivered to your door, follow-up in your pocket. Men's health, without detours and without waiting rooms.",
            )}
          </p>
          <Link
            to="/questionnaire"
            className="group inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
          >
            {t("Commencer mon évaluation", "Start my assessment")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* annotation manuscrite */}
        <p
          className="mt-8 font-signature text-2xl text-amber/90 transition-opacity duration-1000"
          style={{ opacity: Math.max(0, progress * 3 - 1.2) }}
        >
          {t("— La réponse préférée des hommes depuis toujours.", "— Men's favorite answer since forever.")}
        </p>
      </div>
    </section>
  );
}
