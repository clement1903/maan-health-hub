import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { openConsentPreferences } from "@/lib/cookie-consent";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Politique des cookies — MAAN" },
      {
        name: "description",
        content:
          "Quels cookies MAAN dépose, pour quelle finalité, pendant combien de temps, et comment modifier vos choix à tout moment.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Politique des cookies — MAAN" },
      {
        property: "og:description",
        content:
          "Catégories de cookies, finalités, durées de conservation et gestion de votre consentement chez MAAN.",
      },
      { property: "og:url", content: "/cookies" },
      { name: "twitter:title", content: "Politique des cookies — MAAN" },
      {
        name: "twitter:description",
        content: "Catégories, finalités, durées et gestion de votre consentement.",
      },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

const table = [
  {
    cat: "Strictement nécessaires",
    finalite: "Session de connexion, sécurité, protection contre la fraude, mémorisation du choix de cookies.",
    duree: "Session à 6 mois",
    consent: "Exemptés de consentement",
  },
  {
    cat: "Mesure d'audience",
    finalite: "Statistiques agrégées de fréquentation et d'usage des parcours, sans donnée de santé.",
    duree: "13 mois maximum",
    consent: "Désactivés tant que vous n'y consentez pas",
  },
  {
    cat: "Marketing",
    finalite: "Mesure de l'efficacité de nos campagnes d'acquisition.",
    duree: "13 mois maximum",
    consent: "Désactivés par défaut",
  },
];

function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Politique des cookies
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-5xl">
              Ce que nous déposons, et ce que vous pouvez refuser.
            </h1>
            <p className="mt-6 max-w-[58ch] text-pretty text-lg text-muted">
              Seuls les cookies indispensables au fonctionnement du site sont déposés
              automatiquement. Les autres catégories restent inactives tant que vous ne les avez pas
              acceptées, et votre choix est réversible à tout moment.
            </p>
            <button
              type="button"
              onClick={openConsentPreferences}
              className="mt-8 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
            >
              Modifier mes préférences cookies
            </button>
          </Reveal>

          <Reveal delay={80} className="mt-14">
            <h2 className="font-display text-2xl font-medium tracking-tight">
              Catégories utilisées
            </h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {table.map((t) => (
                <div key={t.cat} className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-clay sm:col-span-3">
                    {t.cat}
                  </p>
                  <p className="text-pretty text-sm sm:col-span-5">{t.finalite}</p>
                  <p className="text-sm text-muted sm:col-span-2">{t.duree}</p>
                  <p className="text-sm text-muted sm:col-span-2">{t.consent}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-14 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight">
                Aucune publicité à partir de vos données de santé
              </h2>
              <p className="mt-3 text-pretty text-muted">
                Les réponses à votre questionnaire, la nature de votre traitement et l'historique de
                vos commandes ne sont jamais transmis à des régies publicitaires, ni utilisés pour
                du ciblage. Ces données restent dans le circuit médical et pharmaceutique décrit sur
                la page{" "}
                <Link to="/conformite" className="underline decoration-clay/50 underline-offset-4">
                  conformité et confidentialité
                </Link>
                .
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight">
                Retirer votre consentement
              </h2>
              <p className="mt-3 text-pretty text-muted">
                Cliquez sur « Modifier mes préférences cookies » ci-dessus, ou supprimez les cookies
                depuis les réglages de votre navigateur. Le retrait est aussi simple que l'accord et
                ne dégrade pas l'accès à votre espace patient.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight">Durée de validité</h2>
              <p className="mt-3 text-pretty text-muted">
                Votre choix est conservé six mois. Passé ce délai, la bannière réapparaît pour vous
                permettre de confirmer ou de modifier vos préférences.
              </p>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
