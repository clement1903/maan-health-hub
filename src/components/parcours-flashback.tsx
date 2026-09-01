import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";

import shotLivraison from "@/assets/film/shot-a-livraison.jpg";
import shotColis from "@/assets/film/shot-a2-colis-pose.jpg";
import shotNuit1 from "@/assets/film/shot-b-nuit1.jpg";
import shotJournee from "@/assets/film/shot-c-journee.jpg";
import shotNuit2 from "@/assets/film/shot-d-nuit2.jpg";
import shotPharmacie from "@/assets/film/shot-e-pharmacie.jpg";
import shotPrescription from "@/assets/film/shot-f-prescription.jpg";
import shotMedecin from "@/assets/film/shot-g-medecin.jpg";
import shotDossier from "@/assets/film/shot-i-dossier.jpg";
import shotQuestionnaire from "@/assets/film/shot-h-questionnaire.jpg";

/**
 * Copywriting du délai de livraison.
 * "A" = garanti · "B" = indicatif · "C" = à confirmer.
 * Par défaut : B (délai indicatif), aucune garantie logistique n'est promise.
 */
const DELAI_MODE: "A" | "B" | "C" = "B";

function useProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const raw = -rect.top / total;
      setP(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return p;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

type Shot = {
  src: string;
  alt: [string, string];
  /** durée relative du plan (poids) */
  weight: number;
  /** étape de la timeline (0 = évaluation … 4 = livraison) */
  step: number;
  eyebrow?: [string, string];
  title?: [string, string];
  body?: [string, string];
  note?: [string, string];
  /** rythme : un plan "hold" ralentit le rembobinage */
  hold?: boolean;
  position?: string;
};

export function ParcoursFlashback() {
  const { t, lang } = useI18n();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const p = useProgress(wrapRef);
  const reduced = useReducedMotion();
  const idx = lang === "en" ? 1 : 0;

  const delai: [string, string] =
    DELAI_MODE === "A"
      ? ["48 h après la prescription.", "48 h after the prescription."]
      : DELAI_MODE === "B"
        ? ["Généralement sous 48 h après la prescription.", "Usually within 48 h of the prescription."]
        : ["[Délai de livraison à confirmer]", "[Delivery time to be confirmed]"];

  const shots: Shot[] = [
    {
      src: shotLivraison,
      alt: ["Un homme reçoit un colis neutre à sa porte", "A man receives an unmarked parcel at his door"],
      weight: 1.2,
      step: 4,
      eyebrow: ["Comment ça marche", "How it works"],
      title: ["Votre traitement est arrivé.", "Your treatment has arrived."],
      body: [
        "Mais comment est-il arrivé jusqu'ici ?",
        "But how did it get here?",
      ],
      note: ["↓ Remonter le parcours", "↓ Rewind the journey"],
    },
    {
      src: shotColis,
      alt: ["Le colis neutre posé sur la table", "The unmarked parcel resting on the table"],
      weight: 0.8,
      step: 4,
      eyebrow: ["Livraison", "Delivery"],
      title: ["Un colis que personne ne peut lire.", "A parcel nobody can read."],
      body: [
        "Aucune mention du traitement ni de la raison médicale à l'extérieur.",
        "Nothing on the outside names the treatment or the medical reason.",
      ],
    },
    {
      src: shotNuit1,
      alt: ["Le même homme endormi, la nuit précédente", "The same man asleep, the night before"],
      weight: 0.9,
      step: 4,
      eyebrow: ["24 h plus tôt", "24 h earlier"],
      title: ["La nuit d'avant.", "The night before."],
    },
    {
      src: shotJournee,
      alt: ["Le même homme sort de chez lui un matin ordinaire", "The same man leaving home on an ordinary morning"],
      weight: 0.7,
      step: 4,
      eyebrow: ["Une journée ordinaire", "An ordinary day"],
      title: ["Il n'a rien eu à organiser.", "He had nothing to arrange."],
    },
    {
      src: shotNuit2,
      alt: ["Le même homme endormi, deux nuits plus tôt", "The same man asleep, two nights earlier"],
      weight: 1.1,
      step: 3,
      hold: true,
      eyebrow: ["48 h plus tôt", "48 h earlier"],
      title: ["Une prescription médicale.", "A medical prescription."],
      body: delai,
    },
    {
      src: shotPharmacie,
      alt: ["Préparation du même colis en pharmacie", "The same parcel being prepared at a pharmacy"],
      weight: 1.1,
      step: 3,
      eyebrow: ["Pharmacie", "Pharmacy"],
      title: ["Préparé et délivré par une pharmacie.", "Prepared and dispensed by a pharmacy."],
      body: [
        "Votre traitement est préparé après prescription, puis expédié discrètement.",
        "Your treatment is prepared after the prescription, then shipped discreetly.",
      ],
    },
    {
      src: shotPrescription,
      alt: ["Un document de prescription posé sur un bureau", "A prescription document on a desk"],
      weight: 0.9,
      step: 2,
      eyebrow: ["Prescription", "Prescription"],
      title: ["Rien n'est préparé sans ordonnance.", "Nothing is prepared without a prescription."],
      position: "object-center",
    },
    {
      src: shotMedecin,
      alt: ["Une médecin examine un dossier patient", "A doctor reviewing a patient file"],
      weight: 1.4,
      step: 1,
      hold: true,
      eyebrow: ["Médecin", "Doctor"],
      title: ["Avant la prescription, une décision médicale.", "Before the prescription, a medical decision."],
      body: [
        "Le médecin examine votre situation et détermine si un traitement est médicalement adapté.",
        "The doctor reviews your situation and decides whether a treatment is medically appropriate.",
      ],
      note: ["Décision médicale indépendante.", "Independent medical decision."],
    },
    {
      src: shotDossier,
      alt: ["Le dossier du patient affiché à l'écran", "The patient file on screen"],
      weight: 0.9,
      step: 1,
      eyebrow: ["Dossier", "File"],
      title: ["Symptômes. Antécédents. Traitements en cours.", "Symptoms. History. Current treatments."],
      body: [
        "Tout ce que le médecin a lu venait d'un seul endroit.",
        "Everything the doctor read came from a single place.",
      ],
    },
    {
      src: shotQuestionnaire,
      alt: [
        "Le même homme remplit son évaluation depuis son canapé",
        "The same man filling in his assessment from his sofa",
      ],
      weight: 1.5,
      step: 0,
      hold: true,
      eyebrow: ["Évaluation", "Assessment"],
      title: ["Tout commence ici.", "It all starts here."],
      body: [
        "Quelques questions pour permettre à un médecin d'évaluer votre situation.",
        "A few questions so a doctor can assess your situation.",
      ],
    },
  ];

  const steps: [string, string][] = [
    ["Évaluation", "Assessment"],
    ["Médecin", "Doctor"],
    ["Prescription", "Prescription"],
    ["Pharmacie", "Pharmacy"],
    ["Livraison", "Delivery"],
  ];

  // Découpage du scroll en segments pondérés
  const totalWeight = shots.reduce((s, x) => s + x.weight, 0);
  const bounds: { start: number; end: number }[] = [];
  let acc = 0;
  for (const s of shots) {
    const start = acc / totalWeight;
    acc += s.weight;
    bounds.push({ start, end: acc / totalWeight });
  }

  const activeIndex = bounds.findIndex((b, i) => p < b.end || i === shots.length - 1);
  const activeShot = shots[Math.max(0, activeIndex)];
  const finalPhase = smooth(clamp01((p - bounds[shots.length - 1].start - 0.02) / 0.08));

  if (reduced) {
    return (
      <section className="mx-auto w-full max-w-5xl px-6 py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
          {t("Comment ça marche", "How it works")}
        </p>
        <h1 className="mt-6 font-display text-5xl font-light italic leading-[0.95] md:text-7xl">
          {t("Votre traitement est arrivé.", "Your treatment has arrived.")}
        </h1>
        <ol className="mt-16 space-y-16">
          {shots
            .filter((s) => s.title)
            .map((s) => (
              <li key={s.src} className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
                <img
                  src={s.src}
                  alt={s.alt[idx]}
                  loading="lazy"
                  width={1600}
                  height={912}
                  className="aspect-[16/10] w-full rounded-2xl object-cover"
                />
                <div>
                  {s.eyebrow ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                      {s.eyebrow[idx]}
                    </span>
                  ) : null}
                  <h2 className="mt-3 font-section text-2xl font-semibold md:text-3xl">{s.title![idx]}</h2>
                  {s.body ? <p className="mt-3 text-muted">{s.body[idx]}</p> : null}
                </div>
              </li>
            ))}
        </ol>
        <Link
          to="/questionnaire"
          className="mt-14 inline-flex items-center gap-2 rounded-full bg-clay px-10 py-5 text-base font-medium text-cream"
        >
          {t("Commencer mon évaluation", "Start my assessment")} →
        </Link>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: "760vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-foreground">
        {/* Le film */}
        {shots.map((s, i) => {
          const { start, end } = bounds[i];
          const span = end - start;
          const local = clamp01((p - start) / span);
          const fadeIn = smooth(clamp01((p - start) / (span * 0.22)));
          const fadeOut = 1 - smooth(clamp01((p - (end - span * 0.22)) / (span * 0.22)));
          const opacity = i === shots.length - 1 ? fadeIn : Math.min(fadeIn, fadeOut);
          if (opacity <= 0.001) return null;
          // Rembobinage : le cadre se rouvre légèrement (zoom arrière) au fil du plan
          const scale = 1.14 - local * 0.1;
          const shift = (0.5 - local) * 2.5;
          return (
            <div key={s.src} className="absolute inset-0" style={{ opacity }}>
              <img
                src={s.src}
                alt={s.alt[idx]}
                width={1600}
                height={912}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                className={`h-full w-full object-cover will-change-transform ${s.position ?? "object-center"}`}
                style={{ transform: `scale(${scale}) translate3d(0, ${shift}%, 0)` }}
              />
            </div>
          );
        })}

        {/* Grain + vignettage cinéma */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/25 to-foreground/45" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Overlays HTML */}
        {shots.map((s, i) => {
          if (!s.title) return null;
          const { start, end } = bounds[i];
          const span = end - start;
          const local = clamp01((p - start) / span);
          const isLast = i === shots.length - 1;
          const inOp = smooth(clamp01((local - 0.18) / 0.18));
          const outOp = isLast ? 1 : 1 - smooth(clamp01((local - 0.72) / 0.18));
          const o = Math.min(inOp, outOp);
          if (o <= 0.001) return null;
          return (
            <div
              key={`t-${s.src}`}
              className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-20 md:pb-24"
              style={{ opacity: o, transform: `translate3d(0, ${(1 - o) * 18}px, 0)` }}
            >
              <div className="mx-auto w-full max-w-5xl text-cream">
                {s.eyebrow ? (
                  <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
                    {s.eyebrow[idx]}
                  </span>
                ) : null}
                <h2 className="mt-5 max-w-[20ch] text-balance font-display text-5xl font-light italic leading-[0.95] md:text-7xl">
                  {s.title[idx]}
                </h2>
                {s.body ? (
                  <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-cream/75 md:text-xl">
                    {s.body[idx]}
                  </p>
                ) : null}
                {s.note ? (
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.26em] text-clay">
                    {s.note[idx]}
                  </p>
                ) : null}
                {isLast ? (
                  <div
                    className="pointer-events-auto mt-10 flex flex-col items-start gap-4"
                    style={{ opacity: finalPhase, transform: `translate3d(0, ${(1 - finalPhase) * 14}px, 0)` }}
                  >
                    <Link
                      to="/questionnaire"
                      className="group inline-flex items-center gap-3 rounded-full bg-clay px-10 py-5 text-base font-medium text-cream transition-all duration-500 ease-[var(--ease)] hover:gap-5 hover:bg-clay-deep"
                    >
                      {t("Commencer mon évaluation", "Start my assessment")}
                      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </Link>
                    <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-cream/50">
                      {t("Quelques minutes · Sans engagement", "A few minutes · No commitment")}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Timeline discrète */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-5 md:flex">
          {[...steps].reverse().map((label, r) => {
            const stepIndex = steps.length - 1 - r;
            const active = activeShot.step === stepIndex;
            const passed = activeShot.step < stepIndex;
            return (
              <div key={label[0]} className="flex items-center gap-3">
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.26em] transition-colors duration-500 ${
                    active ? "text-cream" : passed ? "text-cream/25" : "text-cream/45"
                  }`}
                >
                  {label[idx]}
                </span>
                <span
                  className={`h-px transition-all duration-500 ease-[var(--ease)] ${
                    active ? "w-10 bg-clay" : "w-4 bg-cream/25"
                  }`}
                />
                <span className="w-6 text-right font-mono text-[9px] tracking-[0.2em] text-cream/40">
                  0{stepIndex + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Barre de rembobinage */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cream/15">
          <div className="h-px bg-clay" style={{ width: `${p * 100}%` }} />
        </div>
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-cream/45"
          style={{ opacity: 1 - smooth(clamp01(p / 0.06)) }}
        >
          {t("↓ Remonter le temps", "↓ Rewind time")}
        </div>
      </div>
    </div>
  );
}
