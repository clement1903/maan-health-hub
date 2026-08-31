import { useState } from "react";
import { Play } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

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

const temoignages: Temoignage[] = [
  {
    id: "thomas",
    prenom: "Thomas",
    age: "38 ans",
    domaine: "Sexual Management",
    texte:
      "Je repoussais ce rendez-vous depuis deux ans. Le questionnaire m'a permis de tout dire sans avoir à le formuler à voix haute. Le médecin a demandé des précisions avant de prescrire.",
    photo: temoin1,
    video: video1.url,
  },
  {
    id: "karim",
    prenom: "Karim",
    age: "45 ans",
    domaine: "Weight Management",
    texte:
      "On m'a expliqué qu'un traitement ne remplace pas le suivi. J'ai eu un plan clair, un point mensuel, et un refus sur un dosage que je demandais. Ça m'a rassuré, honnêtement.",
    photo: temoin2,
    video: video2.url,
  },
  {
    id: "romain",
    prenom: "Romain",
    age: "31 ans",
    domaine: "Hair Management",
    texte:
      "Le colis est arrivé sans aucune mention. Personne au bureau n'a pu deviner ce qu'il contenait. Le suivi photo tous les trois mois me tient dans la durée.",
    photo: temoin3,
  },
  {
    id: "nicolas",
    prenom: "Nicolas",
    age: "52 ans",
    domaine: "Skin Management",
    texte:
      "J'apprécie que tout soit écrit : l'ordonnance, la posologie, les précautions. Je l'ai montrée à mon médecin traitant, qui a validé sans réserve.",
    photo: temoin4,
  },
];

export function Temoignages() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="temoignages" className="scroll-mt-24 bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Témoignages
            </p>
            <h2 className="mt-3 max-w-[24ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
              Ces hommes, ils parlent de MAAN.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {temoignages.map((t, i) => (
            <Reveal key={t.prenom} delay={i * 80} className="h-full">
              <article
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "flex h-full w-full flex-col rounded-[20px] border border-border bg-background/60 p-7 text-left transition-all duration-500 ease-[var(--ease)] hover:-translate-y-1 hover:bg-background hover:shadow-[0_28px_70px_-50px_var(--foreground)]",
                  active === i && "border-clay bg-background",
                )}
              >
                {t.video ? (
                  <div className="relative mb-6 overflow-hidden rounded-[16px] border border-border bg-sand">
                    {playing === t.video ? (
                      <video
                        src={t.video}
                        poster={t.photo}
                        controls
                        autoPlay
                        playsInline
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlaying(t.video!)}
                        className="group relative block w-full"
                        aria-label={`Voir le témoignage vidéo de ${t.prenom}`}
                      >
                        <img
                          src={t.photo}
                          alt={`${t.prenom}, ${t.age}, patient MAAN`}
                          loading="lazy"
                          width={768}
                          height={768}
                          className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.03]"
                        />
                        <span className="absolute inset-0 grid place-items-center bg-foreground/15 transition-colors group-hover:bg-foreground/25">
                          <span className="grid size-14 place-items-center rounded-full bg-cream/95 text-clay shadow-[0_18px_40px_-18px_var(--foreground)] transition-transform duration-300 group-hover:scale-110">
                            <Play className="size-5 translate-x-[1px] fill-current" />
                          </span>
                        </span>
                        <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay backdrop-blur">
                          Témoignage vidéo
                        </span>
                      </button>
                    )}
                  </div>
                ) : null}

                <span className="font-display text-4xl leading-none text-clay/40">“</span>
                <p className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-foreground/90">
                  {t.texte}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <img
                    src={t.photo}
                    alt={`Portrait de ${t.prenom}`}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="size-10 rounded-full object-cover"
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {t.prenom} · {t.age} · {t.domaine}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
