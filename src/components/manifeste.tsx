import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { HandwrittenSignature } from "@/components/handwritten-signature";
import { useI18n } from "@/lib/i18n";

export function Manifeste() {
  const { t } = useI18n();

  const lines = [
    t("Des soins pensés pour les hommes.", "Care designed for men."),
    t("Sans rendez-vous. Sans salle d'attente. Sans jugement.", "No appointment. No waiting room. No judgement."),
    t("Un médecin vous écoute. Une pharmacie prépare. Vous recevez à domicile.", "A doctor listens. A pharmacy prepares. You receive at home."),
  ];

  return (
    <section className="relative overflow-hidden bg-espresso py-20 text-espresso-foreground lg:py-28">
      {/* Halo terracotta */}
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--clay)_22%,transparent),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_14%,transparent),transparent_65%)] blur-2xl" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-espresso-muted">
            {t("Le manifeste", "The manifesto")}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-5xl font-medium leading-[0.95] tracking-tight text-cream sm:text-6xl lg:text-7xl">
            {t("RIEN À SIGNALER.", "NOTHING TO REPORT.")}
          </h2>
        </Reveal>

        <div className="mt-8 space-y-4 lg:mt-12 lg:space-y-6">
          {lines.map((line, i) => (
            <Reveal key={line} delay={120 * (i + 1)}>
              <p className="max-w-[26ch] text-balance font-display text-2xl font-medium leading-[1.15] tracking-tight text-cream/90 sm:text-3xl lg:text-4xl">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500} className="mt-10 lg:mt-14">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <Link
              to="/questionnaire"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep hover:shadow-[0_18px_40px_-18px_var(--clay)]"
            >
              {t("Commencer mon évaluation", "Start my assessment")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <div className="text-lg text-espresso-muted">
              <HandwrittenSignature
                text={t("Simple et confidentiel, promis.", "Simple and confidential, promised.")}
                className="text-clay"
                duration={2}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
