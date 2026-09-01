import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Mic, Video, PhoneOff, Check, Bell } from "lucide-react";
import medecinVisio from "@/assets/parcours-medecin-visio.jpg";
import patientVisio from "@/assets/temoin-1.jpg";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** progression locale entre deux bornes */
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** apparition / disparition douce d'une couche */
const band = (p: number, inA: number, inB: number, outA: number, outB: number) =>
  seg(p, inA, inB) * (1 - seg(p, outA, outB));

type Stage = { p: number; w: number; h: number; r: number; rx: number; ry: number; s: number };

/** Géométrie continue de l'objet central : téléphone → dossier → écran → dossier → colis → téléphone */
const STAGES: Stage[] = [
  { p: 0.0, w: 280, h: 560, r: 40, rx: 6, ry: -10, s: 0.9 },
  { p: 0.1, w: 280, h: 560, r: 40, rx: 4, ry: -8, s: 1 },
  { p: 0.26, w: 292, h: 552, r: 40, rx: 3, ry: -14, s: 1 },
  { p: 0.34, w: 400, h: 470, r: 32, rx: 2, ry: -6, s: 1 },
  { p: 0.42, w: 520, h: 360, r: 24, rx: 1, ry: 5, s: 1 },
  { p: 0.52, w: 700, h: 430, r: 26, rx: 0, ry: 0, s: 1 },
  { p: 0.64, w: 700, h: 430, r: 26, rx: 0, ry: 2, s: 1 },
  { p: 0.71, w: 520, h: 360, r: 24, rx: 2, ry: 8, s: 1 },
  { p: 0.77, w: 430, h: 340, r: 18, rx: 6, ry: -16, s: 1 },
  { p: 0.83, w: 350, h: 310, r: 12, rx: 9, ry: -18, s: 1 },
  { p: 0.88, w: 350, h: 310, r: 12, rx: 7, ry: -12, s: 1.04 },
  { p: 0.93, w: 300, h: 430, r: 26, rx: 4, ry: 14, s: 1 },
  { p: 0.97, w: 280, h: 560, r: 40, rx: 2, ry: -4, s: 1 },
  { p: 1.0, w: 280, h: 560, r: 40, rx: 2, ry: -2, s: 1 },
];

function geometry(p: number): Stage {
  let i = 0;
  while (i < STAGES.length - 2 && p > (STAGES[i + 1] as Stage).p) i++;
  const a = STAGES[i] as Stage;
  const b = STAGES[i + 1] as Stage;
  const t = ease(clamp((p - a.p) / (b.p - a.p)));
  return {
    p,
    w: mix(a.w, b.w, t),
    h: mix(a.h, b.h, t),
    r: mix(a.r, b.r, t),
    rx: mix(a.rx, b.rx, t),
    ry: mix(a.ry, b.ry, t),
    s: mix(a.s, b.s, t),
  };
}

/* ------------------------------------------------------------------ */

