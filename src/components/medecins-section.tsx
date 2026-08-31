import { useState } from "react";

import medecin1 from "@/assets/medecin-1.jpg";
import medecin2 from "@/assets/medecin-2.jpg";
import medecin3 from "@/assets/medecin-3.jpg";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Medecin = {
  nom: string;
  photo: string;
  role: string;
  specialite: string;
  big: string;
  approche: string;
  qualifications: string[];
};

const buildMedecins = (t: (fr: string, en: string) => string): Medecin[] => [
  {
    nom: "Dr Antoine Lemoine",
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
    nom: "Dr Marion Badel",
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
    nom: "Dr Serge Renard",
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
    t: t("Identité vérifiée", "Verified identity"),
    d: t(
      "Chaque médecin est certifié BIG : son numéro d'enregistrement est contrôlé avant tout accès aux dossiers.",
      "Every doctor is BIG certified: their registration number is checked before any file access.",
    ),
  },
  {
    t: t("Secret médical", "Medical confidentiality"),
    d: t(
      "Vos réponses sont couvertes par le secret médical et ne sont lisibles que par le praticien en charge de votre dossier.",
      "Your answers are protected by medical confidentiality and can only be read by the practitioner handling your file.",
    ),
  },
  {
    t: t("Liberté de refus", "Freedom to decline"),
    d: t(
      "Un médecin peut refuser une demande, demander des précisions ou vous orienter vers une consultation physique.",
      "A doctor may decline a request, ask for further details, or refer you to an in-person consultation.",
    ),
  },
];

export function MedecinsSection() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const medecins = buildMedecins(t);
  const garanties = buildGaranties(t);
  const m = medecins[active]!;

  return (
    <section id="medecins" className="scroll-mt-24 border-y border-border bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Les médecins", "The doctors")}
          </p>
          <h2 className="mt-3 max-w-[26ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
            {t(
              "Derrière chaque décision, un professionnel de santé identifiable.",
              "Behind every decision, an identifiable healthcare professional.",
            )}
          </h2>
          <p className="mt-4 max-w-[56ch] text-pretty text-muted">
            {t(
              "Les praticiens qui évaluent votre dossier sont des médecins agréés, inscrits à l'Ordre et tenus au secret médical.",
              "The practitioners who review your file are licensed doctors, registered with the Medical Board and bound by medical confidentiality.",
            )}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-2 lg:col-span-5">
            {medecins.map((doc, i) => (
              <button
                key={doc.nom}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  "group cursor-pointer rounded-[16px] border border-border bg-background/60 p-4 text-left transition-all duration-500 ease-[var(--ease)] hover:bg-background",
                  active === i &&
                    "border-clay bg-background shadow-[0_24px_60px_-45px_var(--foreground)]",
                )}
              >
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
                      "h-14 w-14 shrink-0 rounded-full object-cover transition-all duration-500 ease-[var(--ease)]",
                      active === i
                        ? "ring-2 ring-clay ring-offset-2 ring-offset-background"
                        : "grayscale group-hover:grayscale-0",
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
            ))}
          </div>

          <div className="rounded-[20px] border border-border bg-background p-7 lg:col-span-7">
            <div className="flex items-center gap-4">
              <img
                src={m.photo}
                alt={t(`Portrait du ${m.nom}`, `Portrait of ${m.nom}`)}
                loading="lazy"
                width={800}
                height={800}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <p className="font-display text-xl font-medium tracking-tight">{m.nom}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {m.role}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-clay/30 bg-cream px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-clay">
                  {t("Certifié BIG", "BIG certified")} · {m.big}
                </p>
              </div>
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
              {t("Son approche", "Their approach")}
            </p>
            <p
              key={m.nom}
              className="mt-3 animate-[rise_0.5s_var(--ease)_both] text-pretty font-display text-xl font-medium leading-snug tracking-tight"
            >
              « {m.approche} »
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {t("Qualifications", "Qualifications")}
            </p>
            <ul className="mt-3 space-y-2">
              {m.qualifications.map((q) => (
                <li key={q} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {garanties.map((g, i) => (
            <Reveal
              key={g.t}
              delay={i * 80}
              className="rounded-[16px] border border-border bg-background/60 p-6"
            >
              <p className="text-sm font-medium">{g.t}</p>
              <p className="mt-1 text-pretty text-sm text-muted">{g.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
