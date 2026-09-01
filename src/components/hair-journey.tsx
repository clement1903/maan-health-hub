import { useEffect, useMemo, useRef, useState } from "react";
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

/* ------------------------------------------------------------------ */
/* Séquence : une seule caméra qui avance puis ressort.                */
/* Chaque scène = un asset + une fenêtre de progression [in, out].     */
/* ------------------------------------------------------------------ */

type Scene = {
  src: string;
  /** fenêtre de visibilité dans la progression globale (0 → 1) */
  from: number;
  to: number;
  /** zoom de départ / d'arrivée : simule l'avancée de la caméra */
  scaleFrom: number;
  scaleTo: number;
  alt: { fr: string; en: string };
  eager?: boolean;
};

const SCENES: Scene[] = [
  {
    src: portrait,
    from: 0,
    to: 0.14,
    scaleFrom: 1,
    scaleTo: 1.28,
    alt: {
      fr: "Homme d'une trentaine d'années, ligne frontale légèrement dégarnie",
      en: "Man in his thirties with a slightly receding hairline",
    },
    eager: true,
  },
  {
    src: hairline,
    from: 0.1,
    to: 0.26,
    scaleFrom: 1.05,
    scaleTo: 1.3,
    alt: { fr: "Gros plan sur la ligne capillaire et les tempes", en: "Close-up of the hairline and temples" },
  },
  {
    src: macroHair,
    from: 0.22,
    to: 0.38,
    scaleFrom: 1.05,
    scaleTo: 1.32,
    alt: { fr: "Macro des cheveux : épaisseurs différentes", en: "Macro of hair strands of differing thickness" },
  },
  {
    src: macroScalp,
    from: 0.34,
    to: 0.5,
    scaleFrom: 1.05,
    scaleTo: 1.35,
    alt: { fr: "Macro du cuir chevelu : pores et points d'implantation", en: "Scalp macro: pores and emergence points" },
  },
  {
    src: throughSkin,
    from: 0.46,
    to: 0.6,
    scaleFrom: 1.08,
    scaleTo: 1.4,
    alt: { fr: "La surface du cuir chevelu devient translucide", en: "The scalp surface turns translucent" },
  },
  {
    src: follicle,
    from: 0.56,
    to: 0.76,
    scaleFrom: 1.1,
    scaleTo: 1.02,
    alt: { fr: "Follicule pileux vu sous la surface", en: "Hair follicle seen beneath the surface" },
  },
  {
    src: follicleMini,
    from: 0.72,
    to: 0.9,
    scaleFrom: 1.05,
    scaleTo: 1.14,
    alt: { fr: "Follicule progressivement miniaturisé", en: "Progressively miniaturized follicle" },
  },
  {
    src: retour,
    from: 0.87,
    to: 1.01,
    scaleFrom: 1.3,
    scaleTo: 1,
    alt: { fr: "Retour au même homme, vu un peu plus large", en: "Back to the same man, framed slightly wider" },
  },
];

/** Beats textuels : une idée courte par scène. */
const BEATS: Array<{ from: number; to: number; fr: string; en: string; kicker?: { fr: string; en: string } }> = [
  { from: 0, to: 0.12, fr: "Vos cheveux changent.", en: "Your hair is changing." },
  { from: 0.16, to: 0.3, fr: "Tout commence sous la surface.", en: "It all starts beneath the surface." },
  { from: 0.4, to: 0.52, fr: "À quelques microns près.", en: "A few microns away." },
  { from: 0.58, to: 0.72, fr: "Chaque cheveu suit son propre cycle.", en: "Every hair follows its own cycle." },
  {
    from: 0.74,
    to: 0.86,
    fr: "Au fil des cycles, certains follicules peuvent se miniaturiser.",
    en: "Over successive cycles, some follicles can miniaturize.",
  },
  { from: 0.9, to: 1.01, fr: "Maintenant, vous comprenez.", en: "Now you understand." },
];

