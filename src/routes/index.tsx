import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDossiersAccompagnes } from "@/lib/stats.functions";

import heroPoster from "@/assets/hero-poster.jpg";
import heroVideo from "@/assets/hero-parcours.mp4.asset.json";
import soinSexual from "@/assets/soin-sexual.jpg";
import soinWeight from "@/assets/soin-weight.jpg";
import soinHair from "@/assets/soin-hair.jpg";
import soinSkin from "@/assets/soin-skin.jpg";
import etapeQuestionnaire from "@/assets/etape-questionnaire.jpg";
import etapeConsultation from "@/assets/etape-consultation.jpg";
import etapeLivraison from "@/assets/etape-livraison.jpg";
import etapeSuivi from "@/assets/etape-suivi.jpg";

import { Reveal } from "@/components/reveal";
import { Magnetic, Tilt } from "@/components/magnetic";
import { Marquee } from "@/components/marquee";
import { CountUp } from "@/components/count-up";
import { SoinsShowcase, type Soin } from "@/components/soins-showcase";
import { ParcoursStepper, type Etape } from "@/components/parcours-stepper";
import { MedecinsSection } from "@/components/medecins-section";
import { Temoignages } from "@/components/temoignages";
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
    img: soinSexual,
    alt: "Homme détendu au réveil dans une lumière dorée, serein et confiant",
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
    img: soinWeight,
    alt: "Homme qui lace ses chaussures de course au lever du soleil",
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
    img: soinHair,
    alt: "Homme vérifiant sa ligne de cheveux devant un miroir en lumière chaude",
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
    img: soinSkin,
    alt: "Homme appliquant une crème de soin sur le visage devant un miroir",
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
    img: etapeQuestionnaire,
    alt: "Homme remplissant le questionnaire médical MAAN sur son téléphone",
  },
  {
    n: "2",
    title: "Consultation médicale",
    desc: "Un médecin agréé analyse votre profil et délivre une ordonnance si elle est justifiée.",
    detail:
      "Réponse sous 24 h ouvrées. Le médecin peut demander des précisions, refuser un traitement ou vous orienter vers une consultation physique.",
    img: etapeConsultation,
    alt: "Médecin agréé analysant un dossier patient sur son ordinateur",
  },
  {
    n: "3",
    title: "Livraison discrète",
    desc: "La pharmacie partenaire expédie votre traitement dans un emballage neutre.",
    detail:
      "Colis sans mention de contenu ni de marque, suivi en temps réel, livré chez vous ou en point relais sous 24 à 48 h.",
    img: etapeLivraison,
    alt: "Colis neutre sans mention remis devant la porte d'un domicile",
  },
  {
    n: "4",
    title: "Suivi",
    desc: "Le médecin reste joignable pour ajuster, renouveler ou arrêter votre traitement.",
    detail:
      "Point de suivi après une semaine, signalement des effets indésirables depuis votre espace patient et décisions médicales tracées dans votre dossier.",
    img: etapeSuivi,
    alt: "Homme détendu consultant son message de suivi médical sur son téléphone",
  },
];


