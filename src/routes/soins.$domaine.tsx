import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { getDomaine, domaines, contenus } from "@/data/soins";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/soins/$domaine")({
  loader: ({ params }) => {
    const domaine = getDomaine(params.domaine);
    if (!domaine) throw notFound();
    return { domaine };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Domaine introuvable — MAAN" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const d = loaderData.domaine;
    const title = `${d.titre} — ${d.tag} | MAAN`;
    return {
      meta: [
        { title },
        { name: "description", content: d.chapo },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: d.chapo },
        { property: "og:url", content: `/soins/${params.domaine}` },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: d.chapo },
      ],
      links: [{ rel: "canonical", href: `/soins/${params.domaine}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: d.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.r },
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: DomaineIntrouvable,
  component: DomainePage,
});

function DomaineIntrouvable() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24">
        <h1 className="font-display text-4xl font-medium tracking-tight">Domaine introuvable</h1>
        <p className="mt-4 text-muted">Cette spécialité n'existe pas.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {domaines.map((d) => (
            <Link
              key={d.slug}
              to="/soins/$domaine"
              params={{ domaine: d.slug }}
              className="rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:border-clay/40 hover:text-foreground"
            >
              {d.tag}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function DomainePage() {
  const { domaine } = Route.useLoaderData();
  const contenu = contenus[domaine.slug];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeProduit, setActiveProduit] = useState(0);
  const produit = domaine.produits[activeProduit] ?? domaine.produits[0]!;



  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-12 lg:py-24">
            <Reveal className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                {domaine.tag}
              </p>
              <h1 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
                {domaine.titre}
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg text-muted">{domaine.chapo}</p>
              <ul className="mt-8 space-y-2">
                {domaine.indications.map((i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                to="/questionnaire/$slug"
                params={{ slug: domaine.slug }}
                className="group mt-9 inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
              >

                Démarrer mon questionnaire
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-5">
              <img
                src={domaine.image}
                alt={`Illustration éditoriale — ${domaine.titre}`}
                className="h-full w-full rounded-[20px] object-cover"
                loading="lazy"
              />
            </Reveal>
          </div>
        </section>

        {contenu && (
          <section className="border-b border-border">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-12 lg:py-20">
              <Reveal className="lg:col-span-7">
                <h2 className="font-section text-3xl font-medium tracking-tight lg:text-4xl">
                  Comprendre {domaine.titre.toLowerCase()}
                </h2>
                <p className="mt-5 max-w-[60ch] text-pretty text-muted">{contenu.intro}</p>
                <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                  Qui est concerné
                </h3>
                <ul className="mt-4 space-y-2">
                  {contenu.concerne.map((c) => (
                    <li key={c} className="flex gap-3 text-sm">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={100} className="lg:col-span-5">
                <div className="grid gap-4">
                  {contenu.chiffres.map((c) => (
                    <div key={c.label} className="rounded-[18px] border border-border bg-cream p-6">
                      <p className="font-display text-3xl font-medium tracking-tight text-clay">
                        {c.valeur}
                      </p>
                      <p className="mt-2 text-pretty text-sm">{c.label}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {c.source}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-pretty text-xs text-muted">
                  Ordres de grandeur donnés à titre informatif. Ils ne constituent ni un diagnostic
                  ni une recommandation de traitement.
                </p>
              </Reveal>
            </div>
          </section>
        )}

        <section className="bg-cream">

          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
            <Reveal>
              <h2 className="font-section text-3xl font-medium tracking-tight lg:text-4xl">
                Traitements possibles
              </h2>
              <p className="mt-3 max-w-[60ch] text-pretty text-sm text-muted">
                Ces informations sont données à titre indicatif. Seul le médecin qui étudie votre
                dossier fixe la molécule, le dosage et la durée.
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-2">
              {domaine.produits.map((p, i) => (
                <button
                  key={p.nom}
                  type="button"
                  onClick={() => setActiveProduit(i)}
                  aria-pressed={activeProduit === i}
                  className={cn(
                    "rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-500 ease-[var(--ease)]",
                    activeProduit === i
                      ? "border-clay bg-clay text-cream"
                      : "border-border bg-background text-muted hover:border-clay/40 hover:text-foreground",
                  )}
                >
                  {p.molecule}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div
                key={produit.nom}
                className="animate-[rise_0.5s_var(--ease)_both] rounded-[24px] border border-border bg-background p-8 lg:col-span-5 lg:p-10"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay">
                  {produit.molecule}
                </p>
                <h3 className="mt-2 font-section text-2xl font-medium tracking-tight">
                  {produit.nom}
                </h3>
                <span className="mt-4 inline-block rounded-full border border-clay/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                  Ordonnance
                </span>
                <dl className="mt-7 grid gap-5 text-sm">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Forme
                    </dt>
                    <dd className="mt-1 text-pretty">{produit.forme}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Posologie indicative
                    </dt>
                    <dd className="mt-1 text-pretty">{produit.posologie}</dd>
                  </div>
                </dl>
                <Link
                  to="/questionnaire/$slug"
                  params={{ slug: domaine.slug }}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
                >
                  Démarrer mon questionnaire
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
              <div className="lg:col-span-7">
                <ProduitCarrousel produit={produit} />
              </div>
            </div>

          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
          <Reveal>
            <h2 className="font-section text-3xl font-medium tracking-tight lg:text-4xl">
              Questions fréquentes
            </h2>
          </Reveal>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {domaine.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-pretty font-medium">{f.q}</span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-clay transition-transform duration-500 ease-[var(--ease)]",
                        open && "rotate-45",
                      )}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-[var(--ease)]",
                      open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="overflow-hidden text-pretty text-sm text-muted">{f.r}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border bg-sand">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Autres domaines
            </span>
            {domaines
              .filter((d) => d.slug !== domaine.slug)
              .map((d) => (
                <Link
                  key={d.slug}
                  to="/soins/$domaine"
                  params={{ domaine: d.slug }}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:border-clay/40 hover:text-clay"
                >
                  {d.titre}
                </Link>
              ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
