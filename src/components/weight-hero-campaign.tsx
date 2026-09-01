import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/reveal";
import { useScrollY } from "@/hooks/use-reveal";
import weightHeroMuseum from "@/assets/weight/weight-hero-museum.jpg";
import weightHeroMuseumEn from "@/assets/weight/weight-hero-museum-en.jpg";

/**
 * Hero éditorial « musée » de la page Weight Management.
 * Le texte s'immerge dans la photographie : chevauchement, parallaxe
 * multi-couches, plaque flottante — le jean devient le décor du titre.
 */
export function WeightHeroCampaign() {
  const { t, lang } = useI18n();
  const y = useScrollY();

  // Légères translations pilotées par le scroll (parallaxe douce)
  const imgShift = Math.min(y * 0.06, 60);
  const textShift = Math.min(y * 0.025, 24);

  return (
    <section className="relative overflow-hidden bg-[#120e0a] text-[#f3ece2]">
      {/* halo de projecteur — couche la plus profonde */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 68% 30%, rgba(196,120,84,0.18), transparent 65%), radial-gradient(90% 70% at 20% 80%, rgba(0,0,0,0.6), transparent 60%)",
          transform: `translateY(${imgShift * 0.4}px)`,
        }}
      />

      {/* PHOTO full-bleed — occupe toute la place disponible */}
      <div className="absolute inset-0">
        <img
          src={lang === "en" ? weightHeroMuseumEn : weightHeroMuseum}
          alt={t(
            "Un jean plié exposé comme une œuvre d'art sur un socle de musée, avec une plaque gravée « Jean, 2019 — Dernière apparition connue : été 2022 ».",
            "A folded pair of jeans displayed like an artwork on a museum pedestal, with an engraved plaque reading 'Jeans, 2019 — Last seen: summer 2022'.",
          )}
          width={1536}
          height={1024}
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 22%" }}
        />
        {/* dégradé qui « absorbe » la photo dans le fond à gauche */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,#120e0a_18%,rgba(18,14,10,0.55)_40%,transparent_60%)]"
        />
        {/* fondu des bords : haut et côtés uniquement pour ne pas masquer la plaque */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #120e0a 0%, transparent 18%), linear-gradient(90deg, #120e0a 0%, transparent 12%, transparent 88%, #120e0a 100%)",
          }}
        />
      </div>

      {/* TEXTE — plongé dans la photo par chevauchement */}
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-16 lg:min-h-[85vh] lg:py-24">
        <div
          className="max-w-xl will-change-transform"
          style={{ transform: `translateY(${-textShift}px)` }}
        >
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-clay">
              Weight Management
            </p>
            <h1 className="mt-5 text-balance font-section text-4xl font-medium leading-[1.04] tracking-tight drop-shadow-[0_4px_24px_rgba(18,14,10,0.8)] lg:text-6xl">
              {t("Toujours dans votre dressing ?", "Still in your closet?")}
            </h1>
            <p className="mt-6 font-section text-xl italic leading-snug text-[#f3ece2]/85 drop-shadow-[0_2px_16px_rgba(18,14,10,0.8)] lg:text-2xl">
              {t("Nous aussi, on connaît ce jean.", "We know those jeans too.")}
            </p>
            <span aria-hidden className="mt-7 block h-px w-12 bg-clay" />
            <p className="mt-6 max-w-[42ch] text-pretty leading-relaxed text-[#f3ece2]/75 drop-shadow-[0_2px_12px_rgba(18,14,10,0.8)]">
              {t(
                "Votre poids a changé. Vos options aussi.",
                "Your weight has changed. So have your options.",
              )}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/questionnaire/$slug"
                params={{ slug: "poids" }}
                className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream shadow-[0_20px_40px_-18px_rgba(196,120,84,0.7)] transition-all duration-300 hover:brightness-110"
              >
                {t("Découvrir Weight Management", "Discover Weight Management")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="#medicaments"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#f3ece2]/80 underline decoration-clay/60 decoration-2 underline-offset-[8px] transition-all hover:decoration-clay"
              >
                {t("En savoir plus", "Learn more")}
              </a>
            </div>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
