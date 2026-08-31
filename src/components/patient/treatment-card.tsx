import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { statusHuman, tr, type Journey } from "@/lib/patient/types";
import { ClayButton, Pill } from "./ui";

export function TreatmentCard({ journey }: { journey: Journey }) {
  const { lang, t } = useI18n();

  return (
    <Link
      to="/mon-espace/soins/$journeyId"
      params={{ journeyId: journey.id }}
      className="group block rounded-[22px] border border-border bg-cream p-6 transition-all duration-500 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-clay/40 hover:shadow-[0_30px_70px_-55px_var(--foreground)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-section text-xl font-medium tracking-tight">{journey.title}</h3>
          <p className="mt-1 text-sm text-muted">{tr(journey.condition, lang)}</p>
        </div>
        <Pill tone="soft">{journey.domain}</Pill>
      </div>

      <p className="mt-5 text-[15px]">{tr(statusHuman[journey.status], lang)}</p>

      {journey.followUp.next ? (
        <p className="mt-1 text-sm text-muted">
          {t("Prochain suivi", "Next follow-up")} : {journey.followUp.next}
        </p>
      ) : null}

      <div className="mt-5">
        <ClayButton variant="ghost" className="pointer-events-none group-hover:border-clay group-hover:text-clay">
          {t("Voir mon traitement", "View my treatment")}
        </ClayButton>
      </div>
    </Link>
  );
}
