import { useState } from "react";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

type Temoignage = {
  initiale: string;
  age: string;
  domaine: string;
  texte: string;
};

const temoignages: Temoignage[] = [
  {
    initiale: "T.",
    age: "38 ans",
    domaine: "Sexual Management",
    texte:
      "Je repoussais ce rendez-vous depuis deux ans. Le questionnaire m'a permis de tout dire sans avoir à le formuler à voix haute. Le médecin a demandé des précisions avant de prescrire.",
  },
  {
    initiale: "K.",
    age: "45 ans",
    domaine: "Weight Management",
    texte:
      "On m'a expliqué qu'un traitement ne remplace pas le suivi. J'ai eu un plan clair, un point mensuel, et un refus sur un dosage que je demandais. Ça m'a rassuré, honnêtement.",
  },
  {
    initiale: "R.",
    age: "31 ans",
    domaine: "Hair Management",
    texte:
      "Le colis est arrivé sans aucune mention. Personne au bureau n'a pu deviner ce qu'il contenait. Le suivi photo tous les trois mois me tient dans la durée.",
  },
  {
    initiale: "N.",
    age: "52 ans",
    domaine: "Skin Management",
    texte:
      "J'apprécie que tout soit écrit : l'ordonnance, la posologie, les précautions. Je l'ai montrée à mon médecin traitant, qui a validé sans réserve.",
  },
];

export function Temoignages() {
  const [active, setActive] = useState(0);

  return (
    <section id="temoignages" className="scroll-mt-24 bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              (e) — Témoignages
            </p>
            <h2 className="mt-3 max-w-[24ch] text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Ils en parlent, anonymement.
            </h2>
          </div>
          <p className="max-w-[36ch] text-pretty text-sm text-muted">
            Témoignages recueillis avec accord, publiés sous initiale : aucun nom, aucune photo,
            aucune donnée de santé identifiable.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {temoignages.map((t, i) => (
            <Reveal
              key={t.initiale + t.domaine}
              delay={i * 80}
              className="h-full"
            >
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cn(
                  "flex h-full w-full cursor-pointer flex-col rounded-[20px] border border-border bg-background/60 p-7 text-left transition-all duration-500 ease-[var(--ease)] hover:-translate-y-1 hover:bg-background hover:shadow-[0_28px_70px_-50px_var(--foreground)]",
                  active === i && "border-clay bg-background",
                )}
              >
                <span className="font-display text-4xl leading-none text-clay/40">“</span>
                <p className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-foreground/90">
                  {t.texte}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border font-mono text-xs text-clay">
                    {t.initiale}
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {t.age} · {t.domaine}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
