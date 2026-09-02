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
            <div className="flex items-baseline gap-3">
              <span className="relative inline-block">
                <span className="relative z-10 font-display text-2xl font-semibold tracking-tight">
                  MAAN
                </span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-2 rounded-sm bg-amber/35" />
              </span>
              <span className="whitespace-nowrap font-signature text-2xl leading-none text-clay">
                {t("Des soins pensés pour les hommes", "Care designed for men")}
              </span>
            </div>
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
              <Link to="/statistiques" className="block transition-colors hover:text-clay">
                {t("Les chiffres", "The numbers")}
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
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {t("Paiement sécurisé", "Secure payment")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2">
                <span className="flex h-4 w-5 items-center justify-center rounded-[3px] bg-black">
                  <span className="text-[7px] font-bold italic text-white">i</span>
                </span>
                <span className="text-[10px] font-bold tracking-wide text-foreground">
                  <span className="text-[#e5007d]">DEAL</span>
                </span>
              </span>
              <span className="flex h-7 items-center rounded-md border border-border bg-card px-2">
                <svg viewBox="0 0 36 22" className="h-3.5 w-auto" aria-label="Mastercard">
                  <circle cx="13" cy="11" r="7" fill="#EB001B" />
                  <circle cx="23" cy="11" r="7" fill="#F79E1B" fillOpacity="0.85" />
                </svg>
              </span>
              <span className="flex h-7 items-center rounded-md border border-border bg-card px-2">
                <span className="text-[10px] font-extrabold italic tracking-wider text-[#1A1F71]">
                  VISA
                </span>
              </span>
              <span className="flex h-7 items-center rounded-md border border-border bg-[#2E77BC] px-2">
                <span className="text-[8px] font-bold leading-none text-white">
                  AMERICAN
                  <br />
                  EXPRESS
                </span>
              </span>
              <span className="flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2">
                <svg viewBox="0 0 384 512" className="h-3 w-auto fill-foreground" aria-hidden>
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <span className="text-[10px] font-semibold text-foreground">Pay</span>
              </span>
              <span className="flex h-7 items-center gap-0.5 rounded-md border border-border bg-card px-2">
                <span className="text-[10px] font-semibold">
                  <span className="text-[#4285F4]">G</span>
                </span>
                <span className="text-[10px] font-semibold text-muted">Pay</span>
              </span>
              <span className="flex h-7 items-center rounded-md border border-border bg-card px-2">
                <span className="text-[10px] font-bold italic">
                  <span className="text-[#003087]">Pay</span>
                  <span className="text-[#009cde]">Pal</span>
                </span>
              </span>
            </div>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {t("Livraison", "Delivery")}
              </span>
              <span className="flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d="M12 2c3 3 8 5 8 10a8 8 0 1 1-16 0c0-5 5-7 8-10z"
                    fill="none"
                    stroke="#e6751f"
                    strokeWidth="1.6"
                  />
                </svg>
                <span className="text-[10px] font-bold text-[#e6751f]">postnl</span>
              </span>
            </div>
          </div>
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
