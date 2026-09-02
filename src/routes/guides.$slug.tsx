import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { GUIDES, getGuide, loc } from "@/data/guides";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => {
    const g = getGuide(params.slug);
    if (!g) {
      return { meta: [{ title: "Guide introuvable — MAAN" }, { name: "robots", content: "noindex" }] };
    }
    const url = `/guides/${g.slug}`;
    const title = `${g.titre.fr} | MAAN`;
    const description = g.chapo.fr;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: g.keywords.join(", ") },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            headline: g.titre.fr,
            description,
            url,
            inLanguage: "fr",
            about: { "@type": "MedicalCondition", name: g.categorie.fr },
            publisher: { "@type": "Organization", name: "MAAN" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "MAAN", item: "/" },
              { "@type": "ListItem", position: 2, name: "Base de connaissances", item: "/guides" },
              { "@type": "ListItem", position: 3, name: g.titre.fr, item: url },
            ],
          }),
        },
        ...(g.faq.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: g.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q.fr,
                    acceptedAnswer: { "@type": "Answer", text: f.r.fr },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  loader: ({ params }) => {
    if (!getGuide(params.slug)) throw notFound();
    return null;
  },
  component: GuidePage,
});

function GuidePage() {
  const { slug } = Route.useParams();
  const { t, lang } = useI18n();
  const g = getGuide(slug);
  if (!g) return null;

  const autres = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-16">
        <Reveal>
          <Link
            to="/guides"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-clay"
          >
            ← {t("Base de connaissances", "Knowledge base")}
          </Link>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-clay">
            {loc(g.categorie, lang)} · {g.lecture} {t("min", "min")}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            {loc(g.titre, lang)}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{loc(g.chapo, lang)}</p>
        </Reveal>

        <article className="mt-14 space-y-12">
          {g.sections.map((s, i) => (
            <Reveal key={i}>
              <section>
                <h2 className="font-display text-2xl tracking-tight">{loc(s.h, lang)}</h2>
                <div className="mt-4 space-y-4">
                  {s.p.map((p, j) => (
                    <p key={j} className="leading-relaxed text-muted">
                      {loc(p, lang)}
                    </p>
                  ))}
                </div>
                {s.li && (
                  <ul className="mt-4 space-y-2">
                    {s.li.map((l, j) => (
                      <li key={j} className="flex gap-3 leading-relaxed text-muted">
                        <span className="mt-[0.6em] h-px w-4 shrink-0 bg-clay" />
                        <span>{loc(l, lang)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </article>

        {g.faq.length > 0 && (
          <Reveal>
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="font-display text-2xl tracking-tight">{t("Questions fréquentes", "Frequently asked")}</h2>
              <dl className="mt-6 space-y-6">
                {g.faq.map((f, i) => (
                  <div key={i}>
                    <dt className="font-medium">{loc(f.q, lang)}</dt>
                    <dd className="mt-2 leading-relaxed text-muted">{loc(f.r, lang)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        )}

        <Reveal>
          <section className="mt-16 rounded-3xl border border-border bg-card p-8">
            <p className="font-display text-2xl leading-snug tracking-tight">
              {t(
                "Un médecin évalue votre situation en ligne.",
                "A doctor reviews your situation online.",
              )}
            </p>
            <p className="mt-3 text-sm text-muted">
              {t(
                "Le traitement n'est payé qu'une fois prescrit. Contenu informatif : il ne remplace pas un avis médical.",
                "Treatment is only paid for once prescribed. Informational content: it does not replace medical advice.",
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/questionnaire"
                className="rounded-full bg-clay px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90"
              >
                {t("Commencer mon évaluation", "Start my assessment")}
              </Link>
              <Link
                to="/soins/$domaine"
                params={{ domaine: g.domaine }}
                search={{ produit: undefined }}
                className="rounded-full border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-clay hover:text-clay"
              >
                {t("Voir les traitements", "See treatments")}
              </Link>
            </div>
          </section>
        </Reveal>

        <section className="mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {t("À lire ensuite", "Read next")}
          </p>
          <div className="mt-5 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
            {autres.map((x) => (
              <Link
                key={x.slug}
                to="/guides/$slug"
                params={{ slug: x.slug }}
                className="group flex items-baseline justify-between gap-6 bg-background px-6 py-5 transition-colors hover:bg-card"
              >
                <span className="font-display text-lg leading-snug tracking-tight">{loc(x.titre, lang)}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
