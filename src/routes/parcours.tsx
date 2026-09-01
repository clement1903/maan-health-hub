import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ParcoursFlashback } from "@/components/parcours-flashback";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/parcours")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Le parcours MAAN étape par étape" },
      {
        name: "description",
        content:
          "Remontez le parcours : livraison discrète, pharmacie, prescription, décision médicale et évaluation en ligne. Le parcours MAAN raconté à l'envers, étape par étape.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Comment ça marche — Le parcours MAAN étape par étape" },
      {
        property: "og:description",
        content:
          "Évaluation en ligne, décision médicale, pharmacie, livraison discrète : découvrez comment un traitement arrive jusqu'à vous.",
      },
      { property: "og:url", content: "/parcours" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Comment ça marche — Le parcours MAAN" },
      {
        name: "twitter:description",
        content:
          "Le parcours MAAN raconté à l'envers : de la livraison jusqu'à la première question.",
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
            {
              "@type": "HowToStep",
              name: "Évaluation en ligne",
              text: "Vous répondez à quelques questions sur votre situation, vos antécédents et vos traitements en cours.",
            },
            {
              "@type": "HowToStep",
              name: "Décision médicale",
              text: "Un médecin examine votre dossier et détermine si un traitement est médicalement adapté.",
            },
            {
              "@type": "HowToStep",
              name: "Prescription",
              text: "Si un traitement est justifié, le médecin délivre une prescription.",
            },
            {
              "@type": "HowToStep",
              name: "Pharmacie",
              text: "Une pharmacie prépare et délivre le traitement prescrit.",
            },
            {
              "@type": "HowToStep",
              name: "Livraison",
              text: "Le traitement est expédié dans un colis neutre, généralement sous 48 h après la prescription.",
            },
          ],
        }),
      },
    ],
  }),
  component: ParcoursPage,
});

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
      {children}
    </span>
  );
}

