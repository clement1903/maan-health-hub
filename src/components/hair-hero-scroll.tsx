import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import portrait from "@/assets/hair/01-portrait.jpg";
import hairline from "@/assets/hair/02-hairline.jpg";
import macroHair from "@/assets/hair/03-macro-hair.jpg";
import macroScalp from "@/assets/hair/04-macro-scalp.jpg";
import throughSkin from "@/assets/hair/05-through-skin.jpg";
import follicle from "@/assets/hair/06-follicle.jpg";
import follicleMini from "@/assets/hair/07-follicle-mini.jpg";
import retour from "@/assets/hair/08-return.jpg";

const FRAMES = [portrait, hairline, macroHair, macroScalp, throughSkin, follicle, follicleMini, retour];

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function HairHeroScroll() {
  const { t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const el = wrapRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        setP(total > 0 ? clamp01(-rect.top / total) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  const n = FRAMES.length;
  const pos = p * (n - 1);

  if (reduce) {
    return (
      <section className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">Hair Management</p>
            <h2 className="mt-6 text-balance font-section text-[2.6rem] font-medium leading-[0.98] tracking-tight lg:text-[4.6rem]">
              {t("Perte de cheveux,", "Losing your hair,")}
              <br />
              {t("perte d'identité ?", "losing yourself?")}
            </h2>
          </div>
          <img
            src={portrait}
            alt={t("Portrait d'un homme — Hair Management MAAN", "Portrait of a man — MAAN Hair Management")}
            width={1536}
            height={1152}
            loading="lazy"
            decoding="async"
            className="w-full rounded-[26px] object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative border-b border-border bg-cream" style={{ height: "420vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Images en fondu-enchaîné avec léger zoom caméra */}
        {FRAMES.map((src, i) => {
          const d = Math.abs(pos - i);
          const opacity = clamp01(1 - d);
          const scale = 1 + 0.06 * clamp01(1 - Math.max(0, i - pos)); // zoom sortant
          return (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden={i > 0}
              width={1536}
              height={1152}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ opacity, transform: `scale(${scale})`, zIndex: i }}
            />
          );
        })}

        {/* Voile crème pour lisibilité */}
        <div className="absolute inset-0 z-[9] bg-[linear-gradient(90deg,var(--cream,#f3ece2)_0%,rgba(243,236,226,0.85)_34%,transparent_62%)]" />

        {/* Texte éditorial */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">Hair Management</p>
            <h2 className="mt-6 text-balance font-section text-[2.6rem] font-medium leading-[0.98] tracking-tight lg:text-[4.6rem]">
              {t("Perte de cheveux,", "Losing your hair,")}
              <br />
              {t("perte d'identité ?", "losing yourself?")}
            </h2>

            <div className="relative mt-8 h-16">
              <p
                className={cn(
                  "absolute inset-0 max-w-[40ch] text-pretty text-lg leading-relaxed text-foreground/80 transition-opacity duration-500",
                  pos < 2.5 ? "opacity-100" : "opacity-0",
                )}
              >
                {t(
                  "La perte de cheveux peut changer bien plus que votre apparence.",
                  "Hair loss can change far more than your appearance.",
                )}
              </p>
              <p
                className={cn(
                  "absolute inset-0 max-w-[40ch] text-pretty text-lg leading-relaxed text-foreground/80 transition-opacity duration-500",
                  pos >= 2.5 && pos < 5.5 ? "opacity-100" : "opacity-0",
                )}
              >
                {t(
                  "Sous la surface, chaque follicule répète son cycle.",
                  "Beneath the surface, every follicle repeats its cycle.",
                )}
              </p>
              <p
                className={cn(
                  "absolute inset-0 max-w-[40ch] text-pretty text-lg leading-relaxed text-foreground/80 transition-opacity duration-500",
                  pos >= 5.5 ? "opacity-100" : "opacity-0",
                )}
              >
                {t(
                  "Comprendre ce qui se passe est déjà une première étape.",
                  "Understanding what is happening is already a first step.",
                )}
              </p>
            </div>

            <div className="mt-10">
              <Link
                to="/questionnaire/$slug"
                params={{ slug: "cheveux" }}
                className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
              >
                {t("Comprendre ma perte de cheveux", "Understand my hair loss")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Barre de progression fine */}
        <div className="absolute bottom-8 left-1/2 z-10 h-px w-40 -translate-x-1/2 bg-foreground/10">
          <div className="h-full bg-clay transition-[width] duration-150 ease-linear" style={{ width: `${p * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
