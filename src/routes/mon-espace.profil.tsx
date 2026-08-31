import { createFileRoute, Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import { tr } from "@/lib/patient/types";
import { NotificationCenter } from "@/components/patient/notification-center";
import { ClayButton, Eyebrow, Skeleton, Surface } from "@/components/patient/ui";

export const Route = createFileRoute("/mon-espace/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const { lang, t } = useI18n();
  const { data, loading } = usePatient();

  if (loading) return <Skeleton className="h-72 w-full rounded-[22px]" />;

  const sections = [
    {
      title: t("Informations personnelles", "Personal information"),
      desc: t("Nom, contact, adresse de livraison.", "Name, contact, delivery address."),
    },
    {
      title: t("Questionnaires précédents", "Previous questionnaires"),
      desc: t("Consultez les réponses que vous avez fournies.", "Review the answers you provided."),
    },
    {
      title: t("Historique des soins", "Care history"),
      desc: t("Vos parcours passés et en cours.", "Your past and current journeys."),
    },
    {
      title: t("Documents disponibles", "Available documents"),
      desc: t("Ordonnances et comptes rendus.", "Prescriptions and reports."),
    },
    {
      title: t("Consentements", "Consents"),
      desc: t("Traitement des données de santé.", "Health data processing."),
    },
    {
      title: t("Factures", "Invoices"),
      desc: t("Historique de vos paiements.", "Your payment history."),
    },
    {
      title: t("Préférences de confidentialité", "Privacy preferences"),
      desc: t("Notifications discrètes, partage de données.", "Discreet notifications, data sharing."),
    },
    {
      title: t("Compte et sécurité", "Account and security"),
      desc: t("Mot de passe et connexion.", "Password and sign-in."),
    },
  ];

  return (
    <div className="space-y-8" style={{ animation: "fade 0.5s var(--ease) both" }}>
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t("Profil", "Profile")}
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          {data.firstName} · {t("Mon dossier MAAN", "My MAAN record")}
        </p>
      </header>

      <Surface>
        <Eyebrow>{t("Mon dossier", "My record")}</Eyebrow>
        <ul className="mt-4 divide-y divide-border">
          {sections.map((s) => (
            <li key={s.title}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-clay"
              >
                <span>
                  <span className="block font-section text-[15px] tracking-tight">{s.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{s.desc}</span>
                </span>
                <span className="text-muted">›</span>
              </button>
            </li>
          ))}
        </ul>
      </Surface>

      <Surface>
        <Eyebrow>{t("Mes parcours", "My journeys")}</Eyebrow>
        <ul className="mt-4 space-y-3">
          {data.journeys.map((j) => (
            <li key={j.id} className="flex items-center justify-between gap-4">
              <span>
                <span className="block font-section text-[15px] tracking-tight">{j.title}</span>
                <span className="text-sm text-muted">{tr(j.condition, lang)}</span>
              </span>
              <Link to="/mon-espace/soins/$journeyId" params={{ journeyId: j.id }}>
                <ClayButton variant="ghost" className="px-4 text-[13px]">
                  {t("Ouvrir", "Open")}
                </ClayButton>
              </Link>
            </li>
          ))}
        </ul>
      </Surface>

      <NotificationCenter />

      <p className="text-[12px] text-muted">
        {t(
          "Données de démonstration fictives — aucun dossier médical réel n'est affiché.",
          "Fictional demo data — no real medical record is displayed.",
        )}
      </p>
    </div>
  );
}
