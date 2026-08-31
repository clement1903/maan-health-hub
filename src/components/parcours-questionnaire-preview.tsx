import { useEffect, useMemo, useRef, useState } from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Aperçu interactif (purement visuel) du questionnaire MAAN.
 * Il rejoue une petite séquence de questions dès qu'il entre dans le champ de vision.
 */
export function ParcoursQuestionnairePreview() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const steps = useMemo(
    () => [
      {
        eyebrow: t("Question 1 / 12", "Question 1 / 12"),
        title: t("Qu'est-ce qui vous préoccupe ?", "What is bothering you?"),
        options: [
          t("Santé sexuelle", "Sexual health"),
          t("Chute de cheveux", "Hair loss"),
          t("Poids", "Weight"),
        ],
        answer: 0,
      },
      {
        eyebrow: t("Question 4 / 12", "Question 4 / 12"),
        title: t("Depuis combien de temps ?", "For how long?"),
        options: [
          t("Moins de 6 mois", "Less than 6 months"),
          t("6 mois à 2 ans", "6 months to 2 years"),
          t("Plus de 2 ans", "More than 2 years"),
        ],
        answer: 1,
      },
      {
        eyebrow: t("Question 9 / 12", "Question 9 / 12"),
        title: t("Prenez-vous un traitement ?", "Are you on any medication?"),
        options: [t("Non", "No"), t("Oui, occasionnel", "Yes, occasional"), t("Oui, quotidien", "Yes, daily")],
        answer: 2,
      },
    ],
    [t],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const current = steps[step]!;
    const pick = window.setTimeout(() => setPicked(current.answer), 900);
    const next = window.setTimeout(() => {
      setPicked(null);
      setStep((s) => (s + 1) % steps.length);
    }, 2600);
    return () => {
      window.clearTimeout(pick);
      window.clearTimeout(next);
    };
  }, [active, step, steps]);

  const current = steps[step]!;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-sand p-6 sm:p-9"
    >
      <div className="flex h-full flex-col rounded-[1.75rem] border border-border bg-background p-6 shadow-[0_40px_90px_-60px_var(--foreground)] sm:p-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
            {t("Questionnaire MAAN", "MAAN questionnaire")}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
            {t("En ligne", "Online")}
          </span>
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-sand">
          <div
            className="h-full rounded-full bg-clay transition-[width] duration-700 ease-[var(--ease)]"
            style={{ width: `${active ? progress : 8}%` }}
          />
        </div>

        <div key={step} style={{ animation: "rise 0.5s var(--ease) both" }} className="mt-8 flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
            {current.eyebrow}
          </span>
          <h3 className="mt-3 text-balance font-section text-2xl font-medium leading-tight tracking-tight sm:text-[28px]">
            {current.title}
          </h3>

          <div className="mt-6 space-y-3">
            {current.options.map((o, i) => {
              const selected = picked === i;
              return (
                <div
                  key={o}
                  className={cn(
                    "flex min-h-12 items-center justify-between rounded-[16px] border px-4 text-[14px] transition-all duration-500 ease-[var(--ease)]",
                    selected
                      ? "border-clay bg-cream text-foreground"
                      : "border-border bg-background text-muted",
                  )}
                >
                  {o}
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full border text-[10px] transition-colors duration-300",
                      selected ? "border-clay bg-clay text-cream" : "border-border text-transparent",
                    )}
                  >
                    ✓
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {t("Sauvegarde automatique", "Auto-saved")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-clay px-4 py-2 text-[13px] font-medium text-cream">
            {t("Continuer", "Continue")}
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
