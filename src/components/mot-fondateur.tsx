import fondateurPhoto from "@/assets/fondateur.jpg";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/magnetic";

export function MotFondateur() {
  return (
    <section id="fondateur" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal>
            <Tilt>
              <figure className="relative overflow-hidden rounded-[2rem] border border-border bg-sand">
                <img
                  src={fondateurPhoto}
                  alt="Portrait du fondateur de MAAN, assis dans une lumière naturelle"
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </figure>
            </Tilt>
          </Reveal>

          <Reveal delay={120}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              Le mot du fondateur
            </p>
            <h2 className="mt-3 font-section text-3xl font-medium tracking-tight lg:text-4xl">
              On passe tous par là, un jour ou l’autre.
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
              <p>
                Perte de cheveux, poids qui s’installe, peau qui change, vie
                intime compliquée : ce sont des choses dont les hommes parlent
                peu, et souvent trop tard. Moi aussi je suis passé par là, avec
                cette impression étrange de ne pas oser en parler.
              </p>
              <p>
                J’ai créé MAAN pour ça. Pour qu’on puisse poser ses questions
                simplement, être écouté par un professionnel de santé, et
                avancer sans jugement ni gêne, à son rythme et en toute
                confidentialité.
              </p>
              <p className="font-medium text-foreground">
                Mon objectif est simple : aider chaque homme à reprendre la main
                sur sa santé et à regagner confiance en lui.
              </p>
            </div>

            <p className="mt-8 font-signature text-3xl text-clay">
              Le fondateur de MAAN
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
