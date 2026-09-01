import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import portraitA from "@/assets/hair/campaign-a.jpg";
import portraitB from "@/assets/hair/campaign-b.jpg";

/**
 * Variantes de copy de campagne — faciles à permuter pour des tests.
 * A = séquence "Trouvez la différence."
 * B = message direct sur l'apparence.
 * C = variante plus ouverte.
 */
export type CampaignVariant = "A" | "B" | "C";

const STEP_DELAYS = [0, 1500, 2900, 4300];

export function HairHeroCampaign({ variant = "A" }: { variant?: CampaignVariant }) {
  const { t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [split, setSplit] = useState(50);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      if (reduce) {
        setStep(3);
        return;
      }
      timers = STEP_DELAYS.map((d, i) => setTimeout(() => setStep(i), d));
    };
    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(62, Math.max(38, x)));
  };

  const headline =
    variant === "B" ? (
      <>
        {t("La perte de cheveux peut changer", "Hair loss can change")}
        <br />
        {t("bien plus que l'apparence.", "far more than appearance.")}
      </>
    ) : variant === "C" ? (
      <>
        {t("Parfois, ce n'est pas seulement", "Sometimes it isn't only")}
        <br />
        {t("une histoire de cheveux.", "a story about hair.")}
      </>
    ) : step === 0 ? (
      <>
        {t("Trouvez", "Spot")}
        <br className="sm:hidden" />
        <span className="sm:inline"> </span>
        {t("la différence.", "the difference.")}
      </>
    ) : step === 1 ? (
      <>{t("Celle-ci, vous la voyez.", "This one, you can see.")}</>
    ) : step === 2 ? (
      <>{t("Les autres ne se voient pas toujours.", "The others aren't always visible.")}</>
    ) : (
      <>
        {t("La perte de cheveux peut changer", "Hair loss can change")}
        <br />
        {t("bien plus que l'apparence.", "far more than appearance.")}
      </>
    );

  const showAnnotation = variant !== "A" || step >= 1;
  const showFinal = variant !== "A" || step >= 3;

  return (
    <section ref={wrapRef} className="relative border-b border-border bg-cream">
      <div
        onMouseMove={onMove}
        onMouseLeave={() => setSplit(50)}
        className="relative h-[86vh] min-h-[560px] w-full overflow-hidden"
      >
        {/* Portrait A — densité plus faible (moitié gauche) */}
        <img
          src={portraitA}
          alt={t(
            "Portrait d'un homme, densité capillaire plus faible — campagne MAAN Hair Management",
            "Portrait of a man with lower hair density — MAAN Hair Management campaign",
          )}
          width={1024}
          height={1280}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-[clip-path] duration-500 ease-[var(--ease)]"
          style={{
            clipPath: `inset(0 ${100 - split}% 0 0)`,
            transform: reduce ? undefined : "scale(1.012)",
          }}
        />
        {/* Portrait B — densité plus importante (moitié droite) */}
        <img
          src={portraitB}
          alt={t(
            "Portrait du même homme, densité capillaire plus importante — campagne MAAN",
            "Portrait of the same man with higher hair density — MAAN campaign",
          )}
          width={1024}
          height={1280}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-[clip-path] duration-500 ease-[var(--ease)]"
          style={{
            clipPath: `inset(0 0 0 ${split}%)`,
            transform: reduce ? undefined : "scale(1.012)",
          }}
        />

        {/* Séparation centrale extrêmement fine */}
        <div
          className="absolute inset-y-0 z-[6] w-px bg-cream/70 transition-[left] duration-500 ease-[var(--ease)]"
          style={{ left: `${split}%` }}
        />

        {/* Annotation éditoriale terracotta autour de la zone capillaire */}
        <div
          aria-hidden
          className={cn(
            "absolute z-[7] transition-all duration-1000 ease-[var(--ease)]",
            "left-1/2 top-[8%] h-[16%] w-[46%] -translate-x-1/2 rounded-[999px] border border-clay/70",
            showAnnotation ? "opacity-100" : "scale-[0.98] opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "absolute z-[7] hidden transition-opacity duration-1000 sm:block",
            showAnnotation ? "opacity-100" : "opacity-0",
          )}
          style={{ left: "50%", top: "24%", width: "1px", height: "10%", background: "var(--clay)" }}
        />

        {/* Voile crème pour la lisibilité du texte */}
        <div className="absolute inset-x-0 bottom-0 z-[8] h-[62%] bg-[linear-gradient(0deg,var(--cream,#f3ece2)_10%,rgba(243,236,226,0.72)_45%,transparent_100%)]" />

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-6xl px-6 pb-12 lg:pb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">Hair Management</p>
            <h2
              key={String(step) + variant}
              className="mt-5 max-w-[20ch] animate-fade-in text-balance font-section text-[2.4rem] font-medium leading-[0.98] tracking-tight lg:text-[4.4rem]"
            >
              {headline}
            </h2>

            <div
              className={cn(
                "transition-all duration-700 ease-[var(--ease)]",
                showFinal ? "mt-6 translate-y-0 opacity-100" : "pointer-events-none mt-6 translate-y-2 opacity-0",
              )}
            >
              <p className="max-w-[36ch] text-pretty text-base text-foreground/70 lg:text-lg">
                {t("Chaque homme la vit différemment.", "Every man experiences it differently.")}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  to="/questionnaire/$slug"
                  params={{ slug: "cheveux" }}
                  className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
                >
                  {t("Découvrir les solutions", "Discover the options")}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
