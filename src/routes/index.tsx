import { createFileRoute } from "@tanstack/react-router";

import heroBox from "@/assets/hero-box.jpg";
import soinSexual from "@/assets/soin-sexual.jpg";
import soinWeight from "@/assets/soin-weight.jpg";
import soinHair from "@/assets/soin-hair.jpg";
import soinSkin from "@/assets/soin-skin.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAAN — Télémédecine masculine, traitement livré à domicile" },
      {
        name: "description",
        content:
          "Simple et confidentiel. Consultez un médecin en ligne et recevez votre traitement à domicile lorsqu'il vous est prescrit. Sexual, Weight, Hair et Skin Management.",
      },
      { property: "og:title", content: "MAAN — Des soins pensés pour les hommes" },
      {
        property: "og:description",
        content:
          "Consultation médicale en ligne, ordonnance délivrée par un médecin agréé et livraison discrète à domicile.",
      },
      { name: "twitter:title", content: "MAAN — Des soins pensés pour les hommes" },
      {
        name: "twitter:description",
        content:
          "Consultation médicale en ligne, ordonnance et livraison discrète à domicile.",
      },
    ],
  }),
  component: Home,
});

const soins = [
  {
    n: "01",
    tag: "Sexual",
    title: "Sexual Management",
    desc: "Dysfonction érectile, libido, andropause.",
    price: "Dès 49 €",
    img: soinSexual,
    alt: "Flacons d'apothicaire en verre ambré posés dans une lumière chaude",
  },
  {
    n: "02",
    tag: "Weight",
    title: "Weight Management",
    desc: "Surpoids, prise de poids, métabolisme.",
    price: "Dès 59 €",
    img: soinWeight,
    alt: "Fruit mûr posé sur une pierre claire dans une lumière douce",
  },
  {
    n: "03",
    tag: "Hair",
    title: "Hair Management",
    desc: "Chute de cheveux, calvitie, cuir chevelu.",
    price: "Dès 45 €",
    img: soinHair,
    alt: "Peigne en bois sur du sable chaud",
  },
  {
    n: "04",
    tag: "Skin",
    title: "Skin Management",
    desc: "Acné, peau grasse, rides, taches.",
    price: "Dès 42 €",
    img: soinSkin,
    alt: "Pot en verre ambré de soin pour la peau dans une lumière de fin de journée",
  },
];

