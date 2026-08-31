import { createFileRoute } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import { TreatmentCard } from "@/components/patient/treatment-card";
import { EmptyState, Skeleton } from "@/components/patient/ui";

export const Route = createFileRoute("/mon-espace/soins/")({
  component: MesSoins,
});

function MesSoins() {
  const { t } = useI18n();
  const { data, loading } = usePatient();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-44 w-full rounded-[22px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ animation: "fade 0.5s var(--ease) both" }}>
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t("Mes soins", "My care")}
        </h1>
        <p className="mt-2 max-w-[46ch] text-pretty text-[15px] text-muted">
          {t(
            "Chaque parcours reste indépendant, tout en restant accessible depuis votre compte MAAN.",
            "Each journey stays independent while remaining accessible from your MAAN account.",
          )}
        </p>
      </header>

      {data.journeys.length === 0 ? (
        <EmptyState
          title={t("Aucun parcours en cours", "No active journey")}
          desc={t(
            "Commencez une évaluation pour ouvrir un parcours de soin.",
            "Start an assessment to open a care journey.",
          )}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {data.journeys.map((j) => (
            <TreatmentCard key={j.id} journey={j} />
          ))}
        </div>
      )}
    </div>
  );
}
