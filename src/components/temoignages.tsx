import { useState } from "react";
import { Play } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
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
      "Je repoussais ce rendez-vous depuis deux ans. Le questionnaire m'a permis de tout dire sans avoir à le formuler à voix haute. Le médecin a demandé des précisions avant de prescrire.",
      "I had been putting off this appointment for two years. The questionnaire let me say everything without having to voice it out loud. The doctor asked for details before prescribing.",
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
      "On m'a expliqué qu'un traitement ne remplace pas le suivi. J'ai eu un plan clair, un point mensuel, et un refus sur un dosage que je demandais. Ça m'a rassuré, honnêtement.",
      "I was told that a treatment doesn't replace follow-up. I got a clear plan, a monthly check-in, and a refusal on a dosage I had asked for. Honestly, that reassured me.",
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
      "Le colis est arrivé sans aucune mention. Personne au bureau n'a pu deviner ce qu'il contenait. Le suivi photo tous les trois mois me tient dans la durée.",
      "The package arrived with no markings at all. No one at the office could guess what was inside. The photo follow-up every three months keeps me on track.",
    ),
    photo: temoin3,
  },
  {
    id: "nicolas",
    prenom: "Nicolas",
    age: t("52 ans", "52 years old"),
    domaine: "Skin Management",
    texte: t(
      "J'apprécie que tout soit écrit : l'ordonnance, la posologie, les précautions. Je l'ai montrée à mon médecin traitant, qui a validé sans réserve.",
      "I appreciate that everything is written down: the prescription, the dosage, the precautions. I showed it to my regular doctor, who approved it without reservation.",
    ),
    photo: temoin4,
  },
];

export function Temoignages() {
  const { t } = useI18n();
  const temoignages = buildTemoignages(t);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="temoignages" className="scroll-mt-24 bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              {t("Témoignages", "Testimonials")}
            </p>
            <h2 className="mt-3 max-w-[24ch] text-balance font-section text-3xl font-medium tracking-tight lg:text-4xl">
              {t("Ces hommes, ils parlent de MAAN.", "These men talk about MAAN.")}
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {temoignages.map((tm, i) => (
            <Reveal key={tm.prenom} delay={i * 80} className="h-full">
              <article
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "flex h-full w-full flex-col rounded-[20px] border border-border bg-background/60 p-7 text-left transition-all duration-500 ease-[var(--ease)] hover:-translate-y-1 hover:bg-background hover:shadow-[0_28px_70px_-50px_var(--foreground)]",
                  active === i && "border-clay bg-background",
                )}
              >
                {tm.video ? (
                  <div className="relative mb-6 overflow-hidden rounded-[16px] border border-border bg-sand">
                    {playing === tm.video ? (
                      <video
                        src={tm.video}
                        poster={tm.photo}
                        controls
                        autoPlay
                        playsInline
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlaying(tm.video!)}
                        className="group relative block w-full"
                        aria-label={t(
                          `Voir le témoignage vidéo de ${tm.prenom}`,
                          `Watch ${tm.prenom}'s video testimonial`,
                        )}
                      >
                        <img
                          src={tm.photo}
                          alt={t(
                            `${tm.prenom}, ${tm.age}, patient MAAN`,
                            `${tm.prenom}, ${tm.age}, MAAN patient`,
                          )}
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
                          {t("Témoignage vidéo", "Video testimonial")}
                        </span>
                      </button>
                    )}
                  </div>
                ) : null}

                <span className="font-display text-4xl leading-none text-clay/40">“</span>
                <p className="mt-2 flex-1 text-pretty text-[15px] leading-relaxed text-foreground/90">
                  {tm.texte}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <img
                    src={tm.photo}
                    alt={t(`Portrait de ${tm.prenom}`, `Portrait of ${tm.prenom}`)}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="size-10 rounded-full object-cover"
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {tm.prenom} · {tm.age} · {tm.domaine}
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
