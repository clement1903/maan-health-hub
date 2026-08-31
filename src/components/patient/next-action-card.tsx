import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient/store";
import { tr, type PatientAction } from "@/lib/patient/types";
import { ClayButton, Eyebrow } from "./ui";

export function useActionTarget() {
  const navigate = useNavigate();
  return (action: PatientAction) => {
    if (action.target === "messages") void navigate({ to: "/mon-espace/messages" });
    else if (action.target === "suivi") void navigate({ to: "/mon-espace/suivi" });
    else if (action.target === "profil") void navigate({ to: "/mon-espace/profil" });
    else void navigate({ to: "/mon-espace/soins/$journeyId", params: { journeyId: action.journeyId } });
  };
}

export function NextActionCard({ action }: { action: PatientAction }) {
  const { lang, t } = useI18n();
  const go = useActionTarget();
  const { data } = usePatient();
  const journey = data.journeys.find((j) => j.id === action.journeyId);
  const info = action.priority === "info";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[26px] border p-7 transition-all duration-500 ease-[var(--ease)] sm:p-8",
        info ? "border-border bg-cream" : "border-clay/40 bg-cream shadow-[0_30px_80px_-60px_var(--foreground)]",
      )}
    >
      {!info ? (
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-clay to-transparent" />
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>{t("Votre prochaine étape", "Your next step")}</Eyebrow>
        {journey ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
            {journey.title}
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 text-balance font-section text-2xl font-medium tracking-tight sm:text-[28px]">
        {tr(action.title, lang)}
      </h2>
      <p className="mt-2 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-muted">
        {tr(action.desc, lang)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ClayButton onClick={() => go(action)} variant={info ? "ghost" : "solid"}>
          {tr(action.cta, lang)}
        </ClayButton>
        {action.due ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {tr(action.due, lang)}
          </span>
        ) : null}
      </div>
    </section>
  );
}

export function ActionCenter({ actions }: { actions: PatientAction[] }) {
  const { lang, t } = useI18n();
  const { completeAction } = usePatient();
  const go = useActionTarget();
  const [justDone, setJustDone] = useState<string | null>(null);

  if (!actions.length) return null;

  return (
    <section>
      <Eyebrow>{t("À faire", "To do")}</Eyebrow>
      <ul className="mt-4 space-y-3">
        {actions.map((a) => {
          const done = a.done || justDone === a.id;
          return (
            <li
              key={a.id}
              className={cn(
                "flex items-start gap-4 rounded-[20px] border border-border bg-cream p-5 transition-all duration-500 ease-[var(--ease)]",
                done && "border-clay/40 opacity-60",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-all duration-500",
                  done
                    ? "border-clay bg-clay text-cream"
                    : a.priority === "haute"
                      ? "border-clay text-clay"
                      : "border-border text-muted",
                )}
              >
                {done ? "✓" : a.priority === "haute" ? "!" : "•"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-section text-[15px] tracking-tight">{tr(a.title, lang)}</p>
                <p className="mt-1 text-sm text-muted">{tr(a.desc, lang)}</p>
                {a.due ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
                    {tr(a.due, lang)}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <ClayButton variant="ghost" onClick={() => go(a)} className="px-4 text-[13px]">
                  {tr(a.cta, lang)}
                </ClayButton>
                {a.priority !== "info" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setJustDone(a.id);
                      completeAction(a.id);
                    }}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
                  >
                    {t("Marquer fait", "Mark done")}
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
