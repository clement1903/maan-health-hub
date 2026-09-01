import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import campaign from "@/assets/hair/campaign-hero.jpg";
import macroHair from "@/assets/hair/03-macro-hair.jpg";
import follicle from "@/assets/hair/06-follicle.jpg";
import follicleMini from "@/assets/hair/07-follicle-mini.jpg";

/* Une image. Une phrase. Une seule micro-animation. */

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

export function HairCampaign() {
  const { t, lang } = useI18n();
  const hero = useInView<HTMLDivElement>(0.3);

  return (
    <>
      {/* 01 — Campagne visuelle */}
      <section className="border-b border-border bg-cream">
        <div
          ref={hero.ref}
          className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-12 lg:py-28"
        >
          <div className="lg:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
              {t("Hair Management", "Hair Management")}
            </p>
            <h2 className="mt-6 text-balance font-section text-[2.6rem] font-medium leading-[0.98] tracking-tight lg:text-[4.6rem]">
              {t("Perte de cheveux,", "Losing your hair,")}
              <br />
              {t("perte d'identité ?", "losing yourself?")}
            </h2>
            <p className="mt-8 max-w-[40ch] text-pretty text-lg leading-relaxed text-foreground/80">
              {t(
                "La perte de cheveux peut changer bien plus que votre apparence.",
                "Hair loss can change far more than your appearance.",
              )}
            </p>
            <p className="mt-3 max-w-[40ch] text-pretty text-muted">
              {t(
                "Comprendre ce qui se passe est déjà une première étape.",
                "Understanding what is happening is already a first step.",
              )}
            </p>
            <div className="mt-10">
              <Link
                to="/questionnaire/$slug"
                params={{ slug: "cheveux" }}
                className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:gap-3 hover:bg-clay-deep"
              >
                {t("Comprendre ma perte de cheveux", "Understand my hair loss")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure className="relative overflow-hidden rounded-[26px] bg-cream">
              <img
                src={campaign}
                alt={t(
                  "Portrait d'un homme d'une trentaine d'années dont la ligne capillaire se fond doucement dans le fond crème",
                  "Portrait of a man in his thirties whose hairline softly dissolves into the cream background",
                )}
                width={1536}
                height={1152}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              {/* micro-animation unique : le haut du portrait s'efface une fois */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-[linear-gradient(180deg,var(--cream,#f3ece2)_18%,transparent)] transition-opacity duration-[1600ms] ease-[var(--ease)] motion-reduce:transition-none",
                  hero.seen ? "opacity-100" : "opacity-0",
                )}
              />
            </figure>
            <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              MAAN — {t("Campagne Hair Management", "Hair Management campaign")}
            </figcaption>
          </div>
        </div>
      </section>

      {/* 02 — Comprendre */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Comprendre", "Understand")}
          </p>
          <h2 className="mt-4 max-w-[18ch] text-balance font-section text-4xl font-medium leading-[1.05] tracking-tight lg:text-5xl">
            {t("Ce qui se passe sous la surface.", "What happens beneath the surface.")}
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                src: macroHair,
                n: "01",
                fr: "Le cheveu",
                en: "The hair",
                dfr: "Chaque cheveu pousse, se repose, puis tombe : un cycle naturel qui se répète.",
                den: "Each hair grows, rests, then falls: a natural cycle that repeats.",
              },
              {
                src: follicle,
                n: "02",
                fr: "Le follicule",
                en: "The follicle",
                dfr: "Sous la peau, le follicule est l'organe qui fabrique le cheveu à chaque cycle.",
                den: "Under the skin, the follicle is the organ that produces the hair at every cycle.",
              },
              {
                src: follicleMini,
                n: "03",
                fr: "La miniaturisation",
                en: "Miniaturization",
                dfr: "Au fil des cycles, certains follicules produisent un cheveu plus fin et plus court.",
                den: "Over successive cycles, some follicles produce a finer, shorter hair.",
              },
            ].map((s) => (
              <figure key={s.n} className="overflow-hidden rounded-[20px] border border-border bg-cream">
                <img
                  src={s.src}
                  alt={lang === "en" ? s.en : s.fr}
                  width={1600}
                  height={1200}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
                    {s.n} · {lang === "en" ? s.en : s.fr}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {lang === "en" ? s.den : s.dfr}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Vous n'êtes pas seul */}
      <section className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-6 py-24 lg:grid-cols-12 lg:py-32">
          <h2 className="text-balance font-section text-4xl font-medium leading-[1.05] tracking-tight lg:col-span-6 lg:text-6xl">
            {t("Vous êtes loin d'être le seul.", "You are far from the only one.")}
          </h2>
          <div className="lg:col-span-6">
            <p className="font-display text-5xl font-semibold tracking-tight text-clay lg:text-7xl">
              {t("[STATISTIQUE À SOURCER]", "[STATISTIC TO SOURCE]")}
            </p>
            <p className="mt-4 max-w-[38ch] text-pretty text-muted">
              {t(
                "Proportion d'hommes concernés par une perte de cheveux d'origine androgénétique.",
                "Share of men affected by androgenetic hair loss.",
              )}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {t("[SOURCE À AJOUTER]", "[SOURCE TO ADD]")}
            </p>
          </div>
        </div>
      </section>

      {/* 04 — Les options */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center lg:py-24">
          <h2 className="mx-auto max-w-[20ch] text-balance font-section text-3xl font-medium leading-[1.1] tracking-tight lg:text-5xl">
            {t("Et il existe des options.", "And there are options.")}
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-pretty text-muted">
            {t(
              "Découvrez les traitements disponibles avec MAAN.",
              "Discover the treatments available with MAAN.",
            )}
          </p>
        </div>
      </section>
    </>
  );
}
