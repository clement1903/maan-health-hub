import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShieldCheck, Lock, Scale, ArrowRight, Check } from "lucide-react";

import medecin1 from "@/assets/medecin-1.jpg";
import medecin2 from "@/assets/medecin-2.jpg";
import medecin3 from "@/assets/medecin-3.jpg";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * Données de démonstration.
 * Les numéros BIG ci-dessous sont fictifs et doivent être remplacés par
 * les données des vrais médecins partenaires.
 * `video` est prévu pour accueillir plus tard une micro-vidéo portrait.
 */
type Medecin = {
  id: string;
  nom: string;
  prenom: string;
  photo: string;
  video?: string;
  role: string;
  specialite: string;
  big: string;
  approche: string;
  qualifications: string[];
};

const buildMedecins = (t: (fr: string, en: string) => string): Medecin[] => [
  {
    id: "antoine-lemoine",
    nom: "Dr Antoine Lemoine",
    prenom: "Antoine",
    photo: medecin1,
    role: t("Médecin généraliste", "General practitioner"),
    specialite: "Sexual & Weight Management",
    big: "19912345678",
    approche: t(
      "Poser les bonnes questions avant de prescrire. Un traitement n'a de sens que s'il s'inscrit dans une situation médicale précise.",
      "Ask the right questions before prescribing. A treatment only makes sense if it fits a precise medical situation.",
    ),
    qualifications: [
      t("Docteur en médecine, inscrit à l'Ordre", "Doctor of Medicine, registered with the Medical Board"),
      t("12 ans de pratique en cabinet", "12 years of practice in private clinics"),
      t("DU nutrition et métabolisme", "Postgraduate diploma in nutrition and metabolism"),
    ],
  },
  {
    id: "marion-badel",
    nom: "Dr Marion Badel",
    prenom: "Marion",
    photo: medecin2,
    role: t("Dermatologue", "Dermatologist"),
    specialite: "Skin & Hair Management",
    big: "19923456789",
    approche: t(
      "Les résultats visibles demandent du temps. Je préfère annoncer un calendrier réaliste plutôt qu'une promesse.",
      "Visible results take time. I prefer setting a realistic timeline rather than a promise.",
    ),
    qualifications: [
      t("Spécialiste en dermatologie", "Specialist in dermatology"),
      t("Praticienne hospitalière pendant 8 ans", "Hospital practitioner for 8 years"),
      t("Formée à l'expertise dermatologique à distance", "Trained in remote dermatological assessment"),
    ],
  },
  {
    id: "serge-renard",
    nom: "Dr Serge Renard",
    prenom: "Serge",
    photo: medecin3,
    role: t("Médecin généraliste", "General practitioner"),
    specialite: "Sexual Management",
    big: "19934567890",
    approche: t(
      "Aucun jugement, aucune gêne. La consultation à distance permet souvent de parler plus librement de sujets intimes.",
      "No judgment, no embarrassment. Remote consultations often make it easier to speak freely about intimate topics.",
    ),
    qualifications: [
      t("Docteur en médecine, inscrit à l'Ordre", "Doctor of Medicine, registered with the Medical Board"),
      t("DU sexologie médicale", "Postgraduate diploma in medical sexology"),
      t("Membre d'un réseau de soins masculins", "Member of a men's healthcare network"),
    ],
  },
];

const buildGaranties = (t: (fr: string, en: string) => string) => [
  {
    t: t("Médecins BIG", "BIG-registered doctors"),
    d: t("Identité et inscription vérifiables.", "Identity and registration are verifiable."),
    icon: ShieldCheck,
  },
  {
    t: t("Secret médical", "Medical confidentiality"),
    d: t(
      "Vos informations médicales restent confidentielles.",
      "Your medical information remains confidential.",
    ),
    icon: Lock,
  },
  {
    t: t("Indépendance médicale", "Medical independence"),
    d: t(
      "Chaque médecin exerce son jugement professionnel en toute indépendance.",
      "Each doctor exercises their professional judgment in full independence.",
    ),
    icon: Scale,
  },
];

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

