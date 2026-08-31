import { useState } from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { journeyStages, stageStateFor, tr, type Journey } from "@/lib/patient/types";
import { Eyebrow } from "./ui";

export function CareJourney({ journey }: { journey: Journey }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState<string | null>(journeyStages[journey.stageIndex]?.key ?? null);

  return (
    <section>
      <Eyebrow>{t("Votre parcours", "Your journey")}</Eyebrow>
      <ol className="mt-5 space-y-1">
        {journeyStages.map((stage, i) => {
          const state = stageStateFor(journey, i);
          const detail = journey.stages.find((s) => s.key === stage.key);
          const expanded = open === stage.key;
          return (
            <li key={stage.key}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : stage.key)}
                aria-expanded={expanded}
                className="group flex w-full items-start gap-4 rounded-[16px] px-3 py-3 text-left transition-colors duration-300 hover:bg-sand/50"
              >
                <span className="relative flex flex-col items-center self-stretch">
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-all duration-500 ease-[var(--ease)]",
                      state === "done" && "border-clay bg-clay text-cream",
                      state === "current" && "border-clay bg-background text-clay",
                      state === "todo" && "border-border bg-background text-muted",
                    )}
                  >
                    {state === "done" ? "✓" : state === "current" ? "●" : "○"}
                  </span>
                  {state === "current" ? (
                    <span
                      className="pointer-events-none absolute top-0 h-6 w-6 rounded-full border border-clay"
                      style={{ animation: "pulse-ring 2.6s var(--ease) infinite" }}
                    />
                  ) : null}
                  {i < journeyStages.length - 1 ? (
                    <span
                      className={cn(
                        "mt-1 w-px flex-1 transition-colors duration-700",
                        state === "done" ? "bg-clay/50" : "bg-border",
                      )}
                    />
                  ) : null}
                </span>

                <span className="flex-1 pb-3">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "font-section text-base tracking-tight transition-colors",
                        state === "todo" ? "text-muted" : "text-foreground",
                      )}
                    >
                      {tr(stage.label, lang)}
                    </span>
                    {state === "current" ? (
                      <span className="rounded-full bg-clay px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream">
                        {t("En cours", "In progress")}
                      </span>
                    ) : null}
                  </span>

                  <span
                    className={cn(
                      "grid transition-all duration-500 ease-[var(--ease)]",
                      expanded ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="block text-sm text-muted">
                        {detail?.detail
                          ? tr(detail.detail, lang)
                          : state === "current"
                            ? journey.doctor
                              ? t(
                                  `${journey.doctor.name} examine actuellement votre dossier.`,
                                  `${journey.doctor.name} is currently reviewing your file.`,
                                )
                              : t("Étape en cours.", "Step in progress.")
                            : t("À venir.", "Coming up.")}
                      </span>
                      {detail?.at ? (
                        <span className="mt-1 block font-mono text-[11px] text-clay">{detail.at}</span>
                      ) : null}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