const CYCLE_STEPS = [
  { fr: "Croissance", en: "Growth" },
  { fr: "Transition", en: "Transition" },
  { fr: "Repos", en: "Rest" },
  { fr: "Nouveau cycle", en: "New cycle" },
];

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function HairJourney() {
  const { t, lang } = useI18n();
  const reduced = usePrefersReducedMotion();

  return (
    <>
      {reduced ? <HairJourneyStatic /> : <HairJourneyScroll />}

      {/* 11 — Vous n'êtes pas seul */}
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Fréquence", "Prevalence")}
          </p>
          <h2 className="mt-4 max-w-[18ch] text-balance font-section text-4xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
            {t("Vous n'êtes pas le seul. Loin de là.", "You are not the only one. Far from it.")}
          </h2>
          <PeopleViz />
          <p className="mt-10 max-w-[60ch] text-xs leading-relaxed text-muted">
            {t(
              "[CONTENU MÉDICAL À VALIDER] — les données chiffrées et leurs sources scientifiques seront ajoutées après validation médicale.",
              "[MEDICAL CONTENT TO VALIDATE] — figures and their scientific sources will be added after medical review.",
            )}
          </p>
        </div>
      </section>

      {/* 13 — Transition vers les solutions */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Les options", "The options")}
          </p>
          <h2 className="mx-auto mt-5 max-w-[20ch] text-balance font-section text-3xl font-medium leading-[1.1] tracking-tight lg:text-5xl">
            {t("Comprendre est la première étape.", "Understanding is the first step.")}
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-pretty text-muted">
            {t(
              "Découvrez les traitements disponibles avec MAAN.",
              "Discover the treatments available with MAAN.",
            )}
          </p>
          <div className="mt-9">
            <Link
              to="/questionnaire/$slug"
              params={{ slug: "cheveux" }}
              className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
            >
              {t("Commencer ma consultation", "Start my consultation")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">↓</span>
            </Link>
          </div>
          <p className="sr-only">{lang}</p>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Expérience sticky pilotée par le scroll                             */
/* ------------------------------------------------------------------ */

function HairJourneyScroll() {
  const { t, lang } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? false), {
      rootMargin: "200px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
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
  }, [inView]);

  // 07 — timeline du cycle (visible entre 0.58 et 0.74)
  const cycleP = clamp01((p - 0.58) / 0.16);
  // 08 — miniaturisation : 4 cycles entre 0.74 et 0.86
  const miniP = clamp01((p - 0.74) / 0.12);
  const cycleIndex = Math.min(4, Math.floor(miniP * 4) + 1);
  // 09 — comparaison (0.8 → 0.88)
  const compareP = clamp01((p - 0.79) / 0.07);

  const scenes = useMemo(() => SCENES, []);

  return (
    <section
      aria-label={t("Voyage sous le cuir chevelu", "Journey beneath the scalp")}
      className="border-b border-border bg-[color:var(--ink,#1b1512)]"
    >
      <div ref={wrapRef} className="relative h-[520vh] lg:h-[620vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-foreground">
          {/* Média */}
          <div className="absolute inset-0">
            {scenes.map((s, i) => {
              const local = clamp01((p - s.from) / (s.to - s.from));
              const fadeIn = clamp01((p - s.from) / 0.045);
              const fadeOut = 1 - clamp01((p - (s.to - 0.045)) / 0.045);
              const opacity = p < s.from - 0.05 ? 0 : Math.min(fadeIn, fadeOut);
              const scale = s.scaleFrom + (s.scaleTo - s.scaleFrom) * local;
              return (
                <img
                  key={s.src}
                  src={s.src}
                  alt={opacity > 0.5 ? (lang === "en" ? s.alt.en : s.alt.fr) : ""}
                  width={1600}
                  height={1200}
                  loading={s.eager ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover will-change-transform"
                  style={{ opacity, transform: `scale(${scale})` }}
                />
              );
            })}
            {/* voile éditorial pour la lisibilité */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--foreground)_55%,transparent),transparent_35%,transparent_60%,color-mix(in_oklab,var(--foreground)_70%,transparent))]" />
          </div>

          {/* Texte */}
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
            {BEATS.map((b) => {
              const on = p >= b.from && p <= b.to;
              return (
                <p
                  key={b.fr}
                  aria-hidden={!on}
                  className={cn(
                    "absolute inset-x-6 top-1/2 -translate-y-1/2 text-balance text-center font-section text-3xl font-medium leading-[1.1] tracking-tight text-cream transition-all duration-700 ease-[var(--ease)] lg:text-5xl",
                    on ? "translate-y-[-50%] opacity-100 blur-0" : "translate-y-[-40%] opacity-0 blur-[6px]",
                  )}
                >
                  {lang === "en" ? b.en : b.fr}
                </p>
              );
            })}
          </div>

          {/* 07 — timeline du cycle */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-24 z-10 mx-auto max-w-3xl px-6 transition-opacity duration-500",
              cycleP > 0 && cycleP < 1 ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          >
            <div className="relative h-px w-full bg-cream/25">
              <div
                className="absolute inset-y-0 left-0 bg-clay transition-[width] duration-150 ease-out"
                style={{ width: `${cycleP * 100}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-cream/70">
              {CYCLE_STEPS.map((c) => (
                <span key={c.fr}>{lang === "en" ? c.en : c.fr}</span>
              ))}
            </div>
          </div>

          {/* 08 — compteur de cycles */}
          <div
            className={cn(
              "absolute right-6 top-1/2 z-10 -translate-y-1/2 text-right transition-opacity duration-500",
              miniP > 0 && miniP < 1 ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/60">
              {t("Cycle", "Cycle")}
            </p>
            <p className="font-display text-4xl font-medium text-cream">
              {String(cycleIndex).padStart(2, "0")}
            </p>
          </div>

          {/* 09 — comparaison discrète */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-10 z-10 mx-auto flex max-w-4xl items-end justify-between px-10 transition-opacity duration-700",
              compareP > 0.15 ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/70">
              {t("Follicule", "Follicle")}
            </span>
            <span className="h-px flex-1 mx-4 bg-cream/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
              {t("Follicule miniaturisé", "Miniaturized follicle")}
            </span>
          </div>

          {/* progression fine */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-cream/15" aria-hidden>
            <div
              className="h-full origin-left bg-clay"
              style={{ transform: `scaleX(${p})`, width: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Repli prefers-reduced-motion : 4 scènes statiques premium           */
/* ------------------------------------------------------------------ */

function HairJourneyStatic() {
  const { t, lang } = useI18n();
  const items = [
    { src: macroHair, i: 2, fr: "Cheveux", en: "Hair" },
    { src: macroScalp, i: 3, fr: "Cuir chevelu", en: "Scalp" },
    { src: follicle, i: 5, fr: "Follicule", en: "Follicle" },
    { src: follicleMini, i: 6, fr: "Miniaturisation", en: "Miniaturization" },
  ];
  return (
    <section className="border-b border-border bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
          {t("Sous la surface", "Beneath the surface")}
        </p>
        <h2 className="mt-4 max-w-[20ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
          {t("Vos cheveux changent. Tout commence sous la surface.", "Your hair is changing. It all starts beneath the surface.")}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {items.map((it, idx) => (
            <figure key={it.src} className="overflow-hidden rounded-[20px] border border-border bg-background">
              <img
                src={it.src}
                alt={lang === "en" ? (SCENES[it.i]?.alt.en ?? "") : (SCENES[it.i]?.alt.fr ?? "")}
                width={1600}
                height={1200}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {String(idx + 1).padStart(2, "0")} · {lang === "en" ? it.en : it.fr}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 12 — visualisation humaine des statistiques (placeholders sourcés)  */
/* ------------------------------------------------------------------ */

function PeopleViz() {
  const { t } = useI18n();
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // proportion illustrative en attente de source ; neutre par défaut
  const total = 20;
  const highlighted = 10;

  return (
    <div ref={ref} className="mt-12">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: total }).map((_, i) => (
          <Silhouette
            key={i}
            active={shown && i < highlighted}
            delay={i * 45}
            visible={shown}
          />
        ))}
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="font-display text-4xl font-semibold tracking-tight text-clay lg:text-5xl">
            {t("[STATISTIQUE À SOURCER]", "[STATISTIC TO SOURCE]")}
          </p>
          <p className="mt-3 max-w-[36ch] text-sm text-muted">
            {t(
              "Proportion d'hommes concernés par une perte de cheveux d'origine androgénétique.",
              "Share of men affected by androgenetic hair loss.",
            )}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            {t("[SOURCE SCIENTIFIQUE À AJOUTER]", "[SCIENTIFIC SOURCE TO ADD]")}
          </p>
        </div>
        <div>
          <p className="font-display text-4xl font-semibold tracking-tight text-clay lg:text-5xl">
            {t("[X hommes sur X]", "[X men out of X]")}
          </p>
          <p className="mt-3 max-w-[36ch] text-sm text-muted">
            {t(
              "Fréquence observée selon la tranche d'âge.",
              "Frequency observed by age group.",
            )}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            {t("[SOURCE SCIENTIFIQUE À AJOUTER]", "[SCIENTIFIC SOURCE TO ADD]")}
          </p>
        </div>
      </div>
    </div>
  );
}

function Silhouette({ active, delay, visible }: { active: boolean; delay: number; visible: boolean }) {
  return (
    <svg
      viewBox="0 0 24 34"
      aria-hidden
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "h-9 w-auto transition-all duration-500 ease-[var(--ease)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        active ? "text-clay" : "text-muted/30",
      )}
    >
      <circle cx="12" cy="7" r="6" fill="currentColor" />
      <path d="M2 34c0-6.6 4.5-12 10-12s10 5.4 10 12z" fill="currentColor" />
    </svg>
  );
}
