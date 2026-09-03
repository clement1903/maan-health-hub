import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

import temoin1 from "@/assets/temoin-1.jpg";
import temoin2 from "@/assets/temoin-2.jpg";
import temoin3 from "@/assets/temoin-3.jpg";
import temoin4 from "@/assets/temoin-4.jpg";
import video1 from "@/assets/temoignage-1.mp4.asset.json";
import video2 from "@/assets/temoignage-2.mp4.asset.json";

type Temoignage = {
  id: string;
  prenom: string;
  age: string;
  domaine: string;
  texte: string;
  photo: string;
  video?: string;
};

const buildTemoignages = (t: (fr: string, en: string) => string): Temoignage[] => [
  {
    id: "thomas",
    prenom: "Thomas",
    age: t("38 ans", "38 years old"),
    domaine: "Sexual Management",
    texte: t(
      "Je repoussais ce rendez-vous depuis deux ans. Le questionnaire m'a permis de tout dire sans avoir à le formuler à voix haute. Le médecin a demandé des précisions avant de prescrire.",
      "I had been putting off this appointment for two years. The questionnaire let me say everything without having to voice it out loud. The doctor asked for details before prescribing.",
    ),
    photo: temoin1,
    video: video1.url,
  },
  {
    id: "karim",
    prenom: "Karim",
    age: t("45 ans", "45 years old"),
    domaine: "Weight Management",
    texte: t(
      "On m'a expliqué qu'un traitement ne remplace pas le suivi. J'ai eu un plan clair, un point mensuel, et un refus sur un dosage que je demandais. Ça m'a rassuré, honnêtement.",
      "I was told that a treatment doesn't replace follow-up. I got a clear plan, a monthly check-in, and a refusal on a dosage I had asked for. Honestly, that reassured me.",
    ),
    photo: temoin2,
    video: video2.url,
  },
  {
    id: "romain",
    prenom: "Romain",
    age: t("31 ans", "31 years old"),
    domaine: "Hair Management",
    texte: t(
      "Le colis est arrivé sans aucune mention. Personne au bureau n'a pu deviner ce qu'il contenait. Le suivi photo tous les trois mois me tient dans la durée.",
      "The package arrived with no markings at all. No one at the office could guess what was inside. The photo follow-up every three months keeps me on track.",
    ),
    photo: temoin3,
  },
  {
    id: "nicolas",
    prenom: "Nicolas",
    age: t("52 ans", "52 years old"),
    domaine: "Skin Management",
    texte: t(
      "J'apprécie que tout soit écrit : l'ordonnance, la posologie, les précautions. Je l'ai montrée à mon médecin traitant, qui a validé sans réserve.",
      "I appreciate that everything is written down: the prescription, the dosage, the precautions. I showed it to my regular doctor, who approved it without reservation.",
    ),
    photo: temoin4,
  },
];

export function Temoignages() {
  const { t } = useI18n();
  const temoignages = buildTemoignages(t);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || paused || playing) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      setAngle((a) => (a + dt * 0.0055) % 360);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, paused, playing]);

  const current = temoignages[active] ?? temoignages[0]!;
  const step = 360 / temoignages.length;

  return (
    <section id="temoignages" className="scroll-mt-24 bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              {t("Témoignages", "Testimonials")}
            </p>
            <h2 className="mt-3 max-w-[24ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
              {t("Ces hommes, ils parlent de MAAN.", "These men talk about MAAN.")}
            </h2>
          </div>
          <p className="max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
            {t(
              "Survolez l'orbite · sélectionnez un parcours",
              "Hover the orbit · select a journey",
            )}
          </p>
        </Reveal>

        {/* Orbite */}
        <Reveal className="mt-12">
          <div
            className="relative mx-auto aspect-square w-full max-w-[640px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Anneaux */}
            <div className="pointer-events-none absolute inset-0 rounded-full border border-border" />
            <div className="pointer-events-none absolute inset-[12%] rounded-full border border-dashed border-clay/25" />

            {/* Aperçu central */}
            <div className="absolute inset-[18%] overflow-hidden rounded-full border border-border bg-background shadow-[0_40px_90px_-60px_var(--foreground)]">
              {playing && current.video ? (
                <video
                  src={current.video}
                  poster={current.photo}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <img
                    key={current.id}
                    src={current.photo}
                    alt={t(
                      `${current.prenom}, ${current.age}, patient MAAN`,
                      `${current.prenom}, ${current.age}, MAAN patient`,
                    )}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="h-full w-full animate-[fade_600ms_ease] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-8 pb-8 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/70">
                      {current.prenom} · {current.age} · {current.domaine}
                    </p>
                    <p className="mx-auto mt-3 max-w-[28ch] text-pretty font-section text-[13px] leading-relaxed text-cream sm:text-sm">
                      « {current.texte} »
                    </p>
                    {current.video ? (
                      <button
                        type="button"
                        onClick={() => setPlaying(current.video!)}
                        className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-cream/95 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-clay transition-transform duration-300 hover:scale-105"
                      >
                        <Play className="size-3 fill-current" />
                        {t("Témoignage vidéo", "Video testimonial")}
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </div>

            {/* Vignettes en orbite */}
            {temoignages.map((tm, i) => {
              const a = angle + i * step;
              return (
                <div
                  key={tm.id}
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{ transform: `rotate(${a}deg)` }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => {
                      setActive(i);
                      setPlaying(null);
                    }}
                    onFocus={() => setActive(i)}
                    onClick={() => {
                      setActive(i);
                      setPlaying(null);
                    }}
                    aria-label={t(
                      `Voir le témoignage de ${tm.prenom}`,
                      `See ${tm.prenom}'s testimonial`,
                    )}
                    className="pointer-events-auto absolute left-1/2 top-0"
                    style={{ transform: `translate(-50%, -50%) rotate(${-a}deg)` }}
                  >
                    <span
                      className={cn(
                        "block overflow-hidden rounded-full border bg-cream transition-all duration-500 ease-[var(--ease)]",
                        active === i
                          ? "size-[68px] border-clay shadow-[0_18px_40px_-20px_var(--foreground)] sm:size-[84px]"
                          : "size-[52px] border-border opacity-70 hover:opacity-100 sm:size-[64px]",
                      )}
                    >
                      <img
                        src={tm.photo}
                        alt={t(`Portrait de ${tm.prenom}`, `Portrait of ${tm.prenom}`)}
                        loading="lazy"
                        width={768}
                        height={768}
                        className="h-full w-full object-cover object-top"
                      />
                    </span>
                    <span
                      className={cn(
                        "mt-2 block whitespace-nowrap text-center font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                        active === i ? "text-clay" : "text-muted",
                      )}
                    >
                      {tm.prenom}
                    </span>
                  </button>
                </div>
              );
            })}

          </div>
        </Reveal>

        {/* Sélecteur secondaire */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {temoignages.map((tm, i) => (
            <button
              key={tm.id}
              type="button"
              onClick={() => {
                setActive(i);
                setPlaying(null);
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                active === i
                  ? "border-clay bg-clay text-cream"
                  : "border-border text-muted hover:border-clay hover:text-clay",
              )}
            >
              {tm.domaine}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
