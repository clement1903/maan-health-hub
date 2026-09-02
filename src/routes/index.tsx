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

import { Reveal } from "@/components/reveal";
import { Magnetic, Tilt } from "@/components/magnetic";
import { Marquee } from "@/components/marquee";
import { CountUp } from "@/components/count-up";
import type { Soin } from "@/components/soins-showcase";
import { Bento3D } from "@/components/bento-3d";


import { ParcoursMorph } from "@/components/parcours-morph";
import { MedecinsSection } from "@/components/medecins-section";
import { Temoignages } from "@/components/temoignages";
import { MotFondateur } from "@/components/mot-fondateur";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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
          "Simple et confidentiel. Consultez un médecin en ligne et recevez votre traitement à domicile lorsqu'il vous est prescrit.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MAAN — Des soins pensés pour les hommes" },
      {
        name: "twitter:description",
        content:
          "Simple et confidentiel. Consultez un médecin en ligne et recevez votre traitement à domicile lorsqu'il vous est prescrit.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

type T = (fr: string, en: string) => string;

const buildSoins = (t: T): Soin[] => [
  {
    n: "01",
    tag: t("Santé sexuelle", "Sexual health"),
    title: t("Santé sexuelle", "Sexual health"),
    desc: t(
      "Une baisse de désir, des pannes d'érection ou une éjaculation précoce arrivent à la plupart des hommes au moins une fois dans leur vie. Vous n'êtes pas seul, et ce n'est pas une fatalité : on en parle, sans gêne.",
      "Low desire, erection problems or premature ejaculation happen to most men at least once in their life. You are not alone, and it is not permanent: let's talk about it, without embarrassment.",
    ),
    img: soinSexual,
    alt: t(
      "Homme détendu au réveil dans une lumière dorée, serein et confiant",
      "Relaxed man waking up in golden light, calm and confident",
    ),
    points: [
      t("1 homme sur 3 concerné après 40 ans", "1 in 3 men affected after the age of 40"),
      t("Un médecin vous écoute, sans jugement", "A doctor listens, without judgement"),
      t("Des solutions efficaces existent dès aujourd'hui", "Effective solutions exist today"),
    ],
    slug: "sexuel",
  },
  {
    n: "02",
    tag: t("Poids", "Weight"),
    title: t("Poids", "Weight"),
    desc: t(
      "Vous avez déjà essayé les régimes, sans résultat durable ? Ce n'est pas une question de volonté. Le poids est aussi une affaire de métabolisme, et un médecin peut vraiment vous aider.",
      "Tried diets without lasting results? It is not about willpower. Weight is also a matter of metabolism, and a doctor can genuinely help.",
    ),
    img: soinWeight,
    alt: t(
      "Homme qui lace ses chaussures de course au lever du soleil",
      "Man lacing his running shoes at sunrise",
    ),
    points: [
      t("Des objectifs réalistes, à votre rythme", "Realistic goals, at your own pace"),
      t("Un médecin qui vous suit chaque mois", "A doctor following you every month"),
      t(
        "Des solutions médicales si les régimes ont échoué",
        "Medical options when diets have failed",
      ),
    ],
    slug: "poids",
  },
  {
    n: "03",
    tag: t("Cheveux", "Hair"),
    title: t("Cheveux", "Hair"),
    desc: t(
      "Une raie qui s'élargit, des tempes qui se dégarnissent… Vous l'avez remarqué et ça vous trotte dans la tête. Plus on agit tôt, plus on garde ses cheveux : c'est le bon moment.",
      "A widening parting, receding temples… You have noticed it and it stays on your mind. The earlier you act, the more hair you keep: now is the right time.",
    ),
    img: soinHair,
    alt: t(
      "Homme vérifiant sa ligne de cheveux devant un miroir en lumière chaude",
      "Man checking his hairline in a mirror in warm light",
    ),
    points: [
      t("9 hommes sur 10 touchés au cours de leur vie", "9 in 10 men affected during their life"),
      t("Agir tôt permet de préserver vos cheveux", "Acting early helps preserve your hair"),
      t("Diagnostic simple à partir de photos", "Simple assessment based on photos"),
    ],
    slug: "cheveux",
  },
  {
    n: "04",
    tag: t("Peau", "Skin"),
    title: t("Peau", "Skin"),
    desc: t(
      "Boutons qui persistent, peau qui tire, premières rides… Votre peau influence votre confiance au quotidien. Une routine médicalement validée peut tout changer, simplement.",
      "Persistent breakouts, tight skin, first wrinkles… Your skin shapes your daily confidence. A medically reviewed routine can change everything, simply.",
    ),
    img: soinSkin,
    alt: t(
      "Homme appliquant une crème de soin sur le visage devant un miroir",
      "Man applying a skincare cream in front of a mirror",
    ),
    points: [
      t("Une routine adaptée à VOTRE peau", "A routine tailored to YOUR skin"),
      t("Des formules préparées en pharmacie", "Formulas prepared by a pharmacy"),
      t("Des résultats visibles, un suivi régulier", "Visible results, regular follow-up"),
    ],
    slug: "peau",
  },
];

const buildFaq = (t: T) => [
  {
    q: t("Comment se déroule la consultation médicale en ligne ?", "How does the online medical consultation work?"),
    a: t(
      "Vous remplissez un questionnaire médical en ligne, puis un médecin agréé l'analyse à distance. S'il l'estime justifié, il délivre une ordonnance ; sinon il demande des précisions, refuse la demande ou vous oriente vers une consultation médicale en présentiel.",
      "You complete a medical questionnaire online, then a licensed doctor reviews it remotely. If justified, they issue a prescription; otherwise they ask for details, decline the request or refer you to an in-person medical consultation.",
    ),
  },
  {
    q: t(
      "Puis-je acheter un médicament sans ordonnance ?",
      "Can I buy medication without a prescription?",
    ),
    a: t(
      "Non. MAAN ne vend aucun médicament en libre accès. Un traitement soumis à prescription ne peut être préparé et expédié qu'après la délivrance d'une ordonnance par un médecin.",
      "No. MAAN does not sell any medication over the counter. A prescription-only treatment can be prepared and shipped only after a doctor has issued a prescription.",
    ),
  },
  {
    q: t(
      "Que se passe-t-il si le médecin refuse de prescrire ?",
      "What happens if the doctor declines to prescribe?",
    ),
    a: t(
      "Vous recevez un motif écrit dans votre espace patient et des orientations adaptées. La consultation médicale est à 1 € : un refus est un acte médical, pas un échec de commande.",
      "You receive a written reason in your patient area along with suitable guidance. The medical consultation is 1 €: a refusal is a medical decision, not a failed order.",
    ),
  },
  {
    q: t("Qui peut lire mes réponses de santé ?", "Who can read my health answers?"),
    a: t(
      "Uniquement le médecin en charge de votre dossier et, pour la préparation, le pharmacien concerné. Vos réponses sont couvertes par le secret médical.",
      "Only the doctor handling your file and, for preparation, the pharmacist involved. Your answers are covered by medical confidentiality.",
    ),
  },
  {
    q: t(
      "Comment mes données personnelles sont-elles traitées ?",
      "How is my personal data handled?",
    ),
    a: t(
      "Les données de santé sont chiffrées et hébergées en Europe chez un hébergeur conforme au RGPD. Elles ne sont ni revendues, ni utilisées à des fins publicitaires. Vous pouvez demander leur export ou leur suppression à tout moment depuis votre espace patient.",
      "Health data is encrypted and hosted in Europe with a GDPR-compliant provider. It is never sold or used for advertising. You can request an export or deletion at any time from your patient area.",
    ),
  },
  {
    q: t("La livraison est-elle vraiment discrète ?", "Is delivery really discreet?"),
    a: t(
      "Le colis est neutre : aucune mention du contenu, de la spécialité ni de la marque. Vous choisissez la livraison à domicile ou en point relais.",
      "The parcel is neutral: no mention of the contents, the specialty or the brand. You choose home delivery or a pickup point.",
    ),
  },
];

const buildMarquee = (t: T) => [
  t("Médecins agréés", "Licensed doctors"),
  t("Ordonnance obligatoire", "Prescription required"),
  t("Colis neutre", "Neutral parcel"),
  t("Données chiffrées", "Encrypted data"),
  t("Pharmacie certifiée", "Certified pharmacy"),
  t("Suivi personnalisé", "Personalised follow-up"),
];



function Home() {
  const scrollY = useScrollY();
  const { data: dossiersAccompagnes = 15000 } = useQuery({
    queryKey: ["dossiers-accompagnes"],
    queryFn: () => getDossiersAccompagnes(),
    staleTime: 60_000,
  });
  const condensed = scrollY > 40;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useI18n();
  const soins = buildSoins(t);
  const faq = buildFaq(t);
  const marqueeItems = buildMarquee(t);

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
                {t("Consultez un médecin en ligne.", "Consult a doctor online.")}{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">{t("Recevez votre traitement à domicile.", "Get your treatment delivered at home.")}</span>
                  <span className="absolute inset-x-0 bottom-1 z-0 h-3 origin-left animate-[rise_0.8s_var(--ease)_0.5s_both] rounded-sm bg-amber/35" />
                </span>
              </h1>
              <div className="mt-9 flex animate-[rise_0.6s_var(--ease)_0.24s_both] flex-wrap items-center gap-4">
                <Magnetic>
                  <Link
                    to="/questionnaire"
                    className="group inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep hover:shadow-[0_18px_40px_-18px_var(--clay)]"
                  >
                    {t("Commencer une consultation médicale", "Start a medical consultation")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </Magnetic>
                <a
                  href="#parcours"
                  className="font-medium text-foreground underline decoration-clay/40 decoration-2 underline-offset-[6px] transition-all hover:decoration-clay hover:underline-offset-8"
                >
                  {t("Voir le parcours", "See how it works")}
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
                  <span className="text-[13px] font-semibold leading-tight text-foreground">{t("Consultation médicale à 1 €", "Medical consultation for 1 €")}</span>
                    <span className="text-[11px] text-muted">{t("Paiement après prescription", "Payment after prescription")}</span>
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
                    <span className="text-[13px] font-semibold leading-tight text-foreground">{t("Traitement et suivi médical", "Treatment and medical follow-up")}</span>
                    <span className="text-[11px] text-muted">{t("personnalisés", "personalised")}</span>
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
                    <span className="text-[13px] font-semibold leading-tight text-foreground">{t("Livraison", "Delivery")}</span>
                    <span className="text-[11px] text-muted">{t("discrète", "discreet")}</span>
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
                    <span className="text-[13px] font-semibold leading-tight text-foreground">{t("Données chiffrées", "Encrypted data")}</span>
                    <span className="text-[11px] text-muted">{t("et confidentielles", "and confidential")}</span>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-y-6 sm:flex-nowrap sm:gap-0">
                <div className="w-1/2 px-5 text-center sm:w-auto sm:min-w-[150px]">
                  <CountUp
                    to={dossiersAccompagnes}
                    suffix="+"
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {t("hommes ont choisi MAAN", "men have chosen MAAN")}
                  </p>
                </div>
                <span className="hidden h-10 w-[2px] shrink-0 bg-clay/50 sm:block" aria-hidden="true" />
                <div className="w-1/2 px-5 text-center sm:w-auto sm:min-w-[150px]">
                  <CountUp
                    to={24}
                    suffix="h"
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {t("Réponse médicale", "Medical answer")}
                  </p>
                </div>
                <span className="hidden h-10 w-[2px] shrink-0 bg-clay/50 sm:block" aria-hidden="true" />
                <div className="w-1/2 px-5 text-center sm:w-auto sm:min-w-[150px]">
                  <CountUp
                    to={4}
                    className="font-display text-2xl font-medium tracking-tight text-clay"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {t("Spécialités", "Specialties")}
                  </p>
                </div>
                <span className="hidden h-10 w-[2px] shrink-0 bg-clay/50 sm:block" aria-hidden="true" />
                <div className="w-1/2 px-5 text-center sm:w-auto sm:min-w-[150px]">
                  <p className="font-display text-2xl font-medium tracking-tight text-clay">BIG</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {t("Médecins certifiés", "Certified doctors")}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="animate-[rise_0.7s_var(--ease)_0.1s_both] lg:col-span-6"
              style={{ transform: `translateY(${Math.min(scrollY, 400) * -0.05}px)` }}
            >
              <div className="relative">
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
          </div>
        </section>

        <Marquee items={marqueeItems} />

        {/* SOINS */}
        <section id="soins" className="scroll-mt-24 bg-cream">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                  {t("Nos soins", "Our treatments")}
                </p>
                <h2 className="mt-3 text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
                  {t("Qu'est-ce qui vous préoccupe ?", "What is concerning you?")}
                </h2>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="mt-10">
                <Bento3D soins={soins} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* PARCOURS — métamorphose 3D pilotée par le scroll */}
        <ParcoursMorph />

        <MedecinsSection />

        <MotFondateur />

        <Temoignages />


        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-16 lg:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              {t("Questions", "Questions")}
            </p>
            <h2 className="mt-3 font-section text-3xl font-medium tracking-tight lg:text-4xl">
              {t("Avant de commencer", "Before you start")}
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
                {t("Prêt quand vous l'êtes", "Ready when you are")}
              </p>
              <h2 className="mt-3 max-w-[22ch] text-balance font-section text-4xl font-medium tracking-tight lg:text-5xl">
                {t("Commencer votre consultation médicale aujourd'hui.", "Start your medical consultation today.")}
              </h2>
            </div>
            <Link
              to="/questionnaire"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-7 py-4 text-sm font-medium text-foreground transition-all duration-300 hover:gap-3 hover:bg-sand"
            >
              {t("Démarrer en 3 minutes", "Start in 3 minutes")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

    </div>
  );
}
