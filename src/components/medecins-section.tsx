import { useState } from "react";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

type Medecin = {
  initiales: string;
  role: string;
  specialite: string;
  approche: string;
  qualifications: string[];
};

const medecins: Medecin[] = [
  {
    initiales: "Dr. A. L.",
    role: "Médecin généraliste",
    specialite: "Sexual & Weight Management",
    approche:
      "Poser les bonnes questions avant de prescrire. Un traitement n'a de sens que s'il s'inscrit dans une situation médicale précise.",
    qualifications: [
      "Docteur en médecine, inscrit à l'Ordre",
      "12 ans de pratique en cabinet",
      "DU nutrition et métabolisme",
    ],
  },
  {
    initiales: "Dr. M. B.",
    role: "Dermatologue",
    specialite: "Skin & Hair Management",
    approche:
      "Les résultats visibles demandent du temps. Je préfère annoncer un calendrier réaliste plutôt qu'une promesse.",
    qualifications: [
      "Spécialiste en dermatologie",
      "Praticienne hospitalière pendant 8 ans",
      "Formée à la téléexpertise dermatologique",
    ],
  },
  {
    initiales: "Dr. S. R.",
    role: "Médecin généraliste",
    specialite: "Sexual Management",
    approche:
      "Aucun jugement, aucune gêne. La consultation à distance permet souvent de parler plus librement de sujets intimes.",
    qualifications: [
      "Docteur en médecine, inscrit à l'Ordre",
      "DU sexologie médicale",
      "Membre d'un réseau de soins masculins",
    ],
  },
];

const garanties = [
  {
    t: "Identité vérifiée",
    d: "Chaque médecin est inscrit à l'Ordre et son numéro RPPS est contrôlé avant tout accès aux dossiers.",
  },
  {
    t: "Secret médical",
    d: "Vos réponses sont couvertes par le secret médical et ne sont lisibles que par le praticien en charge de votre dossier.",
  },
  {
    t: "Liberté de refus",
    d: "Un médecin peut refuser une demande, demander des précisions ou vous orienter vers une consultation physique.",
  },
];

export function MedecinsSection() {
  const [active, setActive] = useState(0);
  const m = medecins[active]!;

  return (
    <section id="medecins" className="scroll-mt-24 border-y border-border bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            (c) — Les médecins
          </p>
          <h2 className="mt-3 max-w-[26ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
            Derrière chaque décision, un médecin identifiable.
          </h2>
          <p className="mt-4 max-w-[56ch] text-pretty text-muted">
            Les praticiens qui évaluent votre dossier sont des médecins agréés, tenus au secret
            médical. Leurs initiales protègent leur vie privée comme la vôtre.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-2 lg:col-span-5">
            {medecins.map((doc, i) => (
              <button
                key={doc.initiales}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  "group cursor-pointer rounded-[16px] border border-border bg-background/60 p-5 text-left transition-all duration-500 ease-[var(--ease)] hover:bg-background",
                  active === i &&
                    "border-clay bg-background shadow-[0_24px_60px_-45px_var(--foreground)]",
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border font-mono text-[11px] tracking-tight text-clay transition-colors",
                      active === i && "border-clay bg-clay text-cream",
                    )}
                  >
                    {doc.initiales.replace("Dr. ", "").replace(/[.\s]/g, "")}
                  </span>
                  <div>
                    <p className="font-display text-lg font-medium tracking-tight">
                      {doc.initiales}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {doc.role} · {doc.specialite}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-[20px] border border-border bg-background p-7 lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
              Son approche
            </p>
            <p
              key={m.initiales}
              className="mt-3 animate-[rise_0.5s_var(--ease)_both] text-pretty font-display text-xl font-medium leading-snug tracking-tight"
            >
              « {m.approche} »
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Qualifications
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
