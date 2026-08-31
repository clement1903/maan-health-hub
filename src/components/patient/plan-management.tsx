import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import type { Plan } from "@/lib/patient/types";
import { ClayButton, Eyebrow, Surface } from "./ui";

export function PlanManagement({ journeyId, plan }: { journeyId: string; plan: Plan | null }) {
  const { t } = useI18n();
  const { setPlanState } = usePatient();

  if (!plan) return null;

  const stateLabel =
    plan.state === "actif"
      ? t("Actif", "Active")
      : plan.state === "pause"
        ? t("En pause", "Paused")
        : t("Annulé", "Cancelled");

  const rows = [
    { label: t("Statut", "Status"), value: stateLabel },
    { label: t("Prochaine échéance", "Next renewal"), value: plan.nextCharge ?? "—" },
    { label: t("Prochaine livraison prévue", "Next planned delivery"), value: plan.nextDelivery ?? "—" },
    { label: t("Prochain suivi médical", "Next medical follow-up"), value: plan.nextMedicalReview ?? "—" },
  ];

  return (
    <Surface>
      <Eyebrow>{t("Mon plan", "My plan")}</Eyebrow>

      <dl className="mt-5 divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-sm text-muted">{r.label}</dt>
            <dd className="text-right font-section text-[15px] tracking-tight">{r.value}</dd>
          </div>
        ))}
      </dl>

      {plan.medicalReviewRequired ? (
        <div className="mt-5 rounded-[16px] border border-clay/30 bg-background p-4">
          <p className="text-[15px]">
            {t(
              "Un suivi médical est nécessaire avant votre prochaine livraison.",
              "A medical follow-up is required before your next delivery.",
            )}
          </p>
          <p className="mt-2 text-sm text-muted">
            {t(
              "Le renouvellement de votre plan ne garantit pas la délivrance d'une prescription : la décision reste médicale.",
              "Renewing your plan does not guarantee a prescription: the decision remains medical.",
            )}
          </p>
          <div className="mt-4">
            <Link to="/mon-espace/suivi">
              <ClayButton>{t("Commencer le suivi", "Start the follow-up")}</ClayButton>
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <ClayButton
          variant="ghost"
          onClick={() => setPlanState(journeyId, plan.state === "pause" ? "actif" : "pause")}
        >
          {plan.state === "pause" ? t("Reprendre mon plan", "Resume my plan") : t("Mettre en pause", "Pause")}
        </ClayButton>
        <ClayButton variant="ghost" onClick={() => setPlanState(journeyId, "annule")}>
          {t("Annuler", "Cancel")}
        </ClayButton>
      </div>
    </Surface>
  );
}
