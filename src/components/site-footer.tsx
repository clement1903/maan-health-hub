import { Link } from "@tanstack/react-router";

import { openConsentPreferences } from "@/lib/cookie-consent";

const soins = [
  { label: "Sexual", slug: "sexuel" },
  { label: "Weight", slug: "poids" },
  { label: "Hair", slug: "cheveux" },
  { label: "Skin", slug: "peau" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-[36ch]">
            <span className="font-display text-2xl font-semibold tracking-tight">MAAN</span>
            <p className="mt-3 text-pretty text-sm text-muted">
              Des soins pensés pour les hommes. Questionnaire médical, validation de la prescription
              par un médecin et livraison discrète à domicile.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-foreground">Soins</p>
              {soins.map((s) => (
                <p key={s} className="transition-colors hover:text-clay">
                  {s}
                </p>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-foreground">Parcours</p>
              <Link to="/parcours" className="block transition-colors hover:text-clay">
                Accès aux traitements
              </Link>
              <Link to="/espace-patient" className="block transition-colors hover:text-clay">
                Espace patient
              </Link>
              <Link to="/auth" className="block transition-colors hover:text-clay">
                Se connecter
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-foreground">Conformité</p>
              <Link to="/conformite" className="block transition-colors hover:text-clay">
                Prescription
              </Link>
              <Link
                to="/conformite"
                hash="donnees"
                className="block transition-colors hover:text-clay"
              >
                Données de santé
              </Link>
              <Link
                to="/conformite"
                hash="expedition"
                className="block transition-colors hover:text-clay"
              >
                Expédition
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-[11px] leading-relaxed text-muted">
            Les traitements sont délivrés uniquement sur ordonnance établie par un médecin agréé
            après évaluation de votre questionnaire. La pharmacie partenaire prépare et expédie les
            médicaments. Ce site ne vend pas de médicament sans prescription.
          </p>
        </div>
      </div>
    </footer>
  );
}
