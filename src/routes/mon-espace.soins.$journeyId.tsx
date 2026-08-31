import { createFileRoute, Link, useParams } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import { statusHuman, tr } from "@/lib/patient/types";
import { CareJourney } from "@/components/patient/care-journey";
import { DoctorCard } from "@/components/patient/doctor-card";
import { DeliveryTracker } from "@/components/patient/delivery-tracker";
import { ProgressTracker } from "@/components/patient/progress-tracker";
import { PhotoProgress } from "@/components/patient/photo-progress";
import { PlanManagement } from "@/components/patient/plan-management";
import { ClayButton, EmptyState, Eyebrow, Skeleton, Surface } from "@/components/patient/ui";

export const Route = createFileRoute("/mon-espace/soins/$journeyId")({
  component: TreatmentDetail,
});

function TreatmentDetail() {
  const { journeyId } = useParams({ from: "/mon-espace/soins/$journeyId" });
  const { lang, t } = useI18n();
  const { journeyById, loading } = usePatient();
  const journey = journeyById(journeyId);

  if (loading) return <Skeleton className="h-72 w-full rounded-[26px]" />;

  if (!journey) {
    return (
      <EmptyState
        title={t("Parcours introuvable", "Journey not found")}
        desc={t("Ce parcours n'existe pas ou n'est plus accessible.", "This journey does not exist or is no longer available.")}
        action={
          <Link to="/mon-espace/soins">
            <ClayButton variant="ghost">{t("Retour à mes soins", "Back to my care")}</ClayButton>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8" style={{ animation: "fade 0.5s var(--ease) both" }}>
      <header>
        <Link
          to="/mon-espace/soins"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-clay"
        >
          ← {t("Mes soins", "My care")}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">{journey.title}</h1>
        <p className="mt-1 text-[15px] text-muted">{tr(journey.condition, lang)}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Surface>
          <Eyebrow>{t("Statut actuel", "Current status")}</Eyebrow>
          <p className="mt-3 text-[17px]">{tr(statusHuman[journey.status], lang)}</p>

          <div className="mt-6">
            <Eyebrow>{t("Prochaine étape", "Next step")}</Eyebrow>
            <p className="mt-2 text-[15px] text-muted">
              {journey.followUp.due
                ? t("Votre suivi médical est disponible.", "Your medical follow-up is available.")
                : journey.followUp.next
                  ? t(`Suivi médical le ${journey.followUp.next}.`, `Medical follow-up on ${journey.followUp.next}.`)
                  : t("Aucune action de votre part n'est nécessaire.", "No action is needed from you.")}
            </p>
            {journey.followUp.due ? (
              <div className="mt-4">
                <Link to="/mon-espace/suivi">
                  <ClayButton>{t("Commencer mon suivi", "Start my follow-up")}</ClayButton>
                </Link>
              </div>
            ) : null}
          </div>
        </Surface>

        <DoctorCard doctor={journey.doctor} />
      </div>

      <Surface>
        <CareJourney journey={journey} />
      </Surface>

      <Surface>
        <Eyebrow>{t("Mon traitement", "My treatment")}</Eyebrow>
        {journey.treatment ? (
          <div className="mt-3 space-y-2">
            <p className="font-section text-lg tracking-tight">{journey.treatment.name}</p>
            {journey.treatment.posologie ? (
              <p className="text-[15px] text-muted">{tr(journey.treatment.posologie, lang)}</p>
            ) : null}
            {journey.treatment.note ? (
              <p className="text-[13px] text-muted">{tr(journey.treatment.note, lang)}</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-[15px] text-muted">
            {t(
              "Aucun traitement n'a encore été prescrit. Les informations apparaîtront ici après la décision médicale.",
              "No treatment has been prescribed yet. Information will appear here after the medical decision.",
            )}
          </p>
        )}
      </Surface>

      <div className="grid gap-6 lg:grid-cols-2">
        <DeliveryTracker delivery={journey.delivery} />

        <Surface>
          <Eyebrow>{t("Suivi", "Follow-up")}</Eyebrow>
          <div className="mt-4 space-y-1 text-[15px]">
            <p className="text-muted">
              {t("Dernier suivi", "Last follow-up")} :{" "}
              <span className="text-foreground">{journey.followUp.last ?? "—"}</span>
            </p>
            <p className="text-muted">
              {t("Prochain suivi", "Next follow-up")} :{" "}
              <span className="text-foreground">{journey.followUp.next ?? "—"}</span>
            </p>
          </div>
          <div className="mt-5">
            <Link to="/mon-espace/suivi">
              <ClayButton variant="ghost">{t("Commencer mon suivi", "Start my follow-up")}</ClayButton>
            </Link>
          </div>
        </Surface>
      </div>

      {journey.progress ? (
        <ProgressTracker journeyId={journey.id} progress={journey.progress} />
      ) : null}

      {journey.photos?.enabled ? (
        <PhotoProgress journeyId={journey.id} photos={journey.photos} />
      ) : null}

      <PlanManagement journeyId={journey.id} plan={journey.plan} />
    </div>
  );
}
