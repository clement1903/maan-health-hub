import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Instagram, Facebook, Linkedin, X } from "lucide-react";

import { openConsentPreferences } from "@/lib/cookie-consent";
import { useI18n } from "@/lib/i18n";

const soins = [
  { label: "Sexual", labelEn: "Sexual", slug: "sexuel" },
  { label: "Weight", labelEn: "Weight", slug: "poids" },
  { label: "Hair", labelEn: "Hair", slug: "cheveux" },
  { label: "Skin", labelEn: "Skin", slug: "peau" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com", Icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: Linkedin },
  { label: "X", href: "https://x.com", Icon: X },
];

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-espresso text-espresso-foreground">
      {/* Payment & shipping badges */}
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-2xl bg-cream px-8 py-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)]">
          <span className="flex h-9 items-center gap-1.5">
            <span className="flex h-5 w-6 items-center justify-center rounded-[4px] bg-black">
              <span className="text-[9px] font-bold italic text-white">i</span>
            </span>
            <span className="text-[12px] font-bold tracking-wide text-foreground">
              <span className="text-[#e5007d]">DEAL</span>
            </span>
          </span>
          <span className="flex h-9 items-center">
            <svg viewBox="0 0 36 22" className="h-5 w-auto" aria-label="Mastercard">
              <circle cx="13" cy="11" r="7" fill="#EB001B" />
              <circle cx="23" cy="11" r="7" fill="#F79E1B" fillOpacity="0.85" />
            </svg>
          </span>
          <span className="flex h-9 items-center">
            <span className="text-[13px] font-extrabold italic tracking-wider text-[#1A1F71]">
              VISA
            </span>
          </span>
          <span className="flex h-9 items-center rounded-[4px] bg-[#2E77BC] px-2 py-1.5">
            <span className="text-[9px] font-bold leading-none text-white">
              AMERICAN
              <br />
              EXPRESS
            </span>
          </span>
          <span className="flex h-9 items-center gap-1">
            <svg viewBox="0 0 384 512" className="h-4 w-auto fill-foreground" aria-hidden>
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <span className="text-[12px] font-semibold text-foreground">Pay</span>
          </span>
          <span className="flex h-9 items-center gap-1">
            <span className="text-[13px] font-semibold">
              <span className="text-[#4285F4]">G</span>
            </span>
            <span className="text-[12px] font-semibold text-muted">Pay</span>
          </span>
          <span className="flex h-9 items-center">
            <span className="text-[13px] font-bold italic">
              <span className="text-[#003087]">Pay</span>
              <span className="text-[#009cde]">Pal</span>
            </span>
          </span>
          <span className="hidden h-5 w-px bg-border sm:block" />
          <span className="flex h-9 items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                d="M12 2c3 3 8 5 8 10a8 8 0 1 1-16 0c0-5 5-7 8-10z"
                fill="none"
                stroke="#e6751f"
                strokeWidth="1.6"
              />
            </svg>
            <span className="text-[12px] font-bold text-[#e6751f]">postnl</span>
          </span>
        </div>
      </div>

      {/* Link columns + CTA */}
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-espresso-foreground">
              {t("Soins", "Treatments")}
            </p>
            {soins.map((s) => (
              <Link
                key={s.slug}
                to="/soins/$domaine"
                params={{ domaine: s.slug }}
                search={{ produit: undefined }}
                className="block text-sm text-espresso-muted transition-colors hover:text-amber"
              >
                {t(s.label, s.labelEn)}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-espresso-foreground">
              {t("Découvrir MAAN", "Discover MAAN")}
            </p>
            <Link
              to="/a-propos"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("À propos de MAAN", "About MAAN")}
            </Link>
            <Link
              to="/equipe-medicale"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("L'équipe médicale", "The medical team")}
            </Link>
            <Link
              to="/temoignages"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Témoignages", "Testimonials")}
            </Link>
            <Link
              to="/parcours"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Comment ça marche ?", "How it works")}
            </Link>
            <Link
              to="/guides"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Base de connaissances", "Knowledge base")}
            </Link>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-espresso-foreground">
              {t("Mon compte", "My account")}
            </p>
            <Link
              to="/auth"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Se connecter", "Sign in")}
            </Link>
            <Link
              to="/espace-patient"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Espace patient", "Patient area")}
            </Link>
            <Link
              to="/questionnaire"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Commencer mon évaluation", "Start my assessment")}
            </Link>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-espresso-foreground">
              {t("Informations", "Information")}
            </p>
            <Link
              to="/cookies"
              className="block text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Politique des cookies", "Cookie policy")}
            </Link>
            <button
              type="button"
              onClick={openConsentPreferences}
              className="block text-left text-sm text-espresso-muted transition-colors hover:text-amber"
            >
              {t("Préférences cookies", "Cookie preferences")}
            </button>
          </div>

          <div className="flex flex-col items-start gap-8 lg:items-end">
            <Link
              to="/questionnaire"
              className="group inline-flex items-center gap-2 rounded-full bg-espresso-foreground px-6 py-3 text-sm font-semibold text-espresso transition-transform hover:-translate-y-0.5"
            >
              {t("Commencer mon évaluation", "Start my assessment")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="flex items-center gap-4">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-espresso-muted transition-colors hover:text-amber"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Brand + legal bottom bar */}
        <div className="mt-16 flex flex-col gap-8 border-t border-espresso-foreground/10 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="relative inline-block">
                <span className="relative z-10 font-display text-4xl font-semibold tracking-tight text-espresso-foreground">
                  MAAN
                </span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-2.5 rounded-sm bg-amber/35" />
              </span>
              <span className="whitespace-nowrap font-signature text-2xl leading-none text-clay">
                {t("Des soins pensés pour les hommes", "Care designed for men")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-espresso-muted">
            <span>© MAAN 2026</span>
            <Link to="/cookies" className="transition-colors hover:text-amber">
              {t("Cookies", "Cookies")}
            </Link>
            <button
              type="button"
              onClick={openConsentPreferences}
              className="uppercase tracking-[0.14em] transition-colors hover:text-amber"
            >
              {t("Préférences", "Preferences")}
            </button>
            <button
              type="button"
              aria-label={t("Retour en haut", "Back to top")}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso-foreground/10 text-espresso-foreground transition-colors hover:bg-espresso-foreground/20"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
