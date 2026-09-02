import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { questionnaireDefinitions } from "@/lib/questionnaire/definitions";
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

function QuestionnaireStart() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (slug: string) => {
    if (picked) return;
    setPicked(slug);
    window.setTimeout(
      () => void navigate({ to: "/questionnaire/$slug", params: { slug } }),
      300,
    );
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = refs.current.findIndex((el) => el === document.activeElement);
    if (current === -1) return;
    const cols = window.matchMedia("(min-width: 640px)").matches ? 2 : 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (current + 1) % questionnaireDefinitions.length;
    if (e.key === "ArrowLeft")
      next = (current - 1 + questionnaireDefinitions.length) % questionnaireDefinitions.length;
    if (e.key === "ArrowDown")
      next = Math.min(current + cols, questionnaireDefinitions.length - 1);
    if (e.key === "ArrowUp") next = Math.max(current - cols, 0);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = questionnaireDefinitions.length - 1;
    if (next !== null) {
      e.preventDefault();
      refs.current[next]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Question 1 sur votre parcours", "Question 1 of your journey")}
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-medium leading-[1.08] lg:text-5xl">
            {t("Que souhaitez-vous traiter\u00a0?", "What would you like to treat?")}
          </h1>
          <p className="mt-5 max-w-[52ch] text-pretty text-lg text-muted">
            {t(
              "Choisissez votre spécialité : les questions suivantes s'adaptent à votre situation. Aucun compte, aucune adresse e-mail à ce stade.",
              "Choose your specialty: the following questions adapt to your situation. No account, no email address at this stage.",
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <Clock className="size-3.5" /> {t("environ 3 minutes", "about 3 minutes")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <ShieldCheck className="size-3.5" /> {t("gratuit", "free")}
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label={t("Spécialité à traiter", "Specialty to treat")}
            onKeyDown={onKeyDown}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {questionnaireDefinitions.map((d, i) => {
              const selected = picked === d.slug;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  onClick={() => pick(d.slug)}
                  className={cn(
                    "group flex h-full flex-col items-start rounded-[20px] border border-border bg-card p-6 text-left transition-all duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:border-clay hover:shadow-[0_28px_70px_-50px_var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-[0.99]",
                    selected &&
                      "animate-[select-pop_0.32s_var(--ease)] border-clay bg-clay/8 shadow-[0_28px_70px_-50px_var(--foreground)]",
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="font-section text-xl font-medium tracking-tight">
                      {d.title}
                    </span>
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-200",
                        selected && "scale-110 border-clay bg-clay text-primary-foreground",
                      )}
                    >
                      <Check
                        className={cn(
                          "size-3.5 opacity-0 transition-opacity",
                          selected && "opacity-100",
                        )}
                      />
                    </span>
                  </span>
                  <span className="mt-2 flex-1 text-pretty text-sm text-muted">{d.intro}</span>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-clay transition-all group-hover:gap-3">
                    {selected ? t("C'est parti", "Let's go") : t("Commencer", "Start")} <ArrowRight className="size-3.5" />
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-sm text-muted">
            {t(
              "Vos réponses sont enregistrées automatiquement. Vous ne créerez un compte qu'au moment d'envoyer votre dossier au médecin.",
              "Your answers are saved automatically. You will only create an account when sending your file to the doctor.",
            )}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
