import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/conformite")({
  head: () => ({
    meta: [
      { title: "Conformité et confidentialité — MAAN" },
      {
        name: "description",
        content:
          "Comment MAAN encadre la prescription médicale, protège vos données de santé et organise l'expédition à domicile depuis une pharmacie partenaire.",
      },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "Conformité et confidentialité — MAAN" },
      {
        property: "og:description",
        content:
          "Prescription encadrée, données de santé chiffrées et hébergées en Europe, expédition en colis neutre.",
      },
      { property: "og:url", content: "/conformite" },
      { name: "twitter:title", content: "Conformité et confidentialité — MAAN" },
      {
        name: "twitter:description",
        content:
          "Prescription encadrée, données de santé protégées, expédition discrète depuis une pharmacie partenaire.",
      },
    ],
    links: [{ rel: "canonical", href: "/conformite" }],
  }),
  component: ConformitePage,
});

const blocs = [
  {
    id: "prescription",
    tag: "Prescription",
    title: "Aucun médicament sans ordonnance",
    intro: "Chaque demande est évaluée par un médecin agréé, jamais vendue en libre accès.",
    points: [
      "Médecins inscrits à l'Ordre",
      "Prescription possible, ajustée ou refusée",
      "Ordonnance valable dans toute pharmacie",
      "Renouvellement réévalué à chaque fois",
    ],
  },
  {
    id: "donnees",
    tag: "Données de santé",
    title: "Vos réponses restent confidentielles",
    intro: "Vos informations sont traitées comme des données de santé.",
    points: [
      "Chiffrées, hébergées en Europe",
      "Accès limité au médecin et à la pharmacie",
      "Aucune revente, aucune publicité",
      "Suppression possible à tout moment",
    ],
  },
  {
    id: "expedition",
    tag: "Expédition",
    title: "Un colis neutre, préparé en pharmacie",
    intro: "La préparation et l'envoi sont assurés par une pharmacie partenaire agréée.",
    points: [
      "Emballage sans mention visible",
      "Livraison en 24 à 48 h, domicile ou relais",
      "Suivi dans votre espace patient",
      "Notice incluse dans le colis",
    ],
  },
  {
    id: "medical",
    tag: "Information médicale",
    title: "Aucune décision automatisée",
    intro: "Les informations du site sont indicatives et ne remplacent pas un avis médical.",
    points: [
      "Traitements sur ordonnance uniquement",
      "Posologies affichées à titre indicatif",
      "Le questionnaire n'est ni diagnostic, ni prescription",
      "Seul le médecin décide, jamais un algorithme",
      "Lisez la notice, signalez tout effet indésirable",
      "Urgence : 15 ou 112",
    ],
  },
];


const icones: Record<string, React.ReactNode> = {
  prescription: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <path d="M10 13h5M10 17h3" />
    </svg>
  ),
  donnees: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 118 0v3" />
      <circle cx="12" cy="15" r="1.2" />
    </svg>
  ),
  expedition: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <path d="M12 21s-7-4.3-7-9.7A4.3 4.3 0 0112 8a4.3 4.3 0 017 3.3C19 16.7 12 21 12 21z" />
      <path d="M9.5 12h1.7l.8-1.6L13.6 14l.9-2h1.5" />
    </svg>
  ),
};

const reperes = [
  { valeur: "100 %", label: "Ordonnances signées par un médecin" },
  { valeur: "UE", label: "Hébergement des données de santé" },
  { valeur: "24-48 h", label: "Expédition en colis neutre" },
  { valeur: "0", label: "Décision automatisée" },
];

function ConformitePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-clay/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -left-24 h-[26rem] w-[26rem] rounded-full bg-sand blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-cream/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-clay backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                Conformité & confidentialité
              </span>
              <h1 className="mt-6 max-w-[22ch] text-balance font-display text-4xl font-medium leading-[1.02] tracking-tight lg:text-6xl">
                Votre ordonnance, vos données, votre colis.
              </h1>
              <p className="mt-6 max-w-[54ch] text-pretty text-lg text-muted">
                Quatre engagements clairs : prescription médicale, données confidentielles,
                livraison discrète.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <nav aria-label="Sections de la page" className="mt-10 flex flex-wrap gap-2.5">
                {blocs.map((b) => (
                  <a
                    key={b.id}
                    href={`#${b.id}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-cream px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-clay/40 hover:shadow-[0_10px_24px_-16px_rgba(0,0,0,0.4)]"
                  >
                    <span className="text-clay">{icones[b.id]}</span>
                    {b.tag}
                    <span className="text-muted transition-transform duration-300 group-hover:translate-y-0.5">
                      ↓
                    </span>
                  </a>
                ))}
              </nav>
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {reperes.map((r, i) => (
                <Reveal
                  key={r.label}
                  delay={i * 80}
                  className="rounded-2xl border border-border bg-cream/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-clay/40"
                >
                  <p className="font-display text-3xl font-medium tracking-tight text-clay">
                    {r.valeur}
                  </p>
                  <p className="mt-2 text-pretty text-xs leading-relaxed text-muted">{r.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Blocs */}
        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="space-y-6">
            {blocs.map((b, i) => (
              <div key={b.id} id={b.id} className="scroll-mt-24">
              <Reveal
                delay={i * 60}
                className="group scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-cream transition-all duration-500 hover:border-clay/40 hover:shadow-[0_28px_60px_-46px_rgba(0,0,0,0.55)]"
              >
                <div className="grid grid-cols-1 gap-8 p-7 lg:grid-cols-12 lg:p-10">
                  <div className="lg:col-span-5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sand text-clay transition-transform duration-500 group-hover:scale-105">
                        {icones[b.id]}
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                          {String(i + 1).padStart(2, "0")} — {b.tag}
                        </p>
                        <h2 className="mt-2 text-balance font-section text-2xl font-medium tracking-tight lg:text-3xl">
                          {b.title}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-5 max-w-[42ch] text-pretty text-sm leading-relaxed text-muted">
                      {b.intro}
                    </p>
                  </div>
                  <ul className="grid grid-cols-1 gap-3 lg:col-span-7 lg:grid-cols-2">
                    {b.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 rounded-2xl border border-border/70 bg-background p-4 transition-colors duration-300 hover:border-clay/40"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-clay"
                        >
                          <path d="M4 12.5l5 5L20 6.5" />
                        </svg>
                        <span className="text-pretty text-sm leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-sand">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-14 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[60ch] text-pretty text-sm text-muted">
              Envie de voir le détail du circuit, étape par étape ?
            </p>
            <Link
              to="/parcours"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
            >
              Voir le parcours
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
