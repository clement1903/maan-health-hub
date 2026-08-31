import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { openConsentPreferences } from "@/lib/cookie-consent";
import { useI18n } from "@/lib/i18n";

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

function buildTable(t: (fr: string, en: string) => string) {
  return [
    {
      cat: t("Strictement nécessaires", "Strictly necessary"),
      finalite: t(
        "Session de connexion, sécurité, protection contre la fraude, mémorisation du choix de cookies.",
        "Login session, security, fraud prevention, and remembering your cookie choice.",
      ),
      duree: t("Session à 6 mois", "Session to 6 months"),
      consent: t("Exemptés de consentement", "Exempt from consent"),
    },
    {
      cat: t("Mesure d'audience", "Audience measurement"),
      finalite: t(
        "Statistiques agrégées de fréquentation et d'usage des parcours, sans donnée de santé.",
        "Aggregated traffic and usage statistics, without any health data.",
      ),
      duree: t("13 mois maximum", "13 months maximum"),
      consent: t("Désactivés tant que vous n'y consentez pas", "Disabled until you consent"),
    },
    {
      cat: t("Marketing", "Marketing"),
      finalite: t(
        "Mesure de l'efficacité de nos campagnes d'acquisition.",
        "Measuring the effectiveness of our acquisition campaigns.",
      ),
      duree: t("13 mois maximum", "13 months maximum"),
      consent: t("Désactivés par défaut", "Disabled by default"),
    },
  ];
}

function CookiesPage() {
  const { t } = useI18n();
  const table = buildTable(t);
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              {t("Politique des cookies", "Cookie policy")}
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-5xl">
              {t("Ce que nous déposons, et ce que vous pouvez refuser.", "What we set, and what you can decline.")}
            </h1>
            <p className="mt-6 max-w-[58ch] text-pretty text-lg text-muted">
              {t(
                "Seuls les cookies indispensables au fonctionnement du site sont déposés automatiquement. Les autres catégories restent inactives tant que vous ne les avez pas acceptées, et votre choix est réversible à tout moment.",
                "Only the cookies essential to the site's operation are set automatically. Other categories remain inactive until you accept them, and your choice can be reversed at any time.",
              )}
            </p>
            <button
              type="button"
              onClick={openConsentPreferences}
              className="mt-8 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
            >
              {t("Modifier mes préférences cookies", "Change my cookie preferences")}
            </button>
          </Reveal>

          <Reveal delay={80} className="mt-14">
            <h2 className="font-section text-2xl font-medium tracking-tight">
              {t("Catégories utilisées", "Categories used")}
            </h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {table.map((row) => (
                <div key={row.cat} className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-clay sm:col-span-3">
                    {row.cat}
                  </p>
                  <p className="text-pretty text-sm sm:col-span-5">{row.finalite}</p>
                  <p className="text-sm text-muted sm:col-span-2">{row.duree}</p>
                  <p className="text-sm text-muted sm:col-span-2">{row.consent}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-14 space-y-8">
            <div>
              <h2 className="font-section text-2xl font-medium tracking-tight">
                {t("Aucune publicité à partir de vos données de santé", "No advertising built on your health data")}
              </h2>
              <p className="mt-3 text-pretty text-muted">
                {t(
                  "Les réponses à votre questionnaire, la nature de votre traitement et l'historique de vos commandes ne sont jamais transmis à des régies publicitaires, ni utilisés pour du ciblage. Ces données restent dans le circuit médical et pharmaceutique décrit sur la page",
                  "Your questionnaire answers, the nature of your treatment, and your order history are never shared with advertising networks or used for targeting. This data stays within the medical and pharmaceutical process described on the",
                )}{" "}
                <Link to="/conformite" className="underline decoration-clay/50 underline-offset-4">
                  {t("conformité et confidentialité", "compliance and privacy")}
                </Link>
                {t(" page.", " page.")}
              </p>
            </div>
            <div>
              <h2 className="font-section text-2xl font-medium tracking-tight">
                {t("Retirer votre consentement", "Withdrawing your consent")}
              </h2>
              <p className="mt-3 text-pretty text-muted">
                {t(
                  "Cliquez sur « Modifier mes préférences cookies » ci-dessus, ou supprimez les cookies depuis les réglages de votre navigateur. Le retrait est aussi simple que l'accord et ne dégrade pas l'accès à votre espace patient.",
                  "Click \"Change my cookie preferences\" above, or delete cookies from your browser settings. Withdrawing consent is as simple as giving it and does not affect access to your patient portal.",
                )}
              </p>
            </div>
            <div>
              <h2 className="font-section text-2xl font-medium tracking-tight">
                {t("Durée de validité", "Validity period")}
              </h2>
              <p className="mt-3 text-pretty text-muted">
                {t(
                  "Votre choix est conservé six mois. Passé ce délai, la bannière réapparaît pour vous permettre de confirmer ou de modifier vos préférences.",
                  "Your choice is stored for six months. After this period, the banner reappears so you can confirm or update your preferences.",
                )}
              </p>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
