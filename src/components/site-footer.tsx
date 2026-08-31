import { Link } from "@tanstack/react-router";

import { openConsentPreferences } from "@/lib/cookie-consent";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

const soins = [
  { label: "Sexual", slug: "sexuel" },
  { label: "Weight", slug: "poids" },
  { label: "Hair", slug: "cheveux" },
  { label: "Skin", slug: "peau" },
];

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-[36ch]">
            <span className="font-display text-2xl font-semibold tracking-tight">MAAN</span>
            <p className="mt-3 text-pretty text-sm text-muted">
              {t(
                "Des soins pensés pour les hommes. Questionnaire médical, validation de la prescription par un médecin et livraison discrète à domicile.",
                "Care designed for men. Medical questionnaire, prescription reviewed by a doctor and discreet home delivery.",
              )}
            </p>
            <LanguageSwitcher className="mt-5" />
          </div>
          <div className="grid grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-foreground">{t("Soins", "Treatments")}</p>
              {soins.map((s) => (
                <Link
                  key={s.slug}
                  to="/soins/$domaine"
                  params={{ domaine: s.slug }}
                  search={{ produit: undefined }}
                  className="block transition-colors hover:text-clay"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-foreground">{t("Parcours", "How it works")}</p>
              <Link to="/parcours" className="block transition-colors hover:text-clay">
                {t("Accès aux traitements", "Access to treatments")}
              </Link>
              <Link to="/espace-patient" className="block transition-colors hover:text-clay">
                {t("Espace patient", "Patient area")}
              </Link>
              <Link to="/auth" className="block transition-colors hover:text-clay">
                {t("Se connecter", "Sign in")}
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-foreground">{t("Conformité", "Compliance")}</p>
              <Link to="/conformite" className="block transition-colors hover:text-clay">
                {t("Prescription", "Prescription")}
              </Link>
              <Link
                to="/conformite"
                hash="donnees"
                className="block transition-colors hover:text-clay"
              >
                {t("Données de santé", "Health data")}
              </Link>
              <Link
                to="/conformite"
                hash="expedition"
                className="block transition-colors hover:text-clay"
              >
                {t("Expédition", "Shipping")}
              </Link>
              <Link to="/cookies" className="block transition-colors hover:text-clay">
                {t("Politique des cookies", "Cookie policy")}
              </Link>
              <button
                type="button"
                onClick={openConsentPreferences}
                className="block text-left uppercase tracking-[0.12em] transition-colors hover:text-clay"
              >
                {t("Préférences cookies", "Cookie preferences")}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-[11px] leading-relaxed text-muted">
            {t(
              "Les traitements sont délivrés uniquement sur ordonnance établie par un médecin agréé après évaluation de votre questionnaire. La pharmacie partenaire prépare et expédie les médicaments. Ce site ne vend pas de médicament sans prescription.",
              "Treatments are dispensed only with a prescription issued by a licensed doctor after reviewing your questionnaire. The partner pharmacy prepares and ships the medication. This site does not sell medication without a prescription.",
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
