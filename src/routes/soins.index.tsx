import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { getSoins, type Domaine, type Produit } from "@/data/soins";
import { Reveal } from "@/components/reveal";
import { Floating3D } from "@/components/floating-3d";
import { ImageZoom } from "@/components/image-zoom";

const i3dDelay: Record<string, number> = {
  sexuel: 0,
  poids: 0.7,
  cheveux: 1.4,
  peau: 2.1,
};
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/lib/i18n";

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
  const { t, lang } = useI18n();
  const domaines = getSoins(lang);
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main>
        <section className="border-b border-border bg-cream">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              {t("Nos soins", "Our treatments")}
            </p>
            <h1 className="mt-3 max-w-[22ch] text-balance font-section text-4xl font-medium tracking-tight lg:text-5xl">
              {t("Les expertises et les traitements que nous proposons.", "Our expertises and the treatments we offer.")}
            </h1>
            <p className="mt-5 max-w-[62ch] text-pretty text-muted">
{t(
                "Chaque traitement présenté ici est un médicament soumis à prescription. Il n'est préparé et expédié qu'après l'évaluation de votre dossier par un médecin agréé et la délivrance d'une ordonnance. Les posologies indiquées sont fournies à titre informatif : seule celle de votre ordonnance fait foi.",
                "Each treatment shown here is a prescription-only medicine. It is prepared and shipped only after your file has been reviewed by an approved doctor and a prescription issued. The dosages shown are for information only: only the dosage on your prescription is authoritative.",
              )}
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
              <DomaineSection domaine={d} />
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}

function DomaineSection({ domaine: d }: { domaine: Domaine }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">{d.tag}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-5">
            <h2 className="font-section text-3xl font-medium tracking-tight lg:text-4xl">
              {d.titre}
            </h2>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`domaine-info-${d.slug}`}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-all duration-300 hover:border-clay/50 hover:text-foreground"
            >
              {open ? t("Réduire", "Collapse") : t("En savoir plus", "Learn more")}
              <span
                aria-hidden
                className={`font-mono text-clay transition-transform duration-500 ease-[var(--ease)] ${open ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
          </div>
          <Floating3D
            domaine={d.slug}
            alt=""
            halo={false}
            delay={i3dDelay[d.slug] ?? 0}
            className="hidden w-24 md:block lg:w-32"
          />
        </div>
      </Reveal>

      <div
        id={`domaine-info-${d.slug}`}
        className={`grid transition-all duration-700 ease-[var(--ease)] ${
          open ? "mt-10 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <Reveal className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <img
                src={d.image}
                alt={t(`Spécialité MAAN ${d.titre} — ${d.tag}`, `MAAN specialty ${d.titre} — ${d.tag}`)}
                loading="lazy"
                width={1024}
                height={768}
                className="aspect-[4/3] w-full rounded-[20px] object-cover shadow-[0_40px_100px_-70px_var(--foreground)]"
              />
            </div>
            <div className="lg:col-span-7">
              <p className="max-w-[56ch] text-pretty text-muted">{d.chapo}</p>
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
        </div>
      </div>

      <ProduitCarousel produits={d.produits} label={d.titre} domaineSlug={d.slug} />
    </>
  );
}

function ProduitCarousel({
  produits,
  label,
  domaineSlug,
}: {
  produits: Produit[];
  label: string;
  domaineSlug: string;
}) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const center = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-10">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carrousel"
        aria-label={t(`Traitements — ${label}`, `Treatments — ${label}`)}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2"
      >
        {produits.map((p) => (
          <article
            key={p.id}
            className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-border bg-background transition-shadow duration-500 ease-[var(--ease)] hover:shadow-[0_30px_70px_-55px_var(--foreground)] sm:w-[62%] lg:w-[calc(50%-8px)]"
          >
            <div className="relative border-b border-border bg-cream">
              <ImageZoom
                src={p.image}
                alt={p.alt}
                caption={`${p.nom} — ${p.forme}`}
                imgClassName="aspect-[16/10]"
              />
              <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-clay/40 bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay backdrop-blur">
                {t("Ordonnance", "Prescription")}
              </span>
            </div>
            <div className="p-6 pb-0">
              <p className="font-display text-lg font-medium tracking-tight">{p.nom}</p>
              <p className="mt-1 text-sm text-muted">{p.molecule}</p>
            </div>
            <dl className="mt-5 space-y-3 border-t border-border p-6 pt-4 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {t("Forme", "Form")}
                </dt>
                <dd className="mt-1 text-pretty">{p.forme}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {t("Posologie indicative", "Indicative dosage")}
                </dt>
                <dd className="mt-1 text-pretty text-muted">{p.posologie}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {t("Précautions", "Precautions")}
                </dt>
                <dd className="mt-1 text-pretty text-muted">{p.precautions}</dd>
              </div>
            </dl>
            <div className="mt-auto border-t border-border p-6">
              <Link
                to="/soins/$domaine"
                params={{ domaine: domaineSlug }}
                search={{ produit: p.id }}
                aria-label={t(`Découvrir ${p.nom}`, `Discover ${p.nom}`)}
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90"
              >
                {t("Découvrir le produit", "Discover this product")}
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {produits.length > 1 && (
        <div
          className="mt-5 flex items-center justify-center gap-2.5"
          role="tablist"
          aria-label={t(`Parcourir les traitements — ${label}`, `Browse treatments — ${label}`)}
        >
          {produits.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={t(`Voir ${p.nom}`, `View ${p.nom}`)}
              onClick={() => goTo(i)}
              className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ease-[var(--ease)] ${
                active === i
                  ? "w-7 bg-clay"
                  : "w-2.5 bg-clay/25 hover:bg-clay/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