/** Ligne masquée qui se lève depuis un masque invisible. */
function MaskLine({
  children,
  shown,
  delay,
  reduced,
}: {
  children: React.ReactNode;
  shown: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span
        style={{ transitionDelay: reduced ? "0ms" : `${delay}ms` }}
        className={cn(
          "block transition-[transform,opacity] duration-[900ms] ease-[var(--ease)]",
          shown ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0",
        )}
      >
        {children}
      </span>
    </span>
  );
}

export function MedecinsSection() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const { ref: sectionRef, shown } = useReveal<HTMLElement>(0.15);
  const [active, setActive] = useState(0);
  const [verified, setVerified] = useState(false);
  const medecins = buildMedecins(t);
  const garanties = buildGaranties(t);
  const m = medecins[active]!;

  const cardsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [lineTop, setLineTop] = useState<number | null>(null);

  // Position de la fine ligne terracotta entre les deux colonnes (desktop).
  useLayoutEffect(() => {
    const update = () => {
      const card = cardsRef.current[active];
      const col = columnRef.current;
      if (!card || !col) return;
      setLineTop(card.offsetTop + card.offsetHeight / 2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active, medecins.length]);

  // Micro-interaction BIG : le ✓ apparaît peu après la sélection.
  useEffect(() => {
    setVerified(false);
    if (reduced) {
      setVerified(true);
      return;
    }
    const id = window.setTimeout(() => setVerified(true), 420);
    return () => window.clearTimeout(id);
  }, [active, reduced]);

  const seq = (ms: number) => (reduced ? "0ms" : `${ms}ms`);
  const rise = (delay: number) =>
    cn(
      "transition-[opacity,transform] duration-700 ease-[var(--ease)]",
      shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
    ) + ` [transition-delay:${delay}ms]`;

  return (
    <section
      ref={sectionRef}
      id="medecins"
      aria-labelledby="medecins-title"
      className="scroll-mt-24 border-y border-border bg-cream"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <p
          style={{ transitionDelay: seq(0) }}
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.2em] text-clay transition-[opacity,transform] duration-500 ease-[var(--ease)]",
            shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {t("Les médecins", "The doctors")}
        </p>

        <h2
          id="medecins-title"
          className="mt-3 max-w-[26ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl"
        >
          <MaskLine shown={shown} delay={reduced ? 0 : 120} reduced={reduced}>
            {t("Derrière chaque décision,", "Behind every decision,")}
          </MaskLine>
          <MaskLine shown={shown} delay={reduced ? 0 : 240} reduced={reduced}>
            <span className="relative inline-block">
              {t("un professionnel de santé ", "an identifiable healthcare ")}
              <span className="relative inline-block">
                {t("identifiable.", "professional.")}
                <span
                  aria-hidden
                  style={{ transitionDelay: seq(900) }}
                  className={cn(
                    "pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-full origin-left rounded-full bg-clay/70 transition-transform duration-[700ms] ease-[var(--ease)]",
                    shown ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            </span>
          </MaskLine>
        </h2>

        <p
          style={{ transitionDelay: seq(520) }}
          className={cn(
            "mt-4 max-w-[56ch] text-pretty text-muted transition-opacity duration-700 ease-[var(--ease)]",
            shown ? "opacity-100" : "opacity-0",
          )}
        >
          {t(
            "Les praticiens qui évaluent votre dossier sont des médecins certifiés BIG, vérifiables dans le registre officiel et tenus au secret médical.",
            "The practitioners who review your file are BIG-certified doctors, verifiable in the official register and bound by medical confidentiality.",
          )}
        </p>

        <div className="relative mt-10 flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {/* Colonne cartes */}
          <div
            ref={columnRef}
            role="tablist"
            aria-orientation="vertical"
            aria-label={t("Choisir un médecin", "Choose a doctor")}
            className="relative flex flex-col gap-4 lg:w-5/12"
          >
            {medecins.map((doc, i) => {
              const isActive = active === i;
              return (
                <button
                  key={doc.id}
                  ref={(el) => {
                    cardsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`medecin-tab-${doc.id}`}
                  aria-selected={isActive}
                  aria-controls="medecin-profil"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                      e.preventDefault();
                      const n = (i + 1) % medecins.length;
                      setActive(n);
                      cardsRef.current[n]?.focus();
                    }
                    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const n = (i - 1 + medecins.length) % medecins.length;
                      setActive(n);
                      cardsRef.current[n]?.focus();
                    }
                  }}
                  style={{ transitionDelay: shown ? seq(640 + i * 130) : "0ms" }}
                  className={cn(
                    "group relative cursor-pointer rounded-[16px] border border-border bg-background/60 p-5 text-left",
                    "transition-[opacity,transform,border-color,background-color,box-shadow] duration-300 ease-out",
                    "outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
                    shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                    !reduced && "hover:-translate-y-[3px]",
                    "hover:border-clay/45 hover:bg-background hover:shadow-[0_18px_40px_-40px_var(--foreground)]",
                    isActive &&
                      "border-clay bg-background shadow-[0_24px_60px_-45px_var(--foreground)]",
                  )}
                >
                  {/* marqueur non chromatique de sélection */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-5 bottom-5 w-[2px] origin-top rounded-full bg-clay transition-transform duration-300 ease-out",
                      isActive ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                  <div className="flex items-center gap-4">
                    <img
                      src={doc.photo}
                      alt={t(
                        `Portrait du ${doc.nom}, ${doc.role.toLowerCase()}`,
                        `Portrait of ${doc.nom}, ${doc.role.toLowerCase()}`,
                      )}
                      loading="lazy"
                      width={800}
                      height={800}
                      className={cn(
                        "h-16 w-16 shrink-0 rounded-full object-cover transition-[filter,transform,opacity] duration-300 ease-out",
                        isActive
                          ? "scale-[1.03] opacity-100 ring-2 ring-clay ring-offset-2 ring-offset-background [filter:grayscale(0)]"
                          : "opacity-90 [filter:grayscale(0.75)] group-hover:scale-[1.03] group-hover:opacity-100 group-hover:[filter:grayscale(0)]",
                      )}
                    />
                    <div>
                      <p className="font-display text-lg font-medium tracking-tight">{doc.nom}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {doc.role} · {doc.specialite}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-clay">
                        BIG {doc.big}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Fine ligne terracotta vers le profil (desktop uniquement) */}
            {lineTop !== null ? (
              <span
                aria-hidden
                style={{ top: lineTop }}
                className={cn(
                  "pointer-events-none absolute left-full hidden h-px w-6 origin-left bg-clay/50 transition-[top,transform,opacity] duration-500 ease-[var(--ease)] lg:block",
                  shown ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                )}
              />
            ) : null}
          </div>

          {/* Profil détaillé */}
          <div
            style={{ transitionDelay: seq(1000) }}
            className={cn(
              "transition-[opacity,transform] duration-700 ease-[var(--ease)] lg:w-7/12",
              shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <div
              id="medecin-profil"
              role="tabpanel"
              aria-labelledby={`medecin-tab-${m.id}`}
              className="flex h-full flex-col rounded-[20px] border border-border bg-background p-6"
            >
              <div key={m.id} className="flex h-full flex-col">
                <div
                  className={cn(
                    "flex items-center gap-4",
                    !reduced && "animate-[rise_0.4s_var(--ease)_both]",
                  )}
                >
                  <MedecinPortrait medecin={m} reduced={reduced} t={t} />
                  <div>
                    <p className="font-display text-xl font-medium tracking-tight">{m.nom}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {m.role} · {m.specialite}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-clay/30 bg-cream px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-clay">
                      {t("Certifié BIG", "BIG certified")} · {m.big}
                      <Check
                        aria-hidden
                        strokeWidth={2}
                        className={cn(
                          "h-3 w-3 transition-[opacity,transform] duration-500 ease-[var(--ease)]",
                          verified ? "scale-100 opacity-100" : "scale-75 opacity-0",
                        )}
                      />
                      <span className="sr-only">{t("Identité vérifiable", "Verifiable identity")}</span>
                    </p>
                  </div>
                </div>

                <div
                  style={{ animationDelay: reduced ? "0ms" : "90ms" }}
                  className={cn(!reduced && "animate-[rise_0.45s_var(--ease)_both]")}
                >
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
                    {t("Son approche", "Their approach")}
                  </p>
                  <p className="mt-2 text-pretty font-display text-xl font-medium leading-snug tracking-tight">
                    « {m.approche} »
                  </p>
                </div>

                <div
                  style={{ animationDelay: reduced ? "0ms" : "160ms" }}
                  className={cn(!reduced && "animate-[rise_0.45s_var(--ease)_both]")}
                >
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {t("Qualifications", "Qualifications")}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {m.qualifications.map((q) => (
                      <li key={q} className="flex items-start gap-3 text-sm text-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 divide-y divide-border/40 md:grid-cols-3 md:divide-x md:divide-y-0">
          {garanties.map((g, i) => (
            <Garantie key={g.t} garantie={g} index={i} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MedecinPortrait({
  medecin,
  reduced,
  t,
}: {
  medecin: Medecin;
  reduced: boolean;
  t: (fr: string, en: string) => string;
}) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(medecin.video);

  useEffect(() => setPlaying(false), [medecin.id]);

  return (
    <div className="group/portrait relative shrink-0">
      <button
        type="button"
        disabled={!hasVideo}
        onClick={() => hasVideo && setPlaying(true)}
        aria-label={
          hasVideo
            ? t(`Rencontrer le ${medecin.nom}`, `Meet ${medecin.nom}`)
            : t(`Portrait du ${medecin.nom}`, `Portrait of ${medecin.nom}`)
        }
        className="block overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default"
      >
        {playing && medecin.video ? (
          <video
            src={medecin.video}
            autoPlay
            playsInline
            controls
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <img
            src={medecin.photo}
            alt={t(`Portrait du ${medecin.nom}`, `Portrait of ${medecin.nom}`)}
            loading="lazy"
            width={800}
            height={800}
            className={cn(
              "h-16 w-16 rounded-full object-cover transition-transform duration-300 ease-out",
              !reduced && "group-hover/portrait:scale-[1.04]",
            )}
          />
        )}
      </button>
      {hasVideo ? (
        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-clay/30 bg-cream px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-clay opacity-0 transition-opacity duration-300 group-hover/portrait:opacity-100">
          {t(`Rencontrer le Dr ${medecin.prenom}`, `Meet Dr ${medecin.prenom}`)}
          <ArrowRight aria-hidden className="ml-1 inline h-3 w-3" />
        </span>
      ) : null}
    </div>
  );
}

function Garantie({
  garantie,
  index,
  reduced,
}: {
  garantie: { t: string; d: string; icon: typeof ShieldCheck };
  index: number;
  reduced: boolean;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.4);
  const Icon = garantie.icon;
  return (
    <div
      ref={ref}
      style={{ transitionDelay: reduced ? "0ms" : `${index * 135}ms` }}
      className={cn(
        "flex flex-col items-start px-2 py-6 transition-[opacity,transform] duration-700 ease-[var(--ease)] first:pl-0 last:pr-0 md:items-center md:px-6 md:py-0",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <span
        style={{ transitionDelay: reduced ? "0ms" : `${index * 135 + 90}ms` }}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-clay transition-transform duration-500 ease-[var(--ease)]",
          shown ? "scale-100" : "scale-90",
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <p className="mt-4 text-sm font-medium">{garantie.t}</p>
      <p className="mt-1 max-w-[34ch] text-pretty text-sm text-muted md:text-center">{garantie.d}</p>
    </div>
  );
}
