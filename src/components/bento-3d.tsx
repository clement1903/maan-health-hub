import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Soin } from "@/components/soins-showcase";

type Card = {
  slug: string;
  title: string;
  accent: string;
  cta: string;
  gradient: string;
  desc: string;
};

/** Carte du bento : se retourne au clic pour révéler la description au verso. */
function BentoCard({ card }: { card: Card }) {
  const { t } = useI18n();
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="min-h-[260px] [perspective:1200px] lg:min-h-[300px]"
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? t("Revenir au recto de la carte", "Flip the card back")
            : t("Retourner la carte pour lire la description", "Flip the card to read the description")
        }
        className="group grid h-full w-full text-left [transform-style:preserve-3d]"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 650ms var(--ease)",
        }}
      >
        {/* RECTO */}
        <span
          className={cn(
            "col-start-1 row-start-1 flex h-full w-full overflow-hidden rounded-[28px] p-6 shadow-[0_20px_50px_-40px_var(--foreground)] transition-shadow duration-500 [backface-visibility:hidden] lg:p-8",
            "group-hover:shadow-[0_50px_100px_-45px_var(--foreground)]",
          )}
          style={{ background: card.gradient }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55),transparent_65%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="relative z-10 flex w-full flex-col justify-between">
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-clay-deep/70">
                {card.accent}
              </span>
              <span className="mt-2 block max-w-[14ch] text-balance font-section text-2xl font-medium leading-[1.05] tracking-tight text-foreground lg:text-[1.7rem]">
                {card.title}
              </span>
            </span>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 group-hover:gap-3 group-hover:text-foreground">
              {t("Retourner la carte", "Flip the card")}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-180">⟳</span>
            </span>
          </span>
        </span>

        {/* VERSO */}
        <span
          aria-hidden={!flipped}
          className="col-start-1 row-start-1 flex h-full w-full overflow-hidden rounded-[28px] bg-foreground p-6 shadow-[0_20px_50px_-40px_var(--foreground)] [backface-visibility:hidden] [transform:rotateY(180deg)] lg:p-8"
        >
          <span className="relative z-10 flex w-full flex-col justify-between gap-6">
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/60">
                {card.accent}
              </span>
              <span className="mt-3 block max-w-[46ch] text-pretty text-[13px] leading-relaxed text-cream/90 lg:text-sm">
                {card.desc}
              </span>
            </span>
            <Link
              to="/soins/$domaine"
              params={{ domaine: card.slug }}
              search={{ produit: undefined }}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:gap-3"
            >
              {card.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </span>
        </span>
      </button>
    </div>
  );
}

export function Bento3D({ soins = [] }: { soins?: Soin[] }) {
  const { t } = useI18n();

  const descOf = (slug: string) =>
    (Array.isArray(soins) ? soins : []).find((s) => s.slug === slug)?.desc ?? "";

  const cards: Card[] = [
    {
      slug: "poids",
      title: t("Perdez du poids, durablement.", "Lose weight, for good."),
      accent: t("Poids", "Weight"),
      cta: t("Voir les traitements", "See treatments"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--amber) 40%, var(--cream)), color-mix(in oklab, var(--clay) 22%, var(--cream)))",
      desc: descOf("poids"),
    },
    {
      slug: "sexuel",
      title: t("Retrouvez confiance au lit.", "Get your confidence back."),
      accent: t("Santé sexuelle", "Sexual health"),
      cta: t("Découvrir", "Discover"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--sand) 70%, var(--cream)), var(--cream))",
      desc: descOf("sexuel"),
    },
    {
      slug: "cheveux",
      title: t("Gardez vos cheveux.", "Keep your hair."),
      accent: t("Cheveux", "Hair"),
      cta: t("Découvrir", "Discover"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--clay) 16%, var(--cream)), var(--cream))",
      desc: descOf("cheveux"),
    },
    {
      slug: "peau",
      title: t("Une peau nette.", "Clear, calm skin."),
      accent: t("Peau", "Skin"),
      cta: t("Découvrir", "Discover"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--amber) 22%, var(--cream)), var(--cream))",
      desc: descOf("peau"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((c) => (
        <BentoCard key={c.slug} card={c} />
      ))}
    </div>
  );
}
