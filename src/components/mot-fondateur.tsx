import fondateurPhoto from "@/assets/fondateur.jpg";
import { HandwrittenSignature } from "@/components/handwritten-signature";
import { Reveal } from "@/components/reveal";
import { Tilt } from "@/components/magnetic";
import { useI18n } from "@/lib/i18n";


export function MotFondateur() {
  const { t } = useI18n();
  return (
    <section id="fondateur" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal>
            <Tilt>
              <figure className="relative overflow-hidden rounded-[2rem] border border-border bg-sand">
                <img
                  src={fondateurPhoto}
                  alt={t(
                    "Portrait du fondateur de MAAN, assis dans une lumière naturelle",
                    "Portrait of MAAN's founder, sitting in natural light",
                  )}
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
              {t("Le mot du fondateur", "A word from the founder")}
            </p>
            <h2 className="mt-3 text-3xl tracking-tight text-foreground lg:text-4xl">
              <HandwrittenSignature
                text={t(
                  "On passe tous par là, un jour ou l’autre.",
                  "We all go through this, sooner or later.",
                )}
                duration={3}
              />
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
              <p>
                {t(
                  "Perte de cheveux, poids qui s’installe, peau qui change, vie intime compliquée : ce sont des choses dont les hommes parlent peu, et souvent trop tard. Moi aussi je suis passé par là, avec cette impression étrange de ne pas oser en parler.",
                  "Hair loss, creeping weight gain, changing skin, a complicated intimate life: these are things men rarely talk about, and often too late. I went through it too, with that strange feeling of not daring to speak up.",
                )}
              </p>
              <p>
                {t(
                  "J’ai créé MAAN pour ça. Pour qu’on puisse poser ses questions simplement, être écouté par un professionnel de santé, et avancer sans jugement ni gêne, à son rythme et en toute confidentialité.",
                  "I created MAAN for that reason. So anyone can ask their questions simply, be heard by a healthcare professional, and move forward without judgment or embarrassment, at their own pace and in complete confidentiality.",
                )}
              </p>
              <p className="font-medium text-foreground">
                {t(
                  "Mon objectif est simple : aider chaque homme à reprendre la main sur sa santé et à regagner confiance en lui.",
                  "My goal is simple: help every man take control of his health and regain confidence in himself.",
                )}
              </p>
            </div>

            <p className="mt-8 text-2xl text-clay sm:text-3xl">
              <HandwrittenSignature
                text={t(
                  "Clement Losi, fondateur de MAAN",
                  "Clement Losi, founder of MAAN",
                )}
                duration={2.4}
                delay={2900}
              />
            </p>

          </Reveal>
        </div>
      </div>
    </section>
  );
}