const faq = [
  {
    q: "Comment se déroule la consultation ?",
    a: "Vous remplissez un questionnaire médical, puis un médecin agréé l'analyse. S'il l'estime justifié, il délivre une ordonnance ; sinon il demande des précisions, refuse la demande ou vous oriente vers une consultation physique.",
  },
  {
    q: "Puis-je acheter un médicament sans ordonnance ?",
    a: "Non. MAAN ne vend aucun médicament en libre accès. Un traitement soumis à prescription ne peut être préparé et expédié qu'après la délivrance d'une ordonnance par un médecin.",
  },
  {
    q: "Que se passe-t-il si le médecin refuse de prescrire ?",
    a: "Vous recevez un motif écrit dans votre espace patient et des orientations adaptées. La consultation est gratuite et sans engagement : un refus est un acte médical, pas un échec de commande.",
  },
  {
    q: "L'ordonnance m'appartient-elle ?",
    a: "Oui. Vous recevez une ordonnance officielle, téléchargeable depuis votre espace patient, que vous pouvez présenter à votre pharmacie habituelle plutôt qu'à notre pharmacie partenaire.",
  },
  {
    q: "Qui peut lire mes réponses de santé ?",
    a: "Uniquement le médecin en charge de votre dossier et, pour la préparation, le pharmacien concerné. Vos réponses sont couvertes par le secret médical.",
  },
  {
    q: "Comment mes données personnelles sont-elles traitées ?",
    a: "Les données de santé sont chiffrées et hébergées en Europe chez un hébergeur conforme au RGPD. Elles ne sont ni revendues, ni utilisées à des fins publicitaires. Vous pouvez demander leur export ou leur suppression à tout moment depuis votre espace patient.",
  },
  {
    q: "La livraison est-elle vraiment discrète ?",
    a: "Le colis est neutre : aucune mention du contenu, de la spécialité ni de la marque. Vous choisissez la livraison à domicile ou en point relais.",
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
  const { data: dossiersAccompagnes = 15000 } = useQuery({
    queryKey: ["dossiers-accompagnes"],
    queryFn: () => getDossiersAccompagnes(),
    staleTime: 60_000,
  });
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
              <h1 className="animate-[rise_0.6s_var(--ease)_0.08s_both] text-balance font-display text-5xl font-medium leading-[1.03] tracking-tight lg:text-6xl">
                Consultez un médecin en ligne.{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Recevez votre traitement à domicile.</span>
                  <span className="absolute inset-x-0 bottom-1 z-0 h-3 origin-left animate-[rise_0.8s_var(--ease)_0.5s_both] rounded-sm bg-amber/35" />
                </span>
              </h1>
              <div className="mt-9 flex animate-[rise_0.6s_var(--ease)_0.24s_both] flex-wrap items-center gap-4">
                <Magnetic>
                  <Link
                    to="/questionnaire"
                    className="group inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep hover:shadow-[0_18px_40px_-18px_var(--clay)]"
                  >
                    Commencer une consultation
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </Magnetic>
                <a
                  href="#parcours"
                  className="font-medium text-foreground underline decoration-clay/40 decoration-2 underline-offset-[6px] transition-all hover:decoration-clay hover:underline-offset-8"
                >
                  Voir le parcours
                </a>
              </div>
              <div className="mt-6 grid animate-[rise_0.6s_var(--ease)_0.32s_both] grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="group flex items-center gap-3 rounded-2xl border border-border bg-cream/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-clay shadow-sm ring-1 ring-border transition-all duration-300 group-hover:bg-sand">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[13px] font-semibold leading-tight text-foreground">Consultation 100% gratuite</span>
                    <span className="text-[11px] text-muted">et sans engagement</span>
                  </div>
                </div>

                <div className="group flex items-center gap-3 rounded-2xl border border-border bg-cream/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-clay shadow-sm ring-1 ring-border transition-all duration-300 group-hover:bg-sand">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.85.85 2.23.85 3.08 0L15 8" />
                    </svg>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[13px] font-semibold leading-tight text-foreground">Traitement et suivi médical</span>
                    <span className="text-[11px] text-muted">personnalisés</span>
                  </div>
                </div>

                <div className="group flex items-center gap-3 rounded-2xl border border-border bg-cream/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-clay shadow-sm ring-1 ring-border transition-all duration-300 group-hover:bg-sand">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 17h4V5H2v12h3" />
                      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
                      <circle cx="7.5" cy="17.5" r="2.5" />
                      <circle cx="17.5" cy="17.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[13px] font-semibold leading-tight text-foreground">Livraison</span>
                    <span className="text-[11px] text-muted">discrète</span>
                  </div>
                </div>

                <div className="group flex items-center gap-3 rounded-2xl border border-border bg-cream/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-clay shadow-sm ring-1 ring-border transition-all duration-300 group-hover:bg-sand">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[13px] font-semibold leading-tight text-foreground">Données chiffrées</span>
                    <span className="text-[11px] text-muted">et confidentielles</span>
                  </div>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6">
                <div className="text-center">
                  <CountUp
                    to={dossiersAccompagnes}
                    suffix="+"
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Dossiers accompagnés
                  </p>
                </div>
                <div className="text-center">
                  <CountUp
                    to={24}
                    suffix="h"
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Réponse médicale
                  </p>
                </div>
                <div className="text-center">
                  <CountUp
                    to={4}
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Spécialités
                  </p>
                </div>
              </div>
            </div>

            <div
              className="animate-[rise_0.7s_var(--ease)_0.1s_both] lg:col-span-6"
              style={{ transform: `translateY(${Math.min(scrollY, 400) * -0.05}px)` }}
            >
              <Tilt className="group relative">
                <video
                  src={heroVideo.url}
                  poster={heroPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Un homme préoccupé trouve une solution avec MAAN : questionnaire, évaluation médicale, préparation en pharmacie et livraison discrète à domicile"
                  className="aspect-[4/5] w-full rounded-[24px] object-cover shadow-[0_50px_120px_-60px_var(--foreground)] transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.015]"
                />
              </Tilt>
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
                  Nos soins
                </p>
                <h2 className="mt-3 text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
                  Choisissez la spécialité qui vous concerne.
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
              Le parcours
            </p>
            <h2 className="mt-3 max-w-[24ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
              Quatre étapes, sans déplacement.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <ParcoursStepper etapes={etapes} />
          </Reveal>
        </section>

        <MedecinsSection />

        <Temoignages />

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Questions
            </p>
            <h2 className="mt-3 font-section text-3xl font-medium tracking-tight lg:text-4xl">
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
              <h2 className="mt-3 max-w-[22ch] text-balance font-section text-4xl font-medium tracking-tight lg:text-5xl">
                Commencer votre consultation aujourd'hui.
              </h2>
            </div>
            <Link
              to="/questionnaire"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-7 py-4 text-sm font-medium text-foreground transition-all duration-300 hover:gap-3 hover:bg-sand"
            >
              Démarrer en 3 minutes
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

    </div>
  );
}
