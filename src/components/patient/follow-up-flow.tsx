import { useMemo, useState } from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient/store";
import type { Journey } from "@/lib/patient/types";
import { ClayButton, Eyebrow } from "./ui";

/**
 * Questions de suivi purement UX : elles n'encodent aucune logique clinique
 * et ne produisent aucune recommandation. Les réponses sont transmises
 * telles quelles au médecin.
 */
function useQuestions() {
  const { t } = useI18n();
  return useMemo(
    () => [
      {
        id: "ressenti",
        title: t("Comment vous sentez-vous ?", "How are you feeling?"),
        options: [
          t("Bien", "Good"),
          t("Plutôt bien", "Fairly good"),
          t("Mitigé", "Mixed"),
          t("Pas bien", "Not good"),
        ],
      },
      {
        id: "effets",
        title: t(
          "Avez-vous remarqué des effets indésirables ?",
          "Have you noticed any side effects?",
        ),
        options: [t("Non", "No"), t("Oui, légers", "Yes, mild"), t("Oui, gênants", "Yes, bothersome")],
      },
      {
        id: "attentes",
        title: t("Le traitement répond-il à vos attentes ?", "Is the treatment meeting your expectations?"),
        options: [t("Oui", "Yes"), t("En partie", "Partly"), t("Non", "No")],
      },
      {
        id: "nouveaux_medicaments",
        title: t(
          "Avez-vous commencé de nouveaux médicaments ?",
          "Have you started any new medication?",
        ),
        options: [t("Non", "No"), t("Oui", "Yes")],
      },
      {
        id: "sante",
        title: t("Votre état de santé a-t-il changé ?", "Has your health changed?"),
        options: [t("Non", "No"), t("Oui", "Yes")],
      },
    ],
    [t],
  );
}

export function FollowUpFlow({ journey }: { journey: Journey }) {
  const { t } = useI18n();
  const { submitFollowUp } = usePatient();
  const questions = useQuestions();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div
        className="rounded-[26px] border border-clay/30 bg-cream p-10 text-center"
        style={{ animation: "rise 0.6s var(--ease) both" }}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay text-2xl text-cream">
          ✓
        </div>
        <h2 className="mt-5 font-section text-2xl font-medium tracking-tight">
          {t("Suivi envoyé", "Follow-up sent")}
        </h2>
        <p className="mx-auto mt-2 max-w-[40ch] text-pretty text-[15px] text-muted">
          {t(
            "Votre médecin pourra consulter vos réponses.",
            "Your doctor will be able to review your answers.",
          )}
        </p>
      </div>
    );
  }

  const q = questions[step]!;
  const pct = Math.round((step / questions.length) * 100);

  return (
    <div className="rounded-[26px] border border-border bg-cream p-7 sm:p-9">
      <div className="flex items-center justify-between gap-4">
        <Eyebrow>
          {t("Votre suivi MAAN", "Your MAAN follow-up")} · {journey.title}
        </Eyebrow>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {t("2 minutes", "2 minutes")}
        </span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-clay transition-[width] duration-700 ease-[var(--ease)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div key={q.id} style={{ animation: "rise 0.45s var(--ease) both" }}>
        <h2 className="mt-8 text-balance font-section text-2xl font-medium tracking-tight">
          {q.title}
        </h2>

        <div className="mt-6 space-y-3">
          {q.options.map((o) => {
            const selected = answers[q.id] === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o }))}
                className={cn(
                  "flex min-h-14 w-full items-center justify-between rounded-[18px] border px-5 text-left text-[15px] transition-all duration-300 ease-[var(--ease)] active:scale-[0.99]",
                  selected
                    ? "border-clay bg-background text-foreground"
                    : "border-border bg-background text-muted hover:border-clay/50 hover:text-foreground",
                )}
              >
                {o}
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full border text-[10px] transition-colors",
                    selected ? "border-clay bg-clay text-cream" : "border-border text-transparent",
                  )}
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <ClayButton variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          {t("Retour", "Back")}
        </ClayButton>
        <ClayButton
          disabled={!answers[q.id]}
          onClick={() => {
            if (step < questions.length - 1) {
              setStep((s) => s + 1);
              return;
            }
            submitFollowUp(journey.id, answers);
            setDone(true);
          }}
        >
          {step < questions.length - 1 ? t("Continuer", "Continue") : t("Envoyer mon suivi", "Send my follow-up")}
        </ClayButton>
      </div>
    </div>
  );
}
