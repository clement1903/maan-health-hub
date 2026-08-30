import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ProduitCarrousel } from "@/components/produit-carrousel";
import { getDomaine, domaines, prixAbonnement, type Produit } from "@/data/soins";
import { MedicalDisclaimer } from "@/components/medical-disclaimer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/soins/$domaine")({
  validateSearch: (search: Record<string, unknown>) => ({
    produit: typeof search["produit"] === "string" ? (search["produit"] as string) : undefined,
  }),
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

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function TarifsProduit({ produit }: { produit: Produit }) {
  const [mode, setMode] = useState<"unite" | "abonnement">("abonnement");
  const [mois, setMois] = useState(3);
  const abo = prixAbonnement(produit.prixMensuel!, mois);
  const remisePct = Math.round(abo.remise * 100);

  return (
    <div className="mt-8 border-t border-border pt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Prix indicatif
      </p>
      <div
        role="group"
        aria-label="Choisir le mode d'achat"
        className="mt-3 inline-flex rounded-full border border-border bg-cream p-1"
      >
        {(
          [
            { key: "unite", label: "À l'unité" },
            { key: "abonnement", label: "Abonnement" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setMode(opt.key)}
            aria-pressed={mode === opt.key}
            className={cn(
              "rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300",
              mode === opt.key ? "bg-clay text-cream" : "text-muted hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {mode === "unite" ? (
        <div className="mt-4 animate-[rise_0.3s_var(--ease)_both]">
          <p className="font-section text-3xl font-medium tracking-tight">
            {fmt.format(produit.prixUnite!)}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Achat unique, sans engagement. Renouvellement uniquement après décision du médecin.
          </p>
        </div>
      ) : (
        <div className="mt-4 animate-[rise_0.3s_var(--ease)_both]">
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMois(m)}
                aria-pressed={mois === m}
                aria-label={`Abonnement de ${m} mois`}
                className={cn(
                  "h-9 w-9 rounded-full border font-mono text-[11px] transition-all duration-300",
                  mois === m
                    ? "border-clay bg-clay text-cream"
                    : "border-border bg-background text-muted hover:border-clay/40 hover:text-foreground",
                )}
              >
                {m}
              </button>
            ))}
            <span className="text-xs text-muted">mois</span>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-section text-3xl font-medium tracking-tight">
              {fmt.format(abo.mensuel)}
              <span className="text-sm font-normal text-muted"> / mois</span>
            </p>
            <p className="text-xs text-muted">
              soit {fmt.format(abo.total)} pour {mois} mois
            </p>
            {remisePct > 0 && (
              <span className="rounded-full bg-clay/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-clay">
                −{remisePct} %
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Engagement de {mois} mois, résiliable à l'échéance. Frais de consultation et de
            livraison détaillés lors de votre parcours.
          </p>
        </div>
      )}
    </div>
  );
}

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
                search={{ produit: undefined }}
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
  const { produit: produitSearch } = Route.useSearch();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeProduit, setActiveProduit] = useState(() => {
    const idx = domaine.produits.findIndex((p) => p.nom === produitSearch);
    return idx >= 0 ? idx : 0;
  });
  const produit = domaine.produits[activeProduit] ?? domaine.produits[0]!;
  const produitSeul = domaine.produits.some((p) => p.nom === produitSearch);



  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
            <Reveal>
              <nav aria-label="Fil d'Ariane" className="mb-8">
                <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  <li>
                    <Link
                      to="/soins"
                      className="transition-colors hover:text-clay"
                    >
                      Nos soins
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-border">/</li>
                  <li>
                    <Link
                      to="/soins/$domaine"
                      params={{ domaine: domaine.slug }}
                      search={{ produit: undefined }}
                      className="transition-colors hover:text-clay"
                    >
                      {domaine.tag}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-border">/</li>
                  <li aria-current="page" className="text-foreground">
                    {produit.nom}
                  </li>
                </ol>
              </nav>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                {domaine.tag}
              </p>
              <h1 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-5xl">
                {domaine.titre}
              </h1>
              <p className="mt-5 max-w-[60ch] text-pretty text-muted">
                Découvrez chaque traitement en détail : photo, mode d'action, précautions et
                suivi. Informations indicatives — la décision appartient au médecin qui évalue
                votre dossier.
              </p>
            </Reveal>
          </div>
        </section>

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
            {produitSeul && (
              <div className="mt-6">
                <Link
                  to="/soins"
                  className="text-sm font-medium underline decoration-clay/40 decoration-2 underline-offset-[6px] transition-all hover:decoration-clay hover:underline-offset-8"
                >
                  ← Retour
                </Link>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-2">
              {!produitSeul &&
                domaine.produits.map((p, i) => (
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
                {produit.prixUnite != null && produit.prixMensuel != null ? (
                  <TarifsProduit key={produit.nom} produit={produit} />
                ) : (
                  <div className="mt-8 flex items-end justify-between gap-4 border-t border-border pt-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        Prix indicatif
                      </p>
                      <p className="mt-1 font-section text-3xl font-medium tracking-tight text-foreground">
                        {produit.prix}
                      </p>
                    </div>
                    <p className="max-w-[20ch] text-right text-[11px] leading-relaxed text-muted">
                      Frais de consultation et de livraison détaillés lors de votre parcours.
                    </p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-7">
                <ProduitCarrousel produit={produit} />
              </div>
            </div>

            <MedicalDisclaimer className="mt-10" />

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
                  search={{ produit: undefined }}
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
