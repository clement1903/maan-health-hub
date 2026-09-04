import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import { Reveal } from "@/components/reveal";
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
      "Je repoussais ce rendez-vous depuis deux ans. Le questionnaire m'a permis de tout dire sans avoir à le formuler à voix haute.",
      "I had been putting off this appointment for two years. The questionnaire let me say everything without having to voice it out loud.",
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
      "Un plan clair, un point mensuel, et un refus sur un dosage que je demandais. Ça m'a rassuré, honnêtement.",
      "A clear plan, a monthly check-in, and a refusal on a dosage I had asked for. Honestly, that reassured me.",
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
      "Le colis est arrivé sans aucune mention. Le suivi photo tous les trois mois me tient dans la durée.",
      "The package arrived with no markings at all. The photo follow-up every three months keeps me on track.",
    ),
    photo: temoin3,
  },
  {
    id: "nicolas",
    prenom: "Nicolas",
    age: t("52 ans", "52 years old"),
    domaine: "Skin Management",
    texte: t(
      "J'apprécie que tout soit écrit : l'ordonnance, la posologie, les précautions. Mon médecin traitant a validé sans réserve.",
      "I appreciate that everything is written down: the prescription, the dosage, the precautions. My own doctor approved without reservation.",
    ),
    photo: temoin4,
  },
];

export function Temoignages() {
  const { t } = useI18n();
  const temoignages = buildTemoignages(t);

  const [playing, setPlaying] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const [spin, setSpin] = useState(0);
  const [radius, setRadius] = useState(520);
  const [cardW, setCardW] = useState(260);

  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const spinRef = useRef(0);
  const velRef = useRef(0);
  const dragRef = useRef<{ x: number; moved: boolean } | null>(null);
  const hoverRef = useRef(false);

  // 12 cartes réparties sur l'anneau (les 4 témoignages, répétés)
  const SLOTS = 12;
  const step = 360 / SLOTS;

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = Math.max(180, Math.min(300, el.clientWidth * 0.24));
      setCardW(w);
      // rayon d'un cylindre régulier : gaps constants entre cartes
      const r = (w * 1.32) / (2 * Math.tan(Math.PI / SLOTS));
      setRadius(r);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Boucle : rotation lente + inertie du drag
  useEffect(() => {
    if (reduced) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      if (!dragRef.current) {
        velRef.current *= 0.94;
        if (Math.abs(velRef.current) < 0.002) velRef.current = 0;
        const idle = hoverRef.current || playing ? 0 : dt * 0.0055;
        spinRef.current = (spinRef.current + velRef.current * dt + idle) % 360;
        setSpin(spinRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, playing]);

  const rotateBy = useCallback((delta: number) => {
    spinRef.current = (spinRef.current + delta) % 360;
    velRef.current = 0;
    setSpin(spinRef.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, moved: false };
    velRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 2) {
      d.moved = true;
      d.x = e.clientX;
      const delta = dx * 0.22;
      spinRef.current = (spinRef.current + delta) % 360;
      velRef.current = delta / 16;
      setSpin(spinRef.current);
    }
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const cardH = cardW * 1.28;

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
              "Faites glisser pour faire tourner le cylindre",
              "Drag to spin the cylinder",
            )}
          </p>
        </Reveal>

        <Reveal className="relative mt-10 lg:mt-14">
          <div
            ref={wrapRef}
            className="relative h-[420px] w-full touch-pan-y select-none overflow-hidden cursor-grab active:cursor-grabbing sm:h-[520px] lg:h-[600px]"
            style={{ perspective: "1600px", perspectiveOrigin: "50% 50%" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={() => {
              endDrag();
              hoverRef.current = false;
            }}
            onMouseEnter={() => {
              hoverRef.current = true;
            }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: 0,
                height: 0,
                transformStyle: "preserve-3d",
                transform: `translateZ(-${radius}px) rotateX(-7deg) rotateY(${spin}deg)`,
              }}
            >
              {Array.from({ length: SLOTS }, (_, i) => {
                const data = temoignages[i % temoignages.length]!;
                return (
                  <article
                    key={i}
                    className="absolute rounded-xl border border-border/70 bg-cream/95 p-4 shadow-[0_24px_60px_-40px_var(--foreground)]"
                    style={{
                      width: cardW,
                      height: cardH,
                      left: -cardW / 2,
                      top: -cardH / 2,
                      transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                      backfaceVisibility: "visible",
                    }}
                  >
                    <img
                      src={data.photo}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className="h-[46%] w-full rounded-lg object-cover object-top"
                    />
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-clay">
                      {data.domaine}
                    </p>
                    <p className="mt-1 font-section text-sm font-medium">
                      {data.prenom}, {data.age}
                    </p>
                    <p className="mt-2 line-clamp-4 font-section text-[12px] leading-relaxed text-muted">
                      « {data.texte} »
                    </p>
                    {data.video ? (
                      <button
                        type="button"
                        onPointerUp={(e) => e.stopPropagation()}
                        onClick={() => {
                          if (dragRef.current?.moved) return;
                          setPlaying(data.video!);
                        }}
                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-clay px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-clay transition-colors hover:bg-clay hover:text-cream"
                      >
                        <Play className="size-2.5 fill-current" />
                        {t("Vidéo", "Video")}
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>

            {/* Flèches */}
            <div className="absolute bottom-2 right-2 z-30 flex gap-3 lg:bottom-6 lg:right-6">
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => rotateBy(step)}
                aria-label={t("Précédent", "Previous")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:border-clay hover:text-clay"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => rotateBy(-step)}
                aria-label={t("Suivant", "Next")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:border-clay hover:text-clay"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

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
