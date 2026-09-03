import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

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
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [spin, setSpin] = useState(0);
  const rafRef = useRef(0);
  const ringRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || paused || dragging || playing) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      setSpin((s) => (s + dt * 0.0028) % 360);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, paused, dragging, playing]);

  const SLOTS = 30;
  const slots = Array.from({ length: SLOTS }, (_, i) => ({
    slot: i,
    data: temoignages[i % temoignages.length]!,
  }));
  const count = SLOTS;
  const step = 360 / count;
  const radius = 420;
  const tilt = 80;
  const ringAngle = -active * step + spin;

  const current = temoignages[active % temoignages.length]!;

  const goTo = (index: number) => {
    setPlaying(null);
    setActive((index + count) % count);
    setSpin(0);
  };

  const handlePrev = () => goTo(active - 1);
  const handleNext = () => goTo(active + 1);


  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(false);
    touchStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!touchStart.current) return;
    const dx = e.clientX - touchStart.current.x;
    if (Math.abs(dx) > 6) setDragging(true);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!touchStart.current) return;
    const dx = e.clientX - touchStart.current.x;
    touchStart.current = null;
    if (dragging && Math.abs(dx) > 24) {
      if (dx > 0) handlePrev();
      else handleNext();
    }
    setDragging(false);
  };

  return (
    <section id="temoignages" className="scroll-mt-24 overflow-hidden bg-sand">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
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
              "Faites tourner la roue · sélectionnez un parcours",
              "Spin the wheel · select a journey",
            )}
          </p>
        </Reveal>

        <div className="relative mt-10 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:items-center lg:min-h-[720px]">
          {/* Carte active */}
          <Reveal className="relative z-20 order-1">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-[0_24px_60px_-40px_var(--foreground)] sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clay/10 font-mono text-[11px] font-semibold uppercase tracking-wider text-clay">
                  0{active + 1}
                </span>
                <div>
                  <p className="font-section text-base font-medium">
                    {current.prenom}, {current.age}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {current.domaine}
                  </p>
                </div>
              </div>

              <blockquote className="mt-6 font-section text-lg leading-relaxed text-foreground md:text-xl">
                « {current.texte} »
              </blockquote>

              {current.video ? (
                <button
                  type="button"
                  onClick={() => setPlaying(current.video!)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-clay px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-clay transition-colors hover:bg-clay hover:text-cream"
                >
                  <Play className="size-3 fill-current" />
                  {t("Témoignage vidéo", "Video testimonial")}
                </button>
              ) : null}

              {/* Indicateurs */}
              <div className="mt-8 flex items-center gap-2">
                {temoignages.map((tm, i) => (
                  <button
                    key={tm.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={t(
                      `Voir le témoignage de ${tm.prenom}`,
                      `See ${tm.prenom}'s testimonial`,
                    )}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      active % temoignages.length === i
                        ? "w-8 bg-clay"
                        : "w-1.5 bg-border hover:bg-clay/50",
                    )}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Carrousel 3D horizontal */}
          <Reveal className="relative order-2 flex min-h-[460px] items-center justify-center lg:min-h-0">
            <div
              className="relative aspect-square w-full max-w-[560px] cursor-grab active:cursor-grabbing sm:max-w-[640px] lg:max-w-[820px] lg:translate-x-[14%]"
              style={{ perspective: "1800px" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Sol / ombre */}
              <div className="pointer-events-none absolute inset-[18%] rounded-full bg-foreground/[0.06] blur-3xl" />

              {/* Anneau */}
              <div
                ref={ringRef}
                className={cn(
                  "absolute inset-0",
                  reduced || spin !== 0 ? "" : "transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
                )}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateZ(-16deg) rotateX(${tilt}deg) rotateZ(${ringAngle}deg)`,
                }}
              >
                {slots.map(({ slot, data }) => {
                  const itemAngle = slot * step;
                  const isActive = active === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        if (dragging) return;
                        goTo(slot);
                      }}
                      aria-label={t(
                        `Voir le témoignage de ${data.prenom}`,
                        `See ${data.prenom}'s testimonial`,
                      )}
                      className="absolute left-1/2 top-1/2 focus:outline-none"
                      style={{
                        width: "clamp(100px, 21%, 158px)",
                        height: "clamp(126px, 27%, 198px)",
                        marginLeft: "calc(clamp(100px, 21%, 158px) * -0.5)",
                        marginTop: "calc(clamp(126px, 27%, 198px) * -0.5)",
                        transform: `rotateZ(${itemAngle}deg) translateY(-${radius}px) rotateX(-${tilt}deg)`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <span
                        className={cn(
                          "relative block h-full w-full overflow-hidden rounded-lg border bg-cream shadow-[0_18px_40px_-20px_var(--foreground)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive
                            ? "border-clay shadow-[0_30px_70px_-30px_var(--foreground)]"
                            : "border-border opacity-75 hover:opacity-100",
                        )}
                      >
                        <img
                          src={data.photo}
                          alt={t(
                            `Portrait de ${data.prenom}`,
                            `Portrait of ${data.prenom}`,
                          )}
                          loading="lazy"
                          width={400}
                          height={500}
                          draggable={false}
                          className="h-full w-full object-cover object-top"
                        />
                        {isActive ? (
                          <span className="absolute bottom-3 left-3 rounded-full bg-cream/95 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-clay">
                            {data.prenom}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flèches */}
            <div className="absolute bottom-0 left-1/2 z-30 flex -translate-x-1/2 gap-3 lg:bottom-auto lg:left-auto lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:flex-col">
              <button
                type="button"
                onClick={handlePrev}
                aria-label={t("Précédent", "Previous")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:border-clay hover:text-clay"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label={t("Suivant", "Next")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:border-clay hover:text-clay"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Lecteur vidéo plein écran léger */}
      {playing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm"
          onClick={() => setPlaying(null)}
        >
          <video
            src={playing}
            controls
            autoPlay
            playsInline
            className="max-h-[80vh] w-full max-w-3xl rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  );
}
