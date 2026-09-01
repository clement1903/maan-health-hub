import { useI18n } from "@/lib/i18n";

import macroHair from "@/assets/hair/03-macro-hair.jpg";
import follicle from "@/assets/hair/06-follicle.jpg";
import follicleMini from "@/assets/hair/07-follicle-mini.jpg";

export function HairCampaign() {
  const { t, lang } = useI18n();

  return (
    <>
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
