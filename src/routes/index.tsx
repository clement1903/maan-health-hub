import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import heroBox from "@/assets/hero-box.jpg";
import soinSexual from "@/assets/soin-sexual.jpg";
import soinWeight from "@/assets/soin-weight.jpg";
import soinHair from "@/assets/soin-hair.jpg";
import soinSkin from "@/assets/soin-skin.jpg";

import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { CountUp } from "@/components/count-up";
import { SoinsShowcase, type Soin } from "@/components/soins-showcase";
import { ParcoursStepper, type Etape } from "@/components/parcours-stepper";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAAN — Des soins pensés pour les hommes" },
      {
        name: "description",
        content:
          "Simple et confidentiel. Consultez un médecin en ligne et recevez votre traitement à domicile lorsqu'il vous est prescrit. Sexual, Weight, Hair et Skin Management.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "MAAN — Des soins pensés pour les hommes" },
      {
        property: "og:description",
        content:
          "Consultation médicale en ligne : un médecin agréé évalue votre dossier et, si un traitement est prescrit, vous le recevez discrètement à domicile.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MAAN — Des soins pensés pour les hommes" },
      {
        name: "twitter:description",
        content:
          "Consultation médicale en ligne : un médecin évalue votre dossier et, si un traitement est prescrit, vous le recevez discrètement à domicile.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const soins: Soin[] = [
  {
    n: "01",
    tag: "Sexual",
    title: "Sexual Management",
    desc: "Dysfonction érectile, libido, andropause : un sujet traité sereinement, sans jugement.",
    price: "Dès 49 €",
    img: soinSexual,
    alt: "Flacons d'apothicaire en verre ambré posés dans une lumière chaude",
    points: [
      "Questionnaire discret évalué par un médecin",
      "Traitements sur ordonnance uniquement",
      "Renouvellement suivi et ajustable",
    ],
  },
  {
    n: "02",
    tag: "Weight",
    title: "Weight Management",
    desc: "Surpoids, métabolisme, habitudes : un accompagnement médical structuré dans la durée.",
    price: "Dès 59 €",
    img: soinWeight,
    alt: "Fruit mûr posé sur une pierre claire dans une lumière douce",
    points: [
      "Bilan métabolique et objectifs réalistes",
      "Suivi mensuel avec votre médecin",
      "Conseils nutrition inclus",
    ],
  },
  {
    n: "03",
    tag: "Hair",
    title: "Hair Management",
    desc: "Chute de cheveux, calvitie, cuir chevelu : agir tôt change tout.",
    price: "Dès 45 €",
    img: soinHair,
    alt: "Peigne en bois sur du sable chaud",
    points: [
      "Diagnostic à partir de photos du cuir chevelu",
      "Traitements oraux ou topiques prescrits",
      "Suivi photo tous les 3 mois",
    ],
  },
  {
    n: "04",
    tag: "Skin",
    title: "Skin Management",
    desc: "Acné, peau grasse, rides, taches : une routine validée médicalement.",
    price: "Dès 42 €",
    img: soinSkin,
    alt: "Pot en verre ambré de soin pour la peau dans une lumière de fin de journée",
    points: [
      "Analyse dermatologique personnalisée",
      "Formules préparées en pharmacie",
      "Ajustement selon votre tolérance",
    ],
  },
];

const etapes: Etape[] = [
  {
    n: "1",
    title: "Questionnaire",
    desc: "Un questionnaire médical rigoureux, en quelques minutes, à votre rythme.",
    detail:
      "Antécédents, traitements en cours, mode de vie : chaque réponse guide le médecin. Vous pouvez l'interrompre et le reprendre à tout moment.",
  },
  {
    n: "2",
    title: "Consultation médicale",
    desc: "Un médecin agréé analyse votre profil et délivre une ordonnance si elle est justifiée.",
    detail:
      "Réponse sous 24 h ouvrées. Le médecin peut demander des précisions, refuser un traitement ou vous orienter vers une consultation physique.",
  },
  {
    n: "3",
    title: "Livraison discrète",
    desc: "La pharmacie partenaire expédie votre traitement dans un emballage neutre.",
    detail:
      "Colis sans mention de contenu ni de marque, suivi en temps réel, livré chez vous ou en point relais sous 24 à 48 h.",
  },
];

const faq = [
  {
    q: "Comment se déroule la consultation ?",
    a: "Vous remplissez un questionnaire médical, puis un médecin l'analyse. S'il est indiqué, il délivre une ordonnance valide.",
  },
  {
    q: "Est-ce vraiment confidentiel ?",
    a: "Vos données de santé sont chiffrées et ne sont jamais partagées. La livraison arrive dans un colis neutre, sans mention.",
  },
  {
    q: "Peut-on recevoir l'ordonnance ?",
    a: "Oui, vous recevez une ordonnance officielle que vous pouvez aussi présenter à votre pharmacie habituelle.",
  },
  {
    q: "Le traitement est-il garanti ?",
    a: "Non. La prescription dépend de l'avis du médecin selon votre état de santé. Aucun médicament n'est délivré sans ordonnance.",
  },
];

const marqueeItems = [
  "Médecins agréés",
  "Ordonnance obligatoire",
  "Colis neutre",
  "Données chiffrées",
  "Pharmacie certifiée",
  "Suivi personnalisé",
];



function Home() {
  const scrollY = useScrollY();
  const condensed = scrollY > 40;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader />


      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -left-40 top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_28%,transparent),transparent_65%)] blur-2xl"
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
          />
          <div
            className="pointer-events-none absolute -right-32 top-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--clay)_20%,transparent),transparent_65%)] blur-2xl"
            style={{ transform: `translateY(${scrollY * -0.08}px)` }}
          />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-6">
              <p className="inline-flex animate-[rise_0.5s_var(--ease)_both] items-center gap-2 rounded-full border border-border bg-cream px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-clay">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full bg-clay" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
                </span>
                Simple et confidentiel
              </p>
              <h1 className="mt-6 animate-[rise_0.6s_var(--ease)_0.08s_both] text-balance font-display text-5xl font-medium leading-[1.03] tracking-tight lg:text-6xl">
                Consultez un médecin en ligne.{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Recevez votre traitement à domicile</span>
                  <span className="absolute inset-x-0 bottom-1 z-0 h-3 origin-left animate-[rise_0.8s_var(--ease)_0.5s_both] rounded-sm bg-amber/35" />
                </span>{" "}
                s'il vous est prescrit.
              </h1>
              <div className="mt-9 flex animate-[rise_0.6s_var(--ease)_0.24s_both] flex-wrap items-center gap-4">
                <a
                  href="#soins"
                  className="group inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep hover:shadow-[0_18px_40px_-18px_var(--clay)]"
                >
                  Commencer une consultation
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="#parcours"
                  className="font-medium text-foreground underline decoration-clay/40 decoration-2 underline-offset-[6px] transition-all hover:decoration-clay hover:underline-offset-8"
                >
                  Voir le parcours
                </a>
              </div>
              <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
                <div>
                  <CountUp
                    to={100}
                    suffix="%"
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Médecins agréés
                  </p>
                </div>
                <div>
                  <CountUp
                    to={24}
                    suffix="h"
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Réponse médicale
                  </p>
                </div>
                <div>
                  <CountUp
                    to={4}
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Domaines de soin
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-[rise_0.7s_var(--ease)_0.1s_both] lg:col-span-6">
              <div
                className="group relative"
                style={{ transform: `translateY(${Math.min(scrollY, 400) * -0.05}px)` }}
              >
                <img
                  src={heroBox}
                  alt="Boîte en papier kraft mat éclairée par une lumière ambrée"
                  width={1024}
                  height={1280}
                  className="aspect-[4/5] w-full rounded-[24px] object-cover shadow-[0_50px_120px_-60px_var(--foreground)] transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.015]"
                />
                <div className="absolute -bottom-6 -left-4 animate-[floaty_6s_ease-in-out_infinite] rounded-2xl border border-border bg-background/90 p-4 shadow-[0_24px_60px_-40px_var(--foreground)] backdrop-blur-md sm:-left-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Ordonnance délivrée
                  </p>
                  <p className="mt-1 font-display text-lg font-medium tracking-tight">
                    par un médecin agréé
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Marquee items={marqueeItems} />

        {/* SOINS */}
        <section id="soins" className="scroll-mt-24 bg-cream">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                  (a) — Nos soins
                </p>
                <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
                  Quatre domaines, un même soin.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <SoinsShowcase soins={soins} />
            </Reveal>
          </div>
        </section>

        {/* PARCOURS */}
        <section id="parcours" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              (b) — Le parcours
            </p>
            <h2 className="mt-3 max-w-[24ch] text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Trois étapes, sans déplacement.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <ParcoursStepper etapes={etapes} />
          </Reveal>
        </section>

        {/* CONFIANCE */}
        <section id="confiance" className="scroll-mt-24 border-y border-border bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                  (c) — Confiance
                </p>
                <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
                  La rigueur d'une vraie consultation.
                </h2>
                <p className="mt-4 max-w-[40ch] text-pretty text-muted">
                  De vrais médecins, des données de santé protégées, une pharmacie agréée. Rien
                  n'est vendu sans prescription.
                </p>
              </Reveal>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
                {[
                  {
                    k: "100%",
                    t: "Médecins agréés",
                    d: "Inscrits à l'Ordre, formés à la consultation à distance.",
                  },
                  {
                    k: "RGPD",
                    t: "Données de santé",
                    d: "Chiffrées, hébergées en Europe, jamais revendues.",
                  },
                  {
                    k: "24–48h",
                    t: "Livraison partenaire",
                    d: "Expédition discrète depuis une pharmacie certifiée.",
                  },
                ].map((c, i) => (
                  <Reveal
                    key={c.k}
                    delay={i * 90}
                    className="group rounded-[16px] border border-border bg-background/60 p-6 transition-all duration-500 ease-[var(--ease)] hover:-translate-y-1 hover:bg-background hover:shadow-[0_24px_60px_-40px_var(--foreground)]"
                  >
                    <p className="font-display text-3xl font-medium tracking-tight text-clay">
                      {c.k}
                    </p>
                    <p className="mt-2 text-sm font-medium">{c.t}</p>
                    <p className="mt-1 text-pretty text-sm text-muted">{c.d}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              (d) — Questions
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Avant de commencer
            </h2>
          </Reveal>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-lg font-medium tracking-tight transition-colors hover:text-clay"
                  >
                    <span>{f.q}</span>
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border font-mono text-clay transition-all duration-500 ease-[var(--ease)]",
                        open && "rotate-45 border-clay bg-clay text-cream",
                      )}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-[var(--ease)]",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="max-w-[60ch] overflow-hidden text-pretty text-sm text-muted">
                      <span className="block pb-6">{f.a}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="relative scroll-mt-24 overflow-hidden bg-clay text-cream">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_45%,transparent),transparent_65%)] blur-2xl" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-24">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/70">
                Prêt quand vous l'êtes
              </p>
              <h2 className="mt-3 max-w-[22ch] text-balance font-display text-4xl font-medium tracking-tight lg:text-5xl">
                Commencer votre consultation aujourd'hui.
              </h2>
            </div>
            <a
              href="#soins"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-7 py-4 text-sm font-medium text-foreground transition-all duration-300 hover:gap-3 hover:bg-sand"
            >
              Démarrer en 3 minutes
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />

    </div>
  );
}
