import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { domaines, type Produit } from "@/data/soins";
import { Reveal } from "@/components/reveal";
import { ImageZoom } from "@/components/image-zoom";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/soins/")({
  head: () => ({
    meta: [
      { title: "Nos soins et traitements — MAAN" },
      {
        name: "description",
        content:
          "Découvrez les quatre spécialités MAAN et les traitements associés : santé sexuelle, poids, cheveux et peau. Molécules, formes, posologies indicatives — sur ordonnance uniquement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Nos soins et traitements — MAAN" },
      {
        property: "og:description",
        content:
          "Quatre spécialités, les traitements proposés et leur posologie indicative. Délivrance uniquement après évaluation par un médecin.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nos soins et traitements — MAAN" },
      {
        name: "twitter:description",
        content:
          "Quatre spécialités et les traitements associés, prescrits uniquement après évaluation médicale.",
      },
    ],
    links: [{ rel: "canonical", href: "/soins" }],
  }),
  component: SoinsIndex,
});

function SoinsIndex() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main>
        <section className="border-b border-border bg-cream">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Nos soins
            </p>
            <h1 className="mt-3 max-w-[22ch] text-balance font-section text-4xl font-medium tracking-tight lg:text-5xl">
              Les spécialités et les traitements que nous proposons.
            </h1>
            <p className="mt-5 max-w-[62ch] text-pretty text-muted">
              Chaque traitement présenté ici est un médicament soumis à prescription. Il n'est
              préparé et expédié qu'après l'évaluation de votre dossier par un médecin agréé et la
              délivrance d'une ordonnance. Les posologies indiquées sont fournies à titre
              informatif : seule celle de votre ordonnance fait foi.
            </p>
            <nav className="mt-8 flex flex-wrap gap-2">
              {domaines.map((d) => (
                <a
                  key={d.slug}
                  href={`#${d.slug}`}
                  className="rounded-full border border-border bg-background px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-clay/50 hover:text-foreground"
                >
                  {d.titre}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {domaines.map((d, i) => (
          <section
            key={d.slug}
            id={d.slug}
            className={`scroll-mt-24 border-b border-border ${i % 2 === 1 ? "bg-cream" : ""}`}
          >
            <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
              <Reveal className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <img
                    src={d.image}
                    alt={`Spécialité MAAN ${d.titre} — ${d.tag}`}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="aspect-[4/3] w-full rounded-[20px] object-cover shadow-[0_40px_100px_-70px_var(--foreground)]"
                  />
                </div>
                <div className="lg:col-span-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                    {d.tag}
                  </p>
                  <h2 className="mt-3 font-section text-3xl font-medium tracking-tight lg:text-4xl">
                    {d.titre}
                  </h2>
                  <p className="mt-3 max-w-[56ch] text-pretty text-muted">{d.chapo}</p>
                  <ul className="mt-6 space-y-2">
                    {d.indications.map((ind) => (
                      <li key={ind} className="flex items-start gap-3 text-sm">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                        <span className="text-pretty">{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <ProduitCarousel produits={d.produits} label={d.titre} />

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to="/soins/$domaine"
                    params={{ domaine: d.slug }}
                    className="group inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
                  >
                    En savoir plus sur {d.titre.toLowerCase()}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link
                    to="/questionnaire/$slug"
                    params={{ slug: d.slug }}
                    className="font-medium underline decoration-clay/40 decoration-2 underline-offset-[6px] transition-all hover:decoration-clay hover:underline-offset-8"
                  >
                    Commencer le questionnaire
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
