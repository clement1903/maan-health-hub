import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type EtapeDetaillee = {
  n: string;
  title: string;
  duree: string;
  desc: string;
  micro: string[];
};

export const etapesDetaillees: EtapeDetaillee[] = [
  {
    n: "1",
    title: "Questionnaire médical",
    duree: "3 à 5 min",
    desc: "Vous décrivez votre situation, vos antécédents et vos traitements en cours.",
    micro: [
      "Création de votre espace patient sécurisé",
      "Questions ciblées sur le domaine concerné",
      "Antécédents, allergies et traitements en cours",
      "Envoi du dossier à l'équipe médicale",
    ],
  },
  {
    n: "2",
    title: "Décision médicale",
    duree: "sous 24 h ouvrées",
    desc: "Un médecin agréé évalue votre dossier et décide s'il délivre une ordonnance.",
    micro: [
      "Lecture du dossier par un médecin inscrit à l'Ordre",
      "Demande de précisions si nécessaire",
      "Ordonnance délivrée, ajustée, ou demande refusée avec motif",
      "Décision notifiée dans votre espace patient",
    ],
  },
  {
    n: "3",
    title: "Préparation en pharmacie",
    duree: "quelques heures",
    desc: "Si une ordonnance est délivrée, une pharmacie partenaire prépare le traitement.",
    micro: [
      "Transmission de l'ordonnance à la pharmacie agréée",
      "Contrôle pharmaceutique du dosage",
      "Conditionnement en colis neutre, sans mention",
    ],
  },
  {
    n: "4",
    title: "Livraison discrète",
    duree: "24 à 48 h",
    desc: "Le traitement prescrit est expédié chez vous ou en point relais.",
    micro: [
      "Numéro de suivi transporteur affiché",
      "Livraison discrète, sans signature de contenu",
      "Colis neutre, sans mention de contenu",
    ],
  },
  {
    n: "5",
    title: "Suivi médical",
    duree: "en continu",
    desc: "Après réception, le médecin reste joignable pour ajuster, renouveler ou arrêter le traitement.",
    micro: [
      "Point de suivi à J+7 puis à chaque renouvellement",
      "Signalement d'effets indésirables depuis l'espace patient",
      "Ajustement de dosage ou arrêt décidé par le médecin",
      "Historique complet conservé dans votre dossier",
    ],
  },
];


export function ParcoursProgress({ etapes }: { etapes: EtapeDetaillee[] }) {
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset["idx"]);
          setReached((prev) => Math.max(prev, idx + 1));
        }
      },
      { threshold: 0.4 },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [etapes.length]);

  const pct = Math.round((reached / etapes.length) * 100);

  return (
    <div className="mt-12">
      <div className="sticky top-20 z-10 -mx-6 mb-10 border-y border-border bg-background/85 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Progression du parcours
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-clay transition-[width] duration-700 ease-[var(--ease)]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-clay">{pct}%</span>
        </div>
      </div>

      <ol className="relative space-y-4 border-l border-border pl-8">
        {etapes.map((e, i) => {
          const done = reached > i;
          return (
            <li
              key={e.n}
              data-idx={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn(
                "relative rounded-[20px] border border-border bg-background p-7 transition-all duration-700 ease-[var(--ease)]",
                done
                  ? "opacity-100 shadow-[0_28px_70px_-55px_var(--foreground)]"
                  : "opacity-60",
              )}
            >
              <span
                className={cn(
                  "absolute -left-[2.6rem] top-7 grid h-8 w-8 place-items-center rounded-full border font-mono text-xs transition-all duration-700 ease-[var(--ease)]",
                  done
                    ? "border-clay bg-clay text-cream"
                    : "border-border bg-background text-muted",
                )}
              >
                {e.n}
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-section text-xl font-medium tracking-tight">{e.title}</h3>
                <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
                  {e.duree}
                </span>
              </div>
              <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">{e.desc}</p>
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {e.micro.map((m, j) => (
                  <li
                    key={m}
                    className="flex items-start gap-3 rounded-[12px] bg-cream px-4 py-3 text-sm text-foreground/85 transition-all duration-500"
                    style={{ transitionDelay: `${j * 60}ms` }}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] transition-colors duration-500",
                        done ? "border-clay bg-clay text-cream" : "border-border text-transparent",
                      )}
                    >
                      ✓
                    </span>
                    <span className="text-pretty">{m}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
