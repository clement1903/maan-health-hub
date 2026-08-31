import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ParcoursProgress, etapesDetaillees } from "@/components/parcours-progress";
import { ParcoursVideo } from "@/components/parcours-video";
import consultationImg from "@/assets/parcours-consultation.jpg";
import explicationVideo from "@/assets/parcours-explication.mp4.asset.json";

export const Route = createFileRoute("/parcours")({
  head: () => ({
    meta: [
      { title: "Parcours d'accès aux traitements — MAAN" },
      {
        name: "description",
        content:
          "Questionnaire médical, validation de la prescription par un médecin agréé, préparation en pharmacie et livraison discrète à domicile : le parcours MAAN étape par étape.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Parcours d'accès aux traitements — MAAN" },
      {
        property: "og:description",
        content:
          "Trois étapes claires : questionnaire, validation de prescription, livraison à domicile.",
      },
      { property: "og:url", content: "/parcours" },
      { name: "twitter:title", content: "Parcours d'accès aux traitements — MAAN" },
      {
        name: "twitter:description",
        content:
          "Questionnaire, validation de prescription et livraison : le parcours MAAN étape par étape.",
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
            { "@type": "HowToStep", name: "Questionnaire médical", text: "Vous répondez à un questionnaire médical détaillé sur votre situation, vos antécédents et vos traitements en cours." },
            { "@type": "HowToStep", name: "Validation de la prescription", text: "Un médecin agréé évalue votre dossier et délivre une ordonnance si un traitement est justifié." },
            { "@type": "HowToStep", name: "Préparation et livraison", text: "La pharmacie partenaire prépare votre traitement et l'expédie dans un colis neutre." },
          ],
        }),
      },
    ],
  }),
  component: ParcoursPage,
});



function ParcoursPage() {
  const [chapitre, setChapitre] = useState(0);
  const [scrollSignal, setScrollSignal] = useState(0);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                Parcours d'accès aux traitements
              </p>
              <h1 className="mt-4 max-w-[22ch] text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
                Questionnaire, prescription, livraison.
              </h1>
              <p className="mt-6 max-w-[46ch] text-pretty text-lg text-muted">
                Chaque demande est évaluée par un médecin agréé. Rien n'est vendu librement.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {["5 étapes", "Réponse sous 24 h", "Colis neutre"].map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border bg-cream px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-clay"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-5">
              <ParcoursVideo
                src={explicationVideo.url}
                poster={consultationImg}
                onChapterChange={setChapitre}
                onChapterSelect={(i) => {
                  setChapitre(i);
                  setScrollSignal((s) => s + 1);
                }}
              />
            </Reveal>
          </div>
          <ParcoursProgress
            etapes={etapesDetaillees}
            activeIndex={chapitre}
            scrollSignal={scrollSignal}
          />
        </section>



        <section className="bg-clay text-cream">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
            <h2 className="max-w-[24ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
              Commencez votre questionnaire depuis votre espace patient.
            </h2>
            <Link
              to="/espace-patient"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-7 py-4 text-sm font-medium text-foreground transition-all duration-300 hover:gap-3 hover:bg-sand"
            >
              Ouvrir mon espace patient
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
