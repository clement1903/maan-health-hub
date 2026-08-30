import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/conformite")({
  head: () => ({
    meta: [
      { title: "Conformité et confidentialité — MAAN" },
      {
        name: "description",
        content:
          "Comment MAAN encadre la prescription médicale, protège vos données de santé et organise l'expédition à domicile depuis une pharmacie partenaire.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Conformité et confidentialité — MAAN" },
      {
        property: "og:description",
        content:
          "Prescription encadrée, données de santé chiffrées et hébergées en Europe, expédition en colis neutre.",
      },
      { property: "og:url", content: "/conformite" },
      { name: "twitter:title", content: "Conformité et confidentialité — MAAN" },
      {
        name: "twitter:description",
        content:
          "Prescription encadrée, données de santé protégées, expédition discrète depuis une pharmacie partenaire.",
      },
    ],
    links: [{ rel: "canonical", href: "/conformite" }],
  }),
  component: ConformitePage,
});

const blocs = [
  {
    id: "prescription",
    tag: "Prescription",
    title: "Aucun médicament sans ordonnance",
    intro:
      "MAAN ne vend pas de médicament en libre accès. Chaque demande est évaluée individuellement par un médecin agréé.",
    points: [
      "Les médecins qui interviennent sont inscrits à l'Ordre et exercent sous leur propre responsabilité.",
      "La prescription peut être refusée, modifiée ou conditionnée à un examen complémentaire.",
      "L'ordonnance délivrée est un document officiel : vous pouvez l'utiliser dans la pharmacie de votre choix.",
      "Le renouvellement fait l'objet d'une nouvelle évaluation médicale, jamais d'une reconduction automatique.",
    ],
  },
  {
    id: "donnees",
    tag: "Données de santé",
    title: "Vos réponses restent confidentielles",
    intro:
      "Les informations que vous transmettez sont des données de santé. Elles sont traitées avec le niveau de protection correspondant.",
    points: [
      "Chiffrement en transit et au repos, hébergement des données en Europe.",
      "Accès limité à l'équipe médicale et à la pharmacie chargée de préparer votre traitement.",
      "Aucune revente, aucun partage publicitaire, aucun profilage commercial à partir de votre dossier médical.",
      "Droit d'accès, de rectification, de portabilité et de suppression exerçable à tout moment depuis votre espace patient.",
    ],
  },
  {
    id: "expedition",
    tag: "Expédition à domicile",
    title: "Un colis neutre, préparé en pharmacie",
    intro:
      "La préparation et l'expédition sont assurées par une pharmacie partenaire agréée, jamais par MAAN directement.",
    points: [
      "Emballage neutre : ni contenu, ni marque, ni mention thérapeutique visible à l'extérieur.",
      "Livraison en 24 à 48 h à votre adresse ou en point relais, avec suivi affiché dans votre espace patient.",
      "Chaîne de conservation respectée, notice et conseils de prise inclus dans le colis.",
      "En cas d'incident de livraison, la pharmacie assure le remplacement selon la réglementation en vigueur.",
    ],
  },
  {
    id: "medical",
    tag: "Information médicale",
    title: "Aucune décision automatisée",
    intro:
      "Les informations présentées sur ce site sont fournies à titre indicatif et ne remplacent pas un avis médical.",
    points: [
      "Les médicaments présentés sont disponibles sur ordonnance uniquement : aucun traitement n'est vendu ni délivré sans prescription d'un médecin.",
      "Les posologies affichées sont indicatives ; seul le médecin fixe la dose adaptée à votre situation.",
      "Le questionnaire médical ne constitue ni un diagnostic, ni une prescription. Vos réponses sont transmises telles quelles à un médecin indépendant, seul habilité à décider si un traitement est approprié, si des informations complémentaires sont nécessaires, ou s'il n'est pas adapté.",
      "Aucune décision n'est automatisée. Répondez avec précision et sincérité : la qualité de l'évaluation en dépend.",
      "Lisez toujours la notice et signalez tout effet indésirable à votre médecin ou à la pharmacie qui vous a dispensé le médicament.",
      "En cas d'urgence, contactez le 15 ou le 112.",
    ],
  },
];

function ConformitePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Conformité & confidentialité
            </p>
            <h1 className="mt-4 max-w-[24ch] text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
              Ce que nous faisons de votre ordonnance, de vos données et de votre colis.
            </h1>
            <p className="mt-6 max-w-[56ch] text-pretty text-lg text-muted">
              Trois engagements concrets, écrits sans détour : la prescription reste médicale, vos
              données restent confidentielles, et l'expédition reste discrète.
            </p>
          </Reveal>
        </section>

        {blocs.map((b, i) => (
          <section
            key={b.id}
            id={b.id}
            className={
              i % 2 === 0
                ? "scroll-mt-24 border-y border-border bg-cream"
                : "scroll-mt-24 bg-background"
            }
          >
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-12 lg:py-20">
              <Reveal className="lg:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">{b.tag}</p>
                <h2 className="mt-3 text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
                  {b.title}
                </h2>
                <p className="mt-4 max-w-[42ch] text-pretty text-muted">{b.intro}</p>
              </Reveal>
              <div className="lg:col-span-7">
                <ul className="divide-y divide-border border-y border-border">
                  {b.points.map((p, j) => (
                    <Reveal as="li" key={p} delay={j * 70} className="flex gap-5 py-5">
                      <span className="font-mono text-[11px] tracking-[0.14em] text-clay">
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <span className="text-pretty text-sm">{p}</span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}

        <section className="border-t border-border bg-sand">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-14 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[60ch] text-pretty text-sm text-muted">
              Une question sur le traitement de votre dossier ? Le détail du circuit — questionnaire,
              validation de prescription, livraison — est décrit étape par étape.
            </p>
            <Link
              to="/parcours"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
            >
              Voir le parcours
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
