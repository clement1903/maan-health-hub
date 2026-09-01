import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Scale, Check } from "lucide-react";

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
 */
type Medecin = {
  id: string;
  nom: string;
  photo: string;
  role: string;
  specialite: string;
  big: string;
  approche: string;
  qualifications: string[];
  gradient: string;
};

const buildMedecins = (t: (fr: string, en: string) => string): Medecin[] => [
  {
    id: "antoine-lemoine",
    nom: "Dr Antoine Lemoine",
    photo: medecin1,
    role: t("Médecin généraliste", "General practitioner"),
    specialite: t("Sexuel & Poids", "Sexual & Weight"),
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
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--amber) 40%, var(--cream)), color-mix(in oklab, var(--clay) 22%, var(--cream)))",
  },
  {
    id: "marion-badel",
    nom: "Dr Marion Badel",
    photo: medecin2,
    role: t("Dermatologue", "Dermatologist"),
    specialite: t("Peau & Cheveux", "Skin & Hair"),
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
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--sand) 70%, var(--cream)), var(--cream))",
  },
  {
    id: "serge-renard",
    nom: "Dr Serge Renard",
    photo: medecin3,
    role: t("Médecin généraliste", "General practitioner"),
    specialite: t("Santé sexuelle", "Sexual health"),
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
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--clay) 16%, var(--cream)), var(--cream))",
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

/**
 * Carte médecin — même langage que les cartes « Nos soins » :
 * recto teinté, verso foncé, retournement au clic.
 */
function MedecinCard({ medecin }: { medecin: Medecin }) {
  const { t } = useI18n();
  const [flipped, setFlipped] = useState(false);
  const [verified, setVerified] = useState(false);

  // Le ✓ BIG apparaît peu après le retournement.
  useEffect(() => {
    if (!flipped) {
      setVerified(false);
      return;
    }
    const id = window.setTimeout(() => setVerified(true), 420);
    return () => window.clearTimeout(id);
  }, [flipped]);

  return (
    <div className="min-h-[320px] [perspective:1200px] lg:min-h-[360px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? t("Revenir au recto de la carte", "Flip the card back")
            : t(
                `Retourner la carte pour découvrir le ${medecin.nom}`,
                `Flip the card to meet ${medecin.nom}`,
              )
        }
        className="group grid h-full w-full text-left [transform-style:preserve-3d]"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 650ms var(--ease)",
          willChange: "transform",
        }}
      >
        {/* RECTO */}
        <span
          className={cn(
            "col-start-1 row-start-1 flex h-full w-full overflow-hidden rounded-[28px] p-6 shadow-[0_20px_50px_-40px_var(--foreground)] transition-shadow duration-500 [backface-visibility:hidden] lg:p-8",
            "group-hover:shadow-[0_50px_100px_-45px_var(--foreground)]",
          )}
          style={{ background: medecin.gradient, transform: "translateZ(1px)" }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55),transparent_65%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="relative z-10 flex w-full flex-col justify-between">
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-clay-deep/70">
                {medecin.specialite}
              </span>
              <span className="mt-3 flex items-center gap-4">
                <img
                  src={medecin.photo}
                  alt={t(`Portrait du ${medecin.nom}`, `Portrait of ${medecin.nom}`)}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-14 w-14 shrink-0 rounded-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
                <span className="block text-balance font-section text-2xl font-medium leading-[1.05] tracking-tight text-foreground lg:text-[1.7rem]">
                  {medecin.nom}
                </span>
              </span>
              <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/55">
                {medecin.role} · BIG {medecin.big}
              </span>
              <span className="mt-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
                {t("Son approche", "Their approach")}
              </span>
              <span className="mt-2 block max-w-[34ch] text-pretty font-display text-[15px] font-medium leading-snug tracking-tight text-foreground/90 lg:text-base">
                « {medecin.approche} »
              </span>
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 group-hover:gap-3 group-hover:text-foreground">
              {t("Retourner la carte", "Flip the card")}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-180">⟳</span>
            </span>
          </span>
        </span>

        {/* VERSO */}
        <span
          aria-hidden={!flipped}
          className="col-start-1 row-start-1 flex h-full w-full overflow-hidden rounded-[28px] bg-foreground shadow-[0_20px_50px_-40px_var(--foreground)] [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg) translateZ(1px)" }}
        >
          <span className="flex w-full flex-col justify-between gap-4 p-6 lg:p-8">
            <span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-cream/80">
                {t("Certifié BIG", "BIG certified")} · {medecin.big}
                <Check
                  aria-hidden
                  strokeWidth={2}
                  className={cn(
                    "h-3 w-3 text-clay transition-[opacity,transform] duration-500 ease-[var(--ease)]",
                    verified ? "scale-100 opacity-100" : "scale-75 opacity-0",
                  )}
                />
                <span className="sr-only">{t("Identité vérifiable", "Verifiable identity")}</span>
              </span>
              <span className="mt-5 block font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50">
                {t("Qualifications", "Qualifications")}
              </span>
              <span className="mt-2 block space-y-2">
                {medecin.qualifications.map((q) => (
                  <span key={q} className="flex items-start gap-2.5 text-[13px] text-cream/75">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {q}
                  </span>
                ))}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cream/70 transition-all duration-300 group-hover:gap-3 group-hover:text-cream">
              {t("Retourner la carte", "Flip the card")}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:-rotate-180">⟳</span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

export function MedecinsSection() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const { ref: sectionRef, shown } = useReveal<HTMLElement>(0.15);
  const medecins = buildMedecins(t);
  const garanties = buildGaranties(t);

  const seq = (ms: number) => (reduced ? "0ms" : `${ms}ms`);

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

        <div
          style={{ transitionDelay: seq(640) }}
          className={cn(
            "mt-10 grid grid-cols-1 gap-4 transition-[opacity,transform] duration-700 ease-[var(--ease)] sm:grid-cols-2 lg:grid-cols-3",
            shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          {medecins.map((doc) => (
            <MedecinCard key={doc.id} medecin={doc} />
          ))}
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
