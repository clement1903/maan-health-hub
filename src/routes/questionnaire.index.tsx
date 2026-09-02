import { useState, type ComponentType } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock, Gift, Lock, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/questionnaire/")({
  head: () => ({
    meta: [
      { title: "Démarrer votre questionnaire — MAAN" },
      {
        name: "description",
        content:
          "Commencez immédiatement, sans créer de compte : indiquez ce que vous souhaitez traiter et répondez à quelques questions pour votre évaluation médicale.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Démarrer votre questionnaire — MAAN" },
      {
        property: "og:description",
        content:
          "Une question à la fois, sans compte à créer. Un médecin indépendant évalue ensuite votre dossier.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Démarrer votre questionnaire — MAAN" },
      {
        name: "twitter:description",
        content: "Indiquez ce que vous souhaitez traiter et commencez en 3 minutes.",
      },
    ],
  }),
  component: QuestionnaireStart,
});

/* ------------------------------------------------------------------ */
/*  Visuels abstraits premium — monochrome sable / terracotta         */
/* ------------------------------------------------------------------ */

function SexualVisual() {
  // Lignes verticales fines en progression ascendante
  const heights = [26, 38, 32, 50, 44, 62, 56, 74, 68, 86];
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden>
      {heights.map((h, i) => (
        <rect
          key={i}
          x={14 + i * 18.5}
          y={100 - h}
          width={2.2}
          height={h}
          rx={1.1}
          className={cn(
            "fill-border transition-all duration-700 ease-[var(--ease)] group-hover:fill-clay/70",
          )}
          style={{ transitionDelay: `${i * 45}ms` }}
        />
      ))}
    </svg>
  );
}

function WeightVisual() {
  // Cercles concentriques + point de progression
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden>
      {[44, 32, 20].map((r) => (
        <circle
          key={r}
          cx={100}
          cy={56}
          r={r}
          fill="none"
          className="stroke-border transition-colors duration-500 group-hover:stroke-clay/40"
          strokeWidth={1.4}
        />
      ))}
      <circle
        cx={100}
        cy={12}
        r={4}
        className="fill-clay transition-transform duration-700 ease-[var(--ease)] group-hover:rotate-[40deg]"
        style={{ transformOrigin: "100px 56px" }}
      />
    </svg>
  );
}

function HairVisual() {
  // Quelques lignes organiques évoquant des follicules
  const strands = [
    "M40 96 C 42 70, 36 54, 44 34",
    "M72 96 C 74 66, 68 50, 76 26",
    "M104 96 C 106 72, 100 58, 108 38",
    "M136 96 C 138 68, 132 52, 140 30",
    "M164 96 C 166 74, 160 60, 168 42",
  ];
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden>
      {strands.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          strokeWidth={1.6}
          strokeLinecap="round"
          className="stroke-border transition-all duration-700 ease-[var(--ease)] group-hover:stroke-clay/70 group-hover:-translate-y-1"
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
      {strands.map((_, i) => (
        <circle
          key={`f${i}`}
          cx={[40, 72, 104, 136, 164][i]}
          cy={98}
          r={2}
          className="fill-border transition-colors duration-500 group-hover:fill-clay/60"
        />
      ))}
    </svg>
  );
}

function SkinVisual() {
  // Texture organique de petits reliefs
  const dots: Array<[number, number, number]> = [
    [30, 30, 5], [60, 22, 3.4], [92, 30, 6], [124, 24, 4], [156, 32, 5.4], [180, 26, 3],
    [22, 58, 4], [52, 56, 6.4], [84, 60, 3.6], [116, 54, 5], [148, 60, 4.2], [176, 56, 6],
    [36, 88, 5.6], [70, 84, 4], [102, 90, 6.2], [134, 86, 3.4], [166, 90, 5],
  ];
  return (
    <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden>
      {dots.map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          className="fill-sand stroke-border transition-all duration-600 ease-[var(--ease)] group-hover:fill-cream group-hover:stroke-clay/50"
          strokeWidth={1}
          style={{ transitionDelay: `${i * 30}ms` }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

type Category = {
  slug: string;
  title: string;
  concepts: [string, string];
  Visual: ComponentType;
};

function QuestionnaireStart() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);

  const categories: Category[] = [
    {
      slug: "sexuel",
      title: "Sexual Management",
      concepts: [t("Érection", "Erection"), t("Éjaculation", "Ejaculation")],
      Visual: SexualVisual,
    },
    {
      slug: "poids",
      title: "Weight Management",
      concepts: [t("Poids", "Weight"), t("IMC", "BMI")],
      Visual: WeightVisual,
    },
    {
      slug: "cheveux",
      title: "Hair Management",
      concepts: [t("Chute", "Loss"), t("Densité", "Density")],
      Visual: HairVisual,
    },
    {
      slug: "peau",
      title: "Skin Management",
      concepts: [t("Acné", "Acne"), t("Peau", "Skin")],
      Visual: SkinVisual,
    },
  ];

  const pick = (slug: string) => {
    if (picked) return;
    setPicked(slug);
    window.setTimeout(
      () => void navigate({ to: "/questionnaire/$slug", params: { slug } }),
      380,
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:py-20">
          {/* Progression */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.2em] text-clay">01</span>
            <div className="h-px flex-1 bg-sand">
              <div
                className="h-full bg-clay transition-all duration-700 ease-[var(--ease)]"
                style={{ width: picked ? "18%" : "8%" }}
              />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {t("Évaluation", "Assessment")}
            </span>
          </div>

          <h1 className="mt-10 text-balance font-display text-4xl font-medium leading-[1.08] lg:text-5xl">
            {t("Que souhaitez-vous traiter\u00a0?", "What would you like to treat?")}
          </h1>

          <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3" /> 3 min
            </span>
            <span aria-hidden className="text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Gift className="size-3" /> {t("Gratuit", "Free")}
            </span>
            <span aria-hidden className="text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3" /> {t("Confidentiel", "Confidential")}
            </span>
          </div>

          {/* Cartes */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categories.map(({ slug, title, concepts, Visual }) => {
              const selected = picked === slug;
              const dimmed = picked !== null && !selected;
              return (
                <button
                  key={slug}
                  type="button"
                  aria-label={title}
                  onClick={() => pick(slug)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-5 rounded-[22px] border bg-card p-5 text-left transition-all duration-200 ease-[var(--ease)] focus-visible:outline-none",
                    "border-border hover:-translate-y-0.5 hover:border-clay hover:bg-cream focus-visible:border-clay focus-visible:bg-cream",
                    "sm:flex-col sm:items-stretch sm:gap-0 sm:p-7",
                    selected && "border-clay bg-cream",
                    dimmed && "opacity-40 transition-opacity duration-300",
                  )}
                >
                  {/* Visuel */}
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-[14px] bg-sand/60 p-2 sm:h-[150px] sm:w-full sm:p-3">
                    <Visual />
                  </div>
                  {/* Texte */}
                  <div className="min-w-0 sm:mt-5">
                    <span className="block font-section text-lg font-medium tracking-tight sm:text-xl">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {concepts[0]} · {concepts[1]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-10 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
            <Lock className="size-3.5" />
            {t("Aucun compte nécessaire pour commencer.", "No account needed to get started.")}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
