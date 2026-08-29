import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ParcoursStepper, type Etape } from "@/components/parcours-stepper";

export const Route = createFileRoute("/parcours")({
  head: () => ({
    meta: [
      { title: "Parcours d'accès aux traitements — MAAN" },
      {
        name: "description",
        content:
          "Questionnaire médical, validation de la prescription par un médecin agréé, préparation en pharmacie et livraison discrète à domicile : le parcours MAAN étape par étape.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Parcours d'accès aux traitements — MAAN" },
      {
        property: "og:description",
        content:
          "Trois étapes claires : questionnaire, validation de prescription, livraison à domicile.",
      },
      { property: "og:url", content: "/parcours" },
      { name: "twitter:title", content: "Parcours d'accès aux traitements — MAAN" },
      {
        name: "twitter:description",
        content:
          "Questionnaire, validation de prescription et livraison : le parcours MAAN étape par étape.",
      },
    ],
    links: [{ rel: "canonical", href: "/parcours" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Accéder à un traitement avec MAAN",
          step: [
            { "@type": "HowToStep", name: "Questionnaire médical", text: "Vous répondez à un questionnaire médical détaillé sur votre situation, vos antécédents et vos traitements en cours." },
            { "@type": "HowToStep", name: "Validation de la prescription", text: "Un médecin agréé évalue votre dossier et délivre une ordonnance si un traitement est justifié." },
            { "@type": "HowToStep", name: "Préparation et livraison", text: "La pharmacie partenaire prépare votre traitement et l'expédie dans un colis neutre." },
          ],
        }),
      },
    ],
  }),
  component: ParcoursPage,
});

const etapes: Etape[] = [
  {
    n: "1",
    title: "Questionnaire médical",
    desc: "Vous décrivez votre situation, vos antécédents et vos traitements en cours.",
    detail:
      "Comptez 3 à 5 minutes. Vous pouvez l'interrompre et le reprendre depuis votre espace patient. Les réponses sont enregistrées de façon confidentielle et lues uniquement par l'équipe médicale.",
  },
  {
    n: "2",
    title: "Validation de la prescription",
    desc: "Un médecin agréé évalue votre dossier et décide s'il délivre une ordonnance.",
    detail:
      "Réponse sous 24 h ouvrées. Le médecin peut demander des précisions, proposer un autre dosage, refuser la demande ou vous orienter vers une consultation physique. La décision apparaît dans votre espace patient.",
  },
  {
    n: "3",
    title: "Préparation et livraison à domicile",
    desc: "La pharmacie partenaire prépare puis expédie votre traitement.",
    detail:
      "Une fois l'ordonnance validée, la pharmacie partenaire prépare puis expédie le traitement prescrit dans un colis neutre. Suivi transporteur affiché dans votre espace, livraison en 24 à 48 h chez vous ou en point relais.",
  },
];

const details = [
  {
    t: "Ce que vous recevez",
    d: "Une ordonnance officielle, utilisable aussi dans votre pharmacie habituelle, et le traitement correspondant.",
  },
  {
    t: "Ce qui peut arriver",
    d: "Une demande de précisions, un ajustement de dosage, ou un refus motivé si le traitement n'est pas adapté.",
  },
  {
    t: "Le suivi",
    d: "Chaque changement d'état — dossier reçu, prescription validée, colis expédié — s'affiche dans votre espace patient.",
  },
];

function ParcoursPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Parcours d'accès aux traitements
            </p>
            <h1 className="mt-4 max-w-[22ch] text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
              Questionnaire, prescription, livraison.
            </h1>
            <p className="mt-6 max-w-[54ch] text-pretty text-lg text-muted">
              Aucun traitement n'est vendu librement. Chaque demande est évaluée par un médecin
              agréé ; si une ordonnance est délivrée, une pharmacie partenaire prépare et expédie
              le traitement prescrit.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <ParcoursStepper etapes={etapes} />
          </Reveal>
        </section>

        <section className="border-y border-border bg-cream">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-16 sm:grid-cols-3 lg:py-20">
            {details.map((d, i) => (
              <Reveal
                key={d.t}
                delay={i * 90}
                className="rounded-[16px] border border-border bg-background p-7"
              >
                <h2 className="font-display text-xl font-medium tracking-tight">{d.t}</h2>
                <p className="mt-2 text-pretty text-sm text-muted">{d.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-clay text-cream">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
            <h2 className="max-w-[24ch] text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Commencez votre questionnaire depuis votre espace patient.
            </h2>
            <Link
              to="/espace-patient"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-7 py-4 text-sm font-medium text-foreground transition-all duration-300 hover:gap-3 hover:bg-sand"
            >
              Ouvrir mon espace patient
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
