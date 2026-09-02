import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos de MAAN | Soins pensés pour les hommes" },
      {
        name: "description",
        content:
          "MAAN simplifie l'accès aux soins masculins : questionnaire médical en ligne, consultation avec un médecin agréé, traitement prescrit expédié discrètement.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "À propos de MAAN | Soins pensés pour les hommes" },
      {
        property: "og:description",
        content:
          "Consultation médicale en ligne, ordonnance officielle, livraison discrète : découvrir MAAN.",
      },
      { property: "og:url", content: "/a-propos" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "À propos de MAAN | Soins pensés pour les hommes" },
      {
        name: "twitter:description",
        content:
          "MAAN, la clinique privée en ligne pour les soins masculins.",
      },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: AProposPage,
});

function AProposPage() {
  const { t } = useI18n();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pb-24 pt-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {t("À propos de MAAN", "About MAAN")}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {t(
                "MAAN est une plateforme de santé masculine qui permet de consulter un médecin en ligne, de recevoir une ordonnance si un traitement est indiqué, et de se faire livrer discrètement à domicile.",
                "MAAN is a men's health platform that lets you consult a doctor online, receive a prescription if a treatment is appropriate, and have it delivered discreetly to your home.",
              )}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-12 space-y-8">
              <div className="rounded-2xl border border-border bg-cream p-8">
                <h2 className="font-display text-2xl font-medium text-foreground">
                  {t("Notre mission", "Our mission")}
                </h2>
                <p className="mt-3 text-muted">
                  {t(
                    "Réduire les freins à la consultation masculine. Beaucoup d'hommes repoussent un rendez-vous médical par manque de temps, de discrétion ou de confort. MAAN repense le parcours pour qu'il soit simple, confidentiel et médicalement rigoureux.",
                    "Remove the barriers that keep men from seeking care. Many men delay a medical appointment because of time, discretion, or discomfort. MAAN reimagines the journey so it is simple, confidential, and medically rigorous.",
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-cream p-8">
                <h2 className="font-display text-2xl font-medium text-foreground">
                  {t("Comment ça marche", "How it works")}
                </h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
                  <li>
                    {t(
                      "Vous répondez à un questionnaire médical en ligne.",
                      "You answer an online medical questionnaire.",
                    )}
                  </li>
                  <li>
                    {t(
                      "Un médecin agréé étudie votre dossier et vous consulte en visio si nécessaire.",
                      "A licensed doctor reviews your file and consults you by video if needed.",
                    )}
                  </li>
                  <li>
                    {t(
                      "Si une prescription est appropriée, la pharmacie partenaire prépare et expédie votre traitement.",
                      "If a prescription is appropriate, the partner pharmacy prepares and ships your treatment.",
                    )}
                  </li>
                  <li>
                    {t(
                      "Vous bénéficiez d'un suivi dans votre espace patient.",
                      "You receive follow-up care in your patient area.",
                    )}
                  </li>
                </ol>
              </div>

              <div className="rounded-2xl border border-border bg-cream p-8">
                <h2 className="font-display text-2xl font-medium text-foreground">
                  {t("Sécurité et confidentialité", "Safety and confidentiality")}
                </h2>
                <p className="mt-3 text-muted">
                  {t(
                    "Vos données de santé sont chiffrées et hébergées en Europe. Le secret médical s'applique à chaque étape. Aucun traitement n'est délivré sans prescription d'un médecin.",
                    "Your health data is encrypted and hosted in Europe. Medical confidentiality applies at every step. No treatment is dispensed without a doctor's prescription.",
                  )}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