const etapes = [
  {
    n: "1",
    title: "Questionnaire",
    desc: "Un questionnaire médical rigoureux et personnalisé, en quelques minutes, à votre rythme.",
  },
  {
    n: "2",
    title: "Consultation médicale",
    desc: "Un médecin agréé analyse votre profil et délivre une ordonnance si un traitement est justifié.",
  },
  {
    n: "3",
    title: "Livraison discrète",
    desc: "Votre pharmacie partenaire expédie votre traitement dans un emballage neutre, chez vous.",
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

function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl font-semibold tracking-tight">MAAN</span>
            <span className="hidden text-sm text-muted sm:block">
              Des soins pensés pour les hommes
            </span>
          </div>
          <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.15em] text-muted lg:flex">
            <a href="#soins" className="transition-colors hover:text-foreground">
              Soins
            </a>
            <a href="#parcours" className="transition-colors hover:text-foreground">
              Parcours
            </a>
            <a href="#confiance" className="transition-colors hover:text-foreground">
              Confiance
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <a
            href="#cta"
            className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
          >
            Démarrer
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="animate-[rise_0.5s_var(--ease)_both] font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Simple et confidentiel
            </p>
            <h1 className="mt-6 animate-[rise_0.6s_var(--ease)_0.08s_both] text-balance font-display text-5xl font-medium leading-[1.03] tracking-tight lg:text-6xl">
              Consultez un médecin, recevez votre traitement à domicile.
            </h1>
            <p className="mt-6 max-w-[46ch] animate-[rise_0.6s_var(--ease)_0.16s_both] text-pretty text-lg text-muted">
              Un parcours médical complet — questionnaire, consultation et ordonnance — pensé pour
              les hommes, livré discrètement.
            </p>
            <div className="mt-9 flex animate-[rise_0.6s_var(--ease)_0.24s_both] flex-wrap items-center gap-4">
              <a
                href="#cta"
                className="rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
              >
                Commencer une consultation
              </a>
              <a
                href="#parcours"
                className="font-medium text-foreground underline decoration-clay/50 decoration-2 underline-offset-4 transition-colors hover:decoration-clay"
              >
                Voir le parcours
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <span>Médecins agréés</span>
              <span>Confidentialité totale</span>
              <span>Pharmacie partenaire</span>
            </div>
          </div>
          <div className="animate-[rise_0.7s_var(--ease)_0.1s_both] lg:col-span-6">
            <img
              src={heroBox}
              alt="Boîte en papier kraft mat éclairée par une lumière ambrée"
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full rounded-[20px] object-cover"
            />
          </div>
        </section>

        <section id="soins" className="border-y border-border bg-cream">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                  (a) — Nos soins
                </p>
                <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
                  Quatre domaines, un même soin.
                </h2>
              </div>
              <p className="max-w-[34ch] text-pretty text-sm text-muted">
                Chaque parcours mène à une ordonnance délivrée par un médecin, jamais à une vente
                directe de médicament.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {soins.map((s) => (
                <article
                  key={s.n}
                  className="group rounded-[16px] border border-border bg-background p-7 transition-colors duration-300 hover:border-clay/40 hover:bg-sand/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] tracking-[0.15em] text-muted">{s.n}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-clay">
                      {s.tag}
                    </span>
                  </div>
                  <img
                    src={s.img}
                    alt={s.alt}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="mt-5 aspect-[4/3] w-full rounded-[10px] object-cover"
                  />
                  <h3 className="mt-5 font-display text-2xl font-medium tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-pretty text-sm text-muted">{s.desc}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      {s.price}
                    </span>
                    <a
                      href="#cta"
                      className="text-sm font-medium text-clay transition-transform duration-300 group-hover:translate-x-1"
                    >
                      Consulter →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="parcours" className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            (b) — Le parcours
          </p>
          <h2 className="mt-3 max-w-[24ch] text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
            Trois étapes, sans déplacement.
          </h2>
          <div className="mt-10 space-y-4">
            {etapes.map((e) => (
              <div
                key={e.n}
                className="flex gap-6 rounded-2xl border border-border p-6 lg:gap-10 lg:p-8"
              >
                <span className="font-display text-4xl font-medium text-clay/50">{e.n}</span>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight">{e.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-pretty text-sm text-muted">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="confiance" className="border-y border-border bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
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
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-7">
                <div>
                  <p className="font-display text-3xl font-medium tracking-tight text-clay">100%</p>
                  <p className="mt-2 text-sm font-medium">Médecins agréés</p>
                  <p className="mt-1 text-pretty text-sm text-muted">
                    Inscrits à l'Ordre, formés à la télémédecine.
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl font-medium tracking-tight text-clay">RGPD</p>
                  <p className="mt-2 text-sm font-medium">Données de santé</p>
                  <p className="mt-1 text-pretty text-sm text-muted">
                    Chiffrées, hébergées en Europe, jamais revendues.
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl font-medium tracking-tight text-clay">
                    24–48h
                  </p>
                  <p className="mt-2 text-sm font-medium">Livraison partenaire</p>
                  <p className="mt-1 text-pretty text-sm text-muted">
                    Expédition discrète depuis une pharmacie certifiée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            (d) — Questions
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
            Avant de commencer
          </h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {faq.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-medium tracking-tight">
                  <span>{f.q}</span>
                  <span className="font-mono text-clay transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-6 text-pretty text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="cta" className="bg-clay text-cream">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
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
              className="shrink-0 rounded-full bg-cream px-7 py-4 text-sm font-medium text-foreground transition-colors hover:bg-sand"
            >
              Démarrer en 3 minutes
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
            <div className="max-w-[36ch]">
              <span className="font-display text-2xl font-semibold tracking-tight">MAAN</span>
              <p className="mt-3 text-pretty text-sm text-muted">
                Télémédecine masculine. Consultation en ligne, ordonnance et livraison discrète à
                domicile.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <div className="space-y-3">
                <p className="text-foreground">Soins</p>
                <p>Sexual</p>
                <p>Weight</p>
                <p>Hair</p>
                <p>Skin</p>
              </div>
              <div className="space-y-3">
                <p className="text-foreground">Légal</p>
                <p>Pharmacie</p>
                <p>Données de santé</p>
                <p>Mentions</p>
                <p>CGV</p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-[11px] leading-relaxed text-muted">
              MAAN est un service de télémédecine. Les traitements sont délivrés uniquement sur
              ordonnance par un médecin agréé. La pharmacie partenaire expédie les médicaments. Ce
              site ne vend pas de médicament en vente libre.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