export function ParcoursMorph() {
  const { t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale(clamp(Math.min(w / 1180, (h - 120) / 700), 0.42, 1));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setP(clamp(total > 0 ? -rect.top / total : 0));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const steps = [
    { n: "01", label: t("Questionnaire", "Questionnaire") },
    { n: "02", label: t("Consultation", "Consultation") },
    { n: "03", label: t("Livraison", "Delivery") },
    { n: "04", label: t("Suivi", "Follow-up") },
  ];

  const active = p < 0.44 ? 0 : p < 0.72 ? 1 : p < 0.9 ? 2 : 3;

  const texts = [
    {
      k: "01",
      eyebrow: `01 — ${t("Questionnaire", "Questionnaire")}`,
      title: t("Quelques minutes pour parler de vous.", "A few minutes to tell us about you."),
      sub: t(
        "Répondez simplement à quelques questions depuis chez vous.",
        "Simply answer a few questions from home.",
      ),
      o: band(p, 0.03, 0.1, 0.4, 0.47),
    },
    {
      k: "02",
      eyebrow: `02 — ${t("Consultation", "Consultation")}`,
      title: t("Échangez avec un médecin en ligne.", "Talk with a doctor online."),
      sub: t(
        "Votre dossier est déjà préparé pour rendre la consultation simple et efficace.",
        "Your file is already prepared to make the consultation simple and efficient.",
      ),
      small: t("Depuis chez vous.", "From home."),
      o: band(p, 0.44, 0.5, 0.7, 0.76),
    },
    {
      k: "03",
      eyebrow: `03 — ${t("Livraison", "Delivery")}`,
      title: t("Discret, jusqu'à votre porte.", "Discreet, all the way to your door."),
      sub: t(
        "Votre traitement est préparé par la pharmacie partenaire et livré directement chez vous.",
        "Your treatment is prepared by our partner pharmacy and delivered straight to your home.",
      ),
      o: band(p, 0.74, 0.79, 0.89, 0.93),
    },
    {
      k: "04",
      eyebrow: `04 — ${t("Suivi", "Follow-up")}`,
      title: t("MAAN reste avec vous.", "MAAN stays with you."),
      sub: t(
        "Retrouvez votre suivi et vos échanges depuis votre espace patient.",
        "Find your follow-up and your messages in your patient space.",
      ),
      o: band(p, 0.91, 0.95, 1.01, 1.02),
    },
  ];

  if (reduced) return <ParcoursStatic />;

  const g = geometry(p);

  return (
    <section id="parcours" ref={wrapRef} className="relative scroll-mt-24 bg-background">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* En-tête discret */}
        <div className="mx-auto w-full max-w-6xl px-6 pt-24 lg:pt-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Le parcours", "How it works")}
          </p>
          <h2 className="mt-2 max-w-[20ch] text-balance font-section text-2xl font-medium tracking-tight lg:text-3xl">
            {t("Quatre étapes. Sans déplacement.", "Four steps. Without leaving home.")}
          </h2>

          {/* Navigation ultra-discrète */}
          <div className="mt-5 hidden items-end gap-8 sm:flex">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={cn(
                  "transition-opacity duration-700",
                  active === i ? "opacity-100" : "opacity-35",
                )}
              >
                <p className="font-mono text-[10px] tracking-[0.18em] text-clay">{s.n}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em]">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 h-px w-full bg-border">
            <div
              className="h-px origin-left bg-clay"
              style={{ transform: `scaleX(${p.toFixed(4)})` }}
            />
          </div>
        </div>

        {/* Scène */}
        <div className="relative flex-1">
          {/* Texte de l'étape */}
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 mx-auto max-w-6xl px-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
            <div className="relative h-[150px] w-full max-w-[420px] lg:h-[240px]">
              {texts.map((tx) => (
                <div
                  key={tx.k}
                  className="absolute inset-0"
                  style={{
                    opacity: tx.o,
                    transform: `translateY(${(1 - tx.o) * 16}px)`,
                    visibility: tx.o < 0.01 ? "hidden" : "visible",
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                    {tx.eyebrow}
                  </p>
                  <p className="mt-3 text-balance font-display text-2xl font-medium leading-tight tracking-tight lg:text-[34px]">
                    {tx.title}
                  </p>
                  <p className="mt-3 max-w-[42ch] text-pretty text-sm text-muted">{tx.sub}</p>
                  {tx.small ? (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
                      {tx.small}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Objet central */}
          <div
            className="absolute inset-0 flex items-center justify-center lg:pl-[380px]"
            style={{ perspective: "1600px" }}
          >
            <div style={{ transform: `scale(${scale})`, transformStyle: "preserve-3d" }}>
              <MorphObject p={p} g={g} />
            </div>
          </div>

          {/* Final */}
          <FinalOverlay p={p} />
        </div>
      </div>

      {/* piste de scroll */}
      <div className="h-[460vh]" aria-hidden="true" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* L'objet unique                                                      */
/* ------------------------------------------------------------------ */

function MorphObject({ p, g }: { p: number; g: Stage }) {
  const { t } = useI18n();

  const float = Math.sin(p * 34) * 4;
  const shellDark = band(p, 0.44, 0.52, 0.66, 0.72); // écran de consultation
  const kraft = band(p, 0.78, 0.84, 0.9, 0.94);
  const glass = seg(p, 0.9, 0.96) * (1 - seg(p, 1.0, 1.01));
  const phoneShell = band(p, 0, 0.04, 0.28, 0.34) + glass;

  const style: CSSProperties = {
    width: g.w,
    height: g.h,
    borderRadius: g.r,
    transform: `translateY(${float}px) rotateX(${g.rx}deg) rotateY(${g.ry}deg) scale(${g.s})`,
    transformStyle: "preserve-3d",
  };

  return (
    <div className="relative" style={style}>
      {/* couche matière : papier crème → écran sombre → kraft → verre */}
      <div
        className="absolute inset-0 border border-border bg-cream"
        style={{ borderRadius: g.r, boxShadow: "0 60px 120px -60px var(--foreground)" }}
      />
      <div
        className="absolute inset-0 bg-[var(--foreground)]"
        style={{ borderRadius: g.r, opacity: clamp(shellDark + phoneShell * 0.96) }}
      />
      <div
        className="absolute inset-0"
        style={{
          borderRadius: g.r,
          opacity: kraft,
          background:
            "repeating-linear-gradient(102deg, oklch(0.78 0.055 68) 0 3px, oklch(0.755 0.06 66) 3px 6px)",
          boxShadow: "inset 0 -40px 60px -40px oklch(0.5 0.06 60)",
        }}
      />
      {/* reflet très discret */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: g.r,
          opacity: 0.35 * (phoneShell + shellDark),
          background:
            "linear-gradient(120deg, oklch(1 0 0 / 0.14) 0%, oklch(1 0 0 / 0) 42%, oklch(1 0 0 / 0.06) 100%)",
        }}
      />

      {/* 01 — questionnaire */}
      <Layer o={band(p, 0.02, 0.07, 0.26, 0.31)}>
        <QuestionnaireScreen p={p} radius={g.r} />
      </Layer>

      {/* dossier (avant et après consultation) */}
      <Layer o={Math.max(band(p, 0.34, 0.4, 0.46, 0.5), band(p, 0.68, 0.71, 0.75, 0.79))}>
        <DossierScreen p={p} />
      </Layer>

      {/* 02 — consultation */}
      <Layer o={band(p, 0.5, 0.55, 0.66, 0.7)}>
        <ConsultationScreen p={p} />
      </Layer>

      {/* 03 — colis */}
      <Layer o={band(p, 0.8, 0.84, 0.9, 0.93)}>
        <ColisSurface />
      </Layer>

      {/* 04 — espace patient */}
      <Layer o={band(p, 0.94, 0.965, 1.02, 1.03)}>
        <SuiviScreen p={p} radius={g.r} />
      </Layer>

      {/* cartes qui s'échappent de l'écran puis s'organisent */}
      <FlyingCards p={p} />

      {/* annotations livraison */}
      <div
        className="absolute -right-4 top-6 hidden translate-x-full whitespace-nowrap rounded-full border border-border bg-cream px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:block"
        style={{ opacity: band(p, 0.83, 0.86, 0.9, 0.92) }}
      >
        {t("Emballage discret", "Discreet packaging")}
      </div>
      <div
        className="absolute -right-4 bottom-8 hidden translate-x-full whitespace-nowrap rounded-full border border-border bg-cream px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:block"
        style={{ opacity: band(p, 0.855, 0.885, 0.9, 0.92) }}
      >
        {t("Aucune mention médicale visible", "No medical wording visible")}
      </div>
    </div>
  );
}

function Layer({ o, children }: { o: number; children: React.ReactNode }) {
  if (o < 0.01) return null;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity: o, borderRadius: "inherit" }}>
      {children}
    </div>
  );
}

/* -------------------------- écrans -------------------------------- */

function QuestionnaireScreen({ p, radius }: { p: number; radius: number }) {
  const { t } = useI18n();
  const questions = [
    {
      q: t("Depuis combien de temps rencontrez-vous ce problème ?", "How long has this been going on?"),
      a: [
        t("Moins de 3 mois", "Less than 3 months"),
        t("3 à 6 mois", "3 to 6 months"),
        t("6 à 12 mois", "6 to 12 months"),
        t("Plus d'un an", "More than a year"),
      ],
      pick: 1,
    },
    {
      q: t("Suivez-vous un traitement actuellement ?", "Are you currently on any treatment?"),
      a: [t("Non", "No"), t("Oui, ponctuel", "Yes, occasional"), t("Oui, quotidien", "Yes, daily")],
      pick: 0,
    },
    {
      q: t("Avez-vous des antécédents médicaux ?", "Any medical history?"),
      a: [t("Aucun", "None"), t("Tension", "Blood pressure"), t("Cholestérol", "Cholesterol")],
      pick: 2,
    },
  ];
  const local = seg(p, 0.05, 0.28);
  const idx = Math.min(questions.length - 1, Math.floor(local * questions.length));
  const inner = (local * questions.length) % 1;
  const q = questions[idx] as (typeof questions)[number];
  const selected = inner > 0.45;
  const leaving = inner > 0.82 ? (inner - 0.82) / 0.18 : 0;

  return (
    <div
      className="flex h-full w-full flex-col bg-[var(--foreground)] p-5 text-cream"
      style={{ borderRadius: radius }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-sm tracking-[0.2em]">MAAN</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-60">
          {t("Questionnaire", "Questionnaire")}
        </span>
      </div>
      <div className="mt-4 h-[3px] w-full rounded-full bg-cream/15">
        <div
          className="h-[3px] rounded-full bg-clay transition-[width] duration-300"
          style={{ width: `${clamp(local) * 100}%` }}
        />
      </div>
      <div
        className="mt-8 flex-1"
        style={{ opacity: 1 - leaving, transform: `translateY(${-leaving * 14}px)` }}
      >
        <p className="text-balance font-display text-[17px] leading-snug">{q.q}</p>
        <div className="mt-5 space-y-2.5">
          {q.a.map((a, i) => (
            <div
              key={a}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3.5 py-3 text-[13px] transition-all duration-300",
                selected && i === q.pick
                  ? "border-clay bg-clay/20"
                  : "border-cream/15 bg-cream/[0.04]",
              )}
            >
              <span className="opacity-90">{a}</span>
              {selected && i === q.pick ? <Check className="h-3.5 w-3.5 text-clay" /> : null}
            </div>
          ))}
        </div>
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-45">
        {t("3 à 5 minutes · confidentiel", "3 to 5 minutes · confidential")}
      </p>
    </div>
  );
}

function FlyingCards({ p }: { p: number }) {
  const { t } = useI18n();
  const cards = [
    { label: t("Votre situation", "Your situation"), x: -260, y: -150 },
    { label: t("Vos antécédents", "Your history"), x: 250, y: -90 },
    { label: t("Vos traitements", "Your treatments"), x: -240, y: 120 },
    { label: t("Vos informations", "Your details"), x: 240, y: 160 },
  ];
  const out = seg(p, 0.26, 0.32); // sortie de l'écran
  const organize = seg(p, 0.32, 0.385); // alignement
  const absorb = seg(p, 0.385, 0.43); // intégration au dossier
  const o = band(p, 0.26, 0.29, 0.4, 0.44);
  if (o < 0.01) return null;

  return (
    <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {cards.map((c, i) => {
        const disp = ease(out) * (1 - ease(organize) * 0.55);
        const x = c.x * disp * (1 - ease(absorb));
        const y = mix(c.y * disp, (i - 1.5) * 34, ease(organize)) * (1 - ease(absorb));
        return (
          <div
            key={c.label}
            className="absolute left-1/2 top-1/2 w-[152px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-cream px-3 py-2 shadow-[0_20px_40px_-28px_var(--foreground)]"
            style={{
              opacity: o,
              transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${40 * (1 - ease(absorb))}px) rotate(${(i % 2 ? 2 : -2) * (1 - ease(organize))}deg)`,
            }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-clay">
              {t("Dossier", "File")}
            </p>
            <p className="mt-0.5 truncate text-[12px] font-medium">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function DossierScreen({ p }: { p: number }) {
  const { t } = useI18n();
  const lignes = [
    t("Questionnaire", "Questionnaire"),
    t("Informations", "Information"),
    t("Traitements actuels", "Current treatments"),
    t("Historique", "History"),
  ];
  const after = p > 0.66;
  return (
    <div className="flex h-full w-full flex-col justify-between bg-cream p-7">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
          {t("Votre dossier", "Your file")}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
          {lignes.map((l, i) => (
            <div
              key={l}
              className="flex items-center justify-between border-b border-border/70 pb-2"
              style={{ opacity: clamp(seg(p, 0.36 + i * 0.012, 0.4 + i * 0.012) + (after ? 1 : 0)) }}
            >
              <span className="text-[13px]">{l}</span>
              <Check className="h-3.5 w-3.5 text-clay" />
            </div>
          ))}
        </div>
      </div>
      {after ? (
        <div className="space-y-1.5">
          <p className="font-display text-lg tracking-tight">{t("Votre traitement", "Your treatment")}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Prescription transmise à la pharmacie", "Prescription sent to the pharmacy")}
          </p>
        </div>
      ) : (
        <p className="font-display text-lg tracking-tight">
          {t("Prêt pour votre consultation", "Ready for your consultation")}
        </p>
      )}
    </div>
  );
}

function ConsultationScreen({ p }: { p: number }) {
  const { t } = useI18n();
  const confirmed = band(p, 0.585, 0.61, 0.655, 0.67);
  const ended = seg(p, 0.655, 0.68);
  const look = Math.sin(p * 60) * 0.6;
  return (
    <div className="flex h-full w-full bg-[var(--foreground)] text-cream">
      {/* vidéo médecin */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={medecinVisio}
          alt={t("Médecin MAAN en consultation en ligne", "MAAN doctor during an online consultation")}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover"
          style={{ transform: `scale(1.05) translateX(${look}px)` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--foreground)] to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="font-display text-base tracking-tight">Dr. Julien Mercier</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-70">
            {t("Médecin · Consultation en cours", "Doctor · Consultation in progress")}
          </p>
        </div>
        {/* fenêtre patient */}
        <div className="absolute right-4 top-4 h-[74px] w-[56px] overflow-hidden rounded-lg border border-cream/25">
          <img src={patientVisio} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        {/* contrôles MAAN */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-cream/25">
            <Mic className="h-3.5 w-3.5" />
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-cream/25">
            <Video className="h-3.5 w-3.5" />
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-clay">
            <PhoneOff className="h-3.5 w-3.5" />
          </span>
        </div>
        {ended > 0.05 ? (
          <div
            className="absolute inset-0 grid place-items-center bg-[var(--foreground)]/85"
            style={{ opacity: ended }}
          >
            <div className="text-center">
              <Check className="mx-auto h-5 w-5 text-clay" />
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                {t("Consultation terminée", "Consultation completed")}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* dossier ouvert à côté */}
      <div className="hidden w-[240px] shrink-0 border-l border-cream/12 p-5 sm:block">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-clay">
          {t("Votre dossier", "Your file")}
        </p>
        <div className="mt-4 space-y-2.5">
          {[
            t("Votre situation", "Your situation"),
            t("Vos antécédents", "Your history"),
            t("Vos traitements", "Your treatments"),
          ].map((l) => (
            <div
              key={l}
              className="flex items-center justify-between rounded-lg border border-cream/12 px-3 py-2 text-[12px]"
            >
              <span className="opacity-85">{l}</span>
              <Check className="h-3 w-3 text-clay" />
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-lg border border-clay/50 bg-clay/15 px-3 py-2"
          style={{ opacity: confirmed }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-clay">
            {t("Information confirmée", "Information confirmed")}
          </p>
        </div>
      </div>
    </div>
  );
}

function ColisSurface() {
  const { t } = useI18n();
  return (
    <div className="relative h-full w-full">
      {/* rabats + ruban kraft */}
      <div className="absolute inset-x-0 top-1/2 h-[10px] -translate-y-1/2 bg-[oklch(0.72_0.07_64)]/70" />
      <div className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 bg-[oklch(0.72_0.07_64)]/45" />
      {/* étiquette logistique neutre */}
      <div className="absolute left-6 top-6 w-[128px] rounded-[4px] bg-cream/95 px-2.5 py-2 shadow-[0_10px_24px_-18px_var(--foreground)]">
        <div className="h-1 w-10 bg-foreground/70" />
        <div className="mt-1.5 space-y-1">
          <div className="h-[3px] w-full bg-foreground/25" />
          <div className="h-[3px] w-4/5 bg-foreground/20" />
          <div className="h-[3px] w-3/5 bg-foreground/15" />
        </div>
        <div className="mt-2 flex gap-[2px]">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="block h-4 bg-foreground/70"
              style={{ width: i % 3 === 0 ? 2 : 1 }}
            />
          ))}
        </div>
      </div>
      <p className="absolute bottom-5 right-6 font-mono text-[9px] uppercase tracking-[0.16em] text-[oklch(0.36_0.04_60)]">
        {t("Colis standard", "Standard parcel")}
      </p>
    </div>
  );
}

function SuiviScreen({ p, radius }: { p: number; radius: number }) {
  const { t } = useI18n();
  const notif = band(p, 0.965, 0.975, 1.05, 1.06);
  const message = seg(p, 0.978, 0.986);
  const sent = seg(p, 0.992, 0.998);
  return (
    <div
      className="flex h-full w-full flex-col bg-[var(--foreground)] p-5 text-cream"
      style={{ borderRadius: radius }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-sm tracking-[0.2em]">MAAN</span>
        <Bell className="h-3.5 w-3.5 opacity-60" />
      </div>
      <p className="mt-5 font-display text-xl tracking-tight">{t("Bonjour Thomas", "Hello Thomas")}</p>
      <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] opacity-55">
        {t("Votre parcours", "Your journey")}
      </p>
      <div className="mt-3 space-y-2">
        {[
          [t("Traitement", "Treatment"), true],
          [t("Livraison", "Delivery"), true],
        ].map(([l]) => (
          <div
            key={String(l)}
            className="flex items-center justify-between rounded-xl border border-cream/12 px-3 py-2.5 text-[13px]"
          >
            <span className="opacity-90">{String(l)}</span>
            <Check className="h-3.5 w-3.5 text-clay" />
          </div>
        ))}
        <div className="flex items-center justify-between rounded-xl border border-cream/12 px-3 py-2.5 text-[13px]">
          <span className="opacity-90">{t("Prochain suivi", "Next follow-up")}</span>
          <span className="font-mono text-[10px] opacity-70">{t("Dans 7 jours", "In 7 days")}</span>
        </div>
      </div>

      <div className="mt-auto space-y-2" style={{ opacity: notif }}>
        {message < 0.5 ? (
          <div className="rounded-xl border border-clay/50 bg-clay/15 px-3 py-2.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-clay">
              {t("Nouveau message de votre médecin", "New message from your doctor")}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-cream/15 bg-cream/[0.05] px-3 py-2.5">
            <p className="text-[12.5px] opacity-90">
              {t("Comment se passe votre traitement ?", "How is your treatment going?")}
            </p>
            {sent > 0.5 ? (
              <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-clay">
                <Check className="h-3 w-3" /> {t("Suivi envoyé", "Follow-up sent")}
              </p>
            ) : (
              <p className="mt-2 inline-block rounded-full bg-clay px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em]">
                {t("Faire mon suivi", "Send my follow-up")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------- final --------------------------------- */

function FinalOverlay({ p }: { p: number }) {
  const { t } = useI18n();
  const o = seg(p, 0.985, 1);
  if (o < 0.01) return null;
  return (
    <div
      className="absolute bottom-6 left-0 right-0 z-30 mx-auto max-w-6xl px-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
      style={{ opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}
    >
      <div className="max-w-[420px]"><p className="font-display text-3xl tracking-tight">MAAN</p>
      <p className="mt-2 text-balance font-display text-xl text-muted">
        {t("Votre santé. Dans un seul endroit.", "Your health. In one place.")}
      </p>
      <Link
        to="/questionnaire"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-cream transition-transform duration-300 hover:-translate-y-0.5"
      >
        {t("Commencer mon évaluation", "Start my assessment")} <span aria-hidden="true">→</span>
      </Link>
      </div>
    </div>
  );
}

/* -------------------- version sans animation ----------------------- */

function ParcoursStatic() {
  const { t } = useI18n();
  const items = [
    {
      n: "01",
      title: t("Questionnaire", "Questionnaire"),
      desc: t(
        "Quelques minutes pour parler de vous, depuis chez vous.",
        "A few minutes to tell us about you, from home.",
      ),
    },
    {
      n: "02",
      title: t("Consultation", "Consultation"),
      desc: t(
        "Votre dossier est transmis au médecin, vous échangez en ligne.",
        "Your file reaches the doctor, and you talk online.",
      ),
    },
    {
      n: "03",
      title: t("Livraison", "Delivery"),
      desc: t(
        "Traitement préparé par la pharmacie partenaire, livré discrètement.",
        "Prepared by our partner pharmacy, delivered discreetly.",
      ),
    },
    {
      n: "04",
      title: t("Suivi", "Follow-up"),
      desc: t(
        "Votre suivi et vos échanges restent dans votre espace MAAN.",
        "Your follow-up and messages stay in your MAAN space.",
      ),
    },
  ];
  return (
    <section id="parcours" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 lg:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
        {t("Le parcours", "How it works")}
      </p>
      <h2 className="mt-3 font-section text-3xl font-medium tracking-tight lg:text-4xl">
        {t("Quatre étapes. Sans déplacement.", "Four steps. Without leaving home.")}
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.n} className="border-t border-border pt-4">
            <p className="font-mono text-[10px] tracking-[0.18em] text-clay">{i.n}</p>
            <p className="mt-2 font-display text-lg tracking-tight">{i.title}</p>
            <p className="mt-2 text-sm text-muted">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