function ParcoursPage() {
  const { t } = useI18n();

  const acteurs = [
    {
      role: t("MAAN", "MAAN"),
      titre: t("Votre parcours et votre accompagnement.", "Your journey and your follow-up."),
      texte: t(
        "Nous organisons l'évaluation, la mise en relation avec un médecin, le suivi et la logistique. Nous ne prescrivons pas.",
        "We organise the assessment, the connection with a doctor, the follow-up and the logistics. We do not prescribe.",
      ),
    },
    {
      role: t("Médecin", "Doctor"),
      titre: t("La décision médicale.", "The medical decision."),
      texte: t(
        "Un médecin indépendant examine votre dossier et décide, seul, si un traitement est adapté à votre situation.",
        "An independent doctor reviews your file and decides, alone, whether a treatment suits your situation.",
      ),
    },
    {
      role: t("Pharmacie", "Pharmacy"),
      titre: t("La préparation et la délivrance.", "Preparation and dispensing."),
      texte: t(
        "Une pharmacie agréée prépare le traitement prescrit, contrôle la délivrance et l'expédie dans un colis neutre.",
        "A licensed pharmacy prepares the prescribed treatment, checks the dispensing and ships it in an unmarked parcel.",
      ),
    },
  ];

  const faq = [
    {
      q: t("Est-ce qu'un traitement est garanti ?", "Is a treatment guaranteed?"),
      a: t(
        "Non. Le médecin peut estimer qu'aucun traitement n'est adapté, ou demander des informations complémentaires.",
        "No. The doctor may decide that no treatment is appropriate, or ask for further information.",
      ),
    },
    {
      q: t("En combien de temps est-ce livré ?", "How long does delivery take?"),
      a: t(
        "Généralement sous 48 h après la prescription, selon la disponibilité en pharmacie et le transporteur.",
        "Usually within 48 h of the prescription, depending on pharmacy availability and the carrier.",
      ),
    },
    {
      q: t("Que voit-on sur le colis ?", "What can be seen on the parcel?"),
      a: t(
        "Rien. Emballage neutre, sans mention du traitement, de la pathologie ni du domaine de soin.",
        "Nothing. Unmarked packaging, with no mention of the treatment, the condition or the care area.",
      ),
    },
    {
      q: t("Puis-je échanger avec le médecin ensuite ?", "Can I talk to the doctor afterwards?"),
      a: t(
        "Oui, depuis votre espace patient : ajustement, renouvellement ou arrêt du traitement.",
        "Yes, from your patient portal: adjustment, renewal or stopping the treatment.",
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="flex-1">
        <h1 className="sr-only">
          {t(
            "Comment ça marche : le parcours MAAN, de l'évaluation à la livraison",
            "How it works: the MAAN journey, from assessment to delivery",
          )}
        </h1>

        {/* LE FILM — rembobinage contrôlé au scroll */}
        <ParcoursFlashback />

        {/* Retour au calme */}
        <section className="mx-auto w-full max-w-6xl px-6 py-28 lg:py-40">
          <Reveal>
            <Eyebrow>{t("Qui fait quoi ?", "Who does what?")}</Eyebrow>
            <h2 className="mt-6 max-w-[24ch] text-balance font-section text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {t("Trois rôles, clairement séparés.", "Three roles, clearly separated.")}
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] bg-border md:grid-cols-3">
            {acteurs.map((a, i) => (
              <Reveal key={a.role} delay={i * 110}>
                <div className="flex h-full flex-col bg-background p-10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-clay">
                    {a.role}
                  </span>
                  <h3 className="mt-6 font-section text-xl font-semibold leading-snug">{a.titre}</h3>
                  <p className="mt-4 text-pretty text-base leading-relaxed text-muted">{a.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Confidentialité */}
        <section className="bg-sand py-28 lg:py-36">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-[1fr_1.1fr] md:items-end">
            <Reveal>
              <Eyebrow>{t("Confidentialité", "Privacy")}</Eyebrow>
              <h2 className="mt-6 text-balance font-display text-4xl font-light italic leading-tight md:text-6xl">
                {t("Personne n'a besoin de le savoir.", "Nobody needs to know.")}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <ul className="space-y-5">
                {[
                  t("Colis neutre, sans mention extérieure.", "Unmarked parcel, nothing written outside."),
                  t("Données de santé chiffrées et accès restreint.", "Health data encrypted, access restricted."),
                  t("Échanges avec le médecin dans un espace privé.", "Doctor exchanges inside a private space."),
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-base leading-relaxed text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-4xl px-6 py-28 lg:py-36">
          <Reveal>
            <Eyebrow>{t("Questions fréquentes", "Frequently asked")}</Eyebrow>
          </Reveal>
          <dl className="mt-12 divide-y divide-border border-y border-border">
            {faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 80}>
                <div className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[1fr_1.2fr] md:gap-10">
                  <dt className="font-section text-lg font-semibold leading-snug">{f.q}</dt>
                  <dd className="text-pretty leading-relaxed text-muted">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* CTA final */}
        <section className="flex flex-col items-center px-6 pb-32 lg:pb-44">
          <Reveal>
            <h2 className="text-balance text-center font-display text-5xl font-light italic tracking-tight md:text-7xl">
              {t("Votre parcours", "Your journey")}
              <br />
              <span className="text-clay">{t("commence maintenant.", "starts now.")}</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-12 flex flex-col items-center gap-6">
            <Link
              to="/questionnaire"
              className="group inline-flex items-center gap-2 rounded-full bg-clay px-12 py-6 text-lg font-medium text-cream transition-all duration-500 ease-[var(--ease)] hover:gap-4 hover:bg-clay-deep"
            >
              {t("Commencer mon évaluation", "Start my assessment")}
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Eyebrow>{t("Quelques minutes · Sans engagement", "A few minutes · No commitment")}</Eyebrow>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
