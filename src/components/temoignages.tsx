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
  const [radius, setRadius] = useState(400);
  const rafRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () =>
      setRadius(Math.max(210, Math.min(430, el.clientWidth * 0.42)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const SLOTS = 44;
  const slots = Array.from({ length: SLOTS }, (_, i) => ({
    slot: i,
    data: temoignages[i % temoignages.length]!,
  }));
  const step = 360 / SLOTS;
  const tilt = 45;

  const current = temoignages[active % temoignages.length]!;

  const goTo = (index: number) => {
    setPlaying(null);
    setActive(((index % temoignages.length) + temoignages.length) % temoignages.length);
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

        {/* Anneau 3D façon CLOU : cartes debout, tangentes au cercle */}
        <Reveal className="relative mt-10 lg:mt-14">
          <div
            ref={wrapRef}
            className="relative h-[480px] w-full cursor-grab active:cursor-grabbing sm:h-[560px] lg:h-[640px]"
            style={{ perspective: "1600px" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Anneau */}
            <div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt}deg) rotateY(${spin}deg)`,
              }}
            >
              {slots.map(({ slot, data }) => {
                const isActiveData =
                  temoignages[active % temoignages.length]!.id === data.id;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      if (dragging) return;
                      goTo(temoignages.findIndex((tm) => tm.id === data.id));
                    }}
                    aria-label={t(
                      `Voir le témoignage de ${data.prenom}`,
                      `See ${data.prenom}'s testimonial`,
                    )}
                    className="absolute left-1/2 top-1/2 focus:outline-none"
                    style={{
                      width: "clamp(96px, 12vw, 136px)",
                      height: "clamp(64px, 8vw, 92px)",
                      marginLeft: "calc(clamp(96px, 12vw, 136px) * -0.5)",
                      marginTop: "calc(clamp(64px, 8vw, 92px) * -0.5)",
                      transform: `rotateY(${slot * step}deg) translateZ(${radius}px) rotateY(90deg)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Face avant */}
                    <span
                      className={cn(
                        "absolute inset-0 block overflow-hidden rounded-md border bg-cream shadow-[0_14px_30px_-18px_var(--foreground)] transition-opacity duration-500",
                        isActiveData ? "border-clay" : "border-border/70",
                      )}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <img
                        src={data.photo}
                        alt=""
                        loading="lazy"
                        width={400}
                        height={500}
                        draggable={false}
                        className="h-full w-full object-cover object-top"
                      />
                    </span>
                    {/* Face arrière (image à l'endroit vue de l'autre côté) */}
                    <span
                      className={cn(
                        "absolute inset-0 block overflow-hidden rounded-md border bg-cream shadow-[0_14px_30px_-18px_var(--foreground)] transition-opacity duration-500",
                        isActiveData ? "border-clay" : "border-border/70",
                      )}
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <img
                        src={data.photo}
                        alt=""
                        loading="lazy"
                        width={400}
                        height={500}
                        draggable={false}
                        className="h-full w-full object-cover object-top"
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Témoignage actif au centre de l'anneau */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4">
              <div className="pointer-events-auto rounded-2xl border border-border bg-background/95 p-6 shadow-[0_24px_60px_-40px_var(--foreground)] backdrop-blur-sm sm:p-7">
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

                <blockquote className="mt-5 font-section text-base leading-relaxed text-foreground md:text-lg">
                  « {current.texte} »
                </blockquote>

                {current.video ? (
                  <button
                    type="button"
                    onClick={() => setPlaying(current.video!)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-clay px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-clay transition-colors hover:bg-clay hover:text-cream"
                  >
                    <Play className="size-3 fill-current" />
                    {t("Témoignage vidéo", "Video testimonial")}
                  </button>
                ) : null}

                {/* Indicateurs */}
                <div className="mt-6 flex items-center gap-2">
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
            </div>

            {/* Flèches */}
            <div className="absolute bottom-2 right-2 z-30 flex gap-3 lg:bottom-6 lg:right-6">
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
          </div>
        </Reveal>
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
