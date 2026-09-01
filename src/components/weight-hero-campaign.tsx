import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/reveal";
import { useScrollY } from "@/hooks/use-reveal";
import weightHeroMuseum from "@/assets/weight/weight-hero-museum.jpg";

/**
 * Hero éditorial « musée » de la page Weight Management.
 * Le texte s'immerge dans la photographie : chevauchement, parallaxe
 * multi-couches, plaque flottante — le jean devient le décor du titre.
 */
export function WeightHeroCampaign() {
  const { t } = useI18n();
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

      <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="relative">
          {/* PHOTO — toile de fond du titre, décalée vers la droite */}
          <Reveal delay={120} className="lg:ml-[30%]">
            <figure
              className="relative will-change-transform"
              style={{ transform: `translateY(${imgShift}px)` }}
            >
              <img
                src={weightHeroMuseum}
                alt={t(
                  "Un jean plié exposé comme une œuvre d'art sur un socle de musée, avec une plaque gravée « Jean, 2019 — Dernière apparition connue : été 2022 ».",
                  "A folded pair of jeans displayed like an artwork on a museum pedestal, with an engraved plaque reading 'Jeans, 2019 — Last seen: summer 2022'.",
                )}
                width={1536}
                height={1024}
                className="aspect-[3/2] w-full rounded-[24px] object-cover shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)]"
              />
              {/* dégradé qui « absorbe » la photo dans le fond à gauche */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px] bg-[linear-gradient(100deg,#120e0a_4%,rgba(18,14,10,0.55)_26%,transparent_52%)]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-[#f3ece2]/10"
              />

            </figure>
          </Reveal>

          {/* TEXTE — plongé dans la photo par chevauchement */}
          <div
            className="relative z-10 -mt-40 max-w-xl px-1 will-change-transform lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:flex lg:w-[52%] lg:flex-col lg:justify-center lg:px-0"
            style={{ transform: `translateY(${-textShift}px)` }}
          >
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-clay">
                Weight Management
              </p>
              <h1 className="mt-5 text-balance font-section text-4xl font-medium leading-[1.04] tracking-tight drop-shadow-[0_4px_24px_rgba(18,14,10,0.8)] lg:text-6xl">
                {t("Vous le gardez toujours ?", "Do you still keep it?")}
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
      </div>

      {/* ruban de garanties */}
      <div className="relative border-t border-[#f3ece2]/10 bg-[#f3ece2] text-[#1c1712]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 lg:grid-cols-4">
          {(
            [
              {
                icon: "✚",
                titre: t("Prise en charge médicale", "Medical care"),
                texte: t(
                  "Un accompagnement sécurisé et personnalisé.",
                  "Safe, personalised support.",
                ),
              },
              {
                icon: "◍",
                titre: t("Accompagnement personnalisé", "Personal coaching"),
                texte: t(
                  "Un suivi adapté à votre quotidien.",
                  "Follow-up adapted to your daily life.",
                ),
              },
              {
                icon: "❧",
                titre: t("Résultats durables", "Lasting results"),
                texte: t(
                  "Des solutions efficaces sur le long terme.",
                  "Solutions that work over the long term.",
                ),
              },
              {
                icon: "⛨",
                titre: t("Discrétion totale", "Total discretion"),
                texte: t(
                  "Votre parcours, en toute confidentialité.",
                  "Your journey, in complete confidentiality.",
                ),
              },
            ] as const
          ).map((g) => (
            <div key={g.titre} className="flex items-start gap-4">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-clay/40 text-lg text-clay"
              >
                {g.icon}
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase leading-snug tracking-[0.14em]">
                  {g.titre}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#1c1712]/65">
                  {g.texte}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
