import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient/store";
import { FollowUpFlow } from "@/components/patient/follow-up-flow";
import { EmptyState, Skeleton } from "@/components/patient/ui";

export const Route = createFileRoute("/mon-espace/suivi")({
  component: SuiviPage,
});

function SuiviPage() {
  const { t } = useI18n();
  const { data, loading } = usePatient();
  const [selected, setSelected] = useState<string | null>(null);

  if (loading) return <Skeleton className="h-72 w-full rounded-[26px]" />;

  const journeys = data.journeys;
  const active = journeys.find((j) => j.id === selected) ?? journeys[0];

  if (!active) {
    return (
      <EmptyState
        title={t("Aucun suivi disponible", "No follow-up available")}
        desc={t(
          "Votre suivi apparaîtra ici dès qu'un traitement sera actif.",
          "Your follow-up will appear here as soon as a treatment is active.",
        )}
      />
    );
  }

  return (
    <div className="space-y-8" style={{ animation: "fade 0.5s var(--ease) both" }}>
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t("Suivi", "Follow-up")}
        </h1>
        <p className="mt-2 max-w-[46ch] text-pretty text-[15px] text-muted">
          {t(
            "Quelques questions simples, transmises telles quelles à votre médecin.",
            "A few simple questions, shared as-is with your doctor.",
          )}
        </p>
      </header>

      {journeys.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {journeys.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => setSelected(j.id)}
              className={cn(
                "min-h-10 rounded-full border px-4 text-sm transition-colors",
                active.id === j.id
                  ? "border-clay bg-clay text-cream"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {j.title}
            </button>
          ))}
        </div>
      ) : null}

      <FollowUpFlow key={active.id} journey={active} />
    </div>
  );
}
