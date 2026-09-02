import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { GUIDES, loc } from "@/data/guides";
import { useI18n } from "@/lib/i18n";

const TITLE = "Base de connaissances santé masculine — guides médicaux | MAAN";
const DESC =
  "Guides clairs sur les troubles de l'érection, l'éjaculation précoce, la chute de cheveux, la perte de poids et l'acné chez l'homme : causes, examens et traitements sur ordonnance.";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "santé masculine, troubles de l'érection, éjaculation précoce, chute de cheveux, perte de poids homme, acné adulte, consultation médicale en ligne, ordonnance en ligne",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/guides" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESC,
          url: "/guides",
          hasPart: GUIDES.map((g) => ({
            "@type": "MedicalWebPage",
            name: g.titre.fr,
            description: g.chapo.fr,
            url: `/guides/${g.slug}`,
          })),
        }),
      },
    ],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  const { t, lang } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-clay">
            {t("Base de connaissances", "Knowledge base")}
          </p>
          <h1 className="mt-4 max-w-[18ch] font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            {t("Comprendre avant de traiter.", "Understand before treating.")}
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg text-muted">
            {t(
              "Des repères médicaux écrits simplement, sur les sujets que les hommes évoquent le moins. Ces contenus informent : ils ne remplacent pas une consultation.",
              "Plainly written medical guidance on the subjects men raise least. These articles inform; they do not replace a consultation.",
            )}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
          {GUIDES.map((g, i) => (
            <Reveal key={g.slug} delay={i * 60}>
              <Link
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="group flex h-full flex-col justify-between bg-background p-8 transition-colors hover:bg-card"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                    {loc(g.categorie, lang)}
                  </p>
                  <h2 className="mt-4 font-display text-2xl leading-snug tracking-tight">
                    {loc(g.titre, lang)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{loc(g.chapo, lang)}</p>
                </div>
                <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {g.lecture} {t("min de lecture", "min read")}
                  <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
