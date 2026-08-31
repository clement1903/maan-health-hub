import { createFileRoute, Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import { statusHuman, tr } from "@/lib/patient/types";
import { CareJourney } from "@/components/patient/care-journey";
import { ActionCenter, NextActionCard } from "@/components/patient/next-action-card";
import { DoctorCard } from "@/components/patient/doctor-card";
import { NotificationCenter } from "@/components/patient/notification-center";
import { ClayButton, EmptyState, Eyebrow, Skeleton, Surface } from "@/components/patient/ui";

export const Route = createFileRoute("/mon-espace/")({
  component: PatientHome,
});

function PatientHome() {
  const { lang, t } = useI18n();
  const { data, loading } = usePatient();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-44 w-full rounded-[26px]" />
        <Skeleton className="h-64 w-full rounded-[26px]" />
      </div>
    );
  }

  const primary = data.actions.find((a) => a.priority === "haute") ?? data.actions[0];
  const rest = data.actions.filter((a) => a.id !== primary?.id);
  const journey = data.journeys[0];

  return (
    <div className="space-y-10" style={{ animation: "fade 0.5s var(--ease) both" }}>
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("Bonjour", "Hello")}, {data.firstName}
        </h1>
        <p className="mt-2 max-w-[46ch] text-pretty text-[17px] leading-relaxed text-muted">
          {tr(data.headline, lang)}
        </p>
      </header>

      {primary ? (
        <NextActionCard action={primary} />
      ) : (
        <EmptyState
          title={t("Aucune action requise", "No action required")}
          desc={t(
            "Votre dossier est à jour. Nous vous préviendrons dès qu'une étape avance.",
            "Your file is up to date. We will let you know as soon as a step moves forward.",
          )}
        />
      )}

      {journey ? (
        <Surface>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <Eyebrow>{journey.title}</Eyebrow>
              <p className="mt-2 text-[15px]">{tr(statusHuman[journey.status], lang)}</p>
            </div>
            <Link to="/mon-espace/soins/$journeyId" params={{ journeyId: journey.id }}>
              <ClayButton variant="ghost" className="px-4 text-[13px]">
                {t("Voir le détail", "See details")}
              </ClayButton>
            </Link>
          </div>
          <div className="mt-6">
            <CareJourney journey={journey} />
          </div>
        </Surface>
      ) : null}

      <ActionCenter actions={rest} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DoctorCard doctor={journey?.doctor ?? null} />
        <NotificationCenter />
      </div>
    </div>
  );
}
