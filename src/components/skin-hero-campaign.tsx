import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import skin01 from "@/assets/skin/skin-campaign-01.jpg";
import skin02 from "@/assets/skin/skin-campaign-02b.jpg";

/**
 * Hero « diptyque photographique » de la page Skin Management.
 * Une seule scène plein écran : les deux photographies côte à côte,
 * la révélation et le CTA viennent se superposer en fondu,
 * comme la campagne Weight Management.
 */
export function SkinHeroCampaign() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 120),
      window.setTimeout(() => setStep(2), 700),
      window.setTimeout(() => setStep(3), 1600),
      window.setTimeout(() => setStep(4), 2200),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const fade = (visible: boolean, delayClass = "") =>
    `transition-all duration-700 ease-out ${delayClass} ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#100c09] text-[#f3ece2]">
      {/* DIPTYQUE PLEIN ÉCRAN */}
      <div className="grid min-h-[100svh] grid-cols-1 md:grid-cols-[1.15fr_1fr]">
        {/* IMAGE 01 */}
        <figure className={`relative ${fade(step >= 1)}`}>
          <img
            src={skin01}
            alt={t(
              "Un homme élégant arrive au desk d'un restaurant haut de gamme, une hôtesse l'accueille.",
              "An elegant man arrives at the reception desk of an upscale restaurant, greeted by a host.",
            )}
            width={1280}
            height={1600}
            className="h-[50svh] w-full object-cover md:h-[100svh]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,12,9,0.45)_0%,transparent_35%,rgba(16,12,9,0.55)_100%)]"
          />
          <figcaption className="absolute inset-x-0 top-[12%] p-6 md:p-10">
            <p className="font-display text-4xl font-medium leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
              {t("Pour deux ?", "Table for two?")}
            </p>
          </figcaption>
        </figure>

        {/* IMAGE 02 */}
        <figure className={`relative ${fade(step >= 2)}`}>
          <img
            src={skin02}
            alt={t(
              "Portrait rapproché du même homme, calme et assuré, dans le même restaurant.",
              "Close-up portrait of the same man, calm and confident, in the same restaurant.",
            )}
            width={1280}
            height={1600}
            className="h-[50svh] w-full object-cover md:h-[100svh]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,12,9,0.35)_0%,transparent_35%,rgba(16,12,9,0.6)_100%)]"
          />
          <figcaption className="absolute inset-x-0 top-[12%] p-6 md:p-10">
            <p className="font-display text-4xl font-medium leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
              {t("Non,", "No,")}
              <br />
              {t("juste moi.", "just me.")}
            </p>
          </figcaption>
        </figure>
      </div>

      {/* VOILE DE FUSION + RÉVÉLATION (superposés, même écran) */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent_0%,rgba(16,12,9,0.88)_55%,#100c09_100%)] transition-opacity duration-1000 ${
          step >= 3 ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-6xl px-6 pb-14 md:pb-20">
          <p
            className={`text-balance font-display text-4xl font-medium leading-[1] tracking-tight md:text-6xl lg:text-7xl ${fade(
              step >= 3,
            )}`}
          >
            {t("Il s'est invité tout seul.", "It invited itself.")}
          </p>
          <p
            className={`mt-4 text-lg text-[#f3ece2]/70 md:text-xl ${fade(step >= 4)}`}
          >
            {t("Ça arrive.", "It happens.")}
          </p>

          <div
            className={`pointer-events-auto mt-8 flex flex-wrap items-center gap-6 ${fade(step >= 4)}`}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#f3ece2]/60">
              MAAN · {t("Skin Management", "Skin Management")}
            </p>
            <Link
              to="/questionnaire/$slug"
              params={{ slug: "peau" }}
              className="inline-flex items-center gap-2 rounded-full bg-[#f3ece2] px-6 py-3 text-sm text-[#100c09] transition-colors hover:bg-clay hover:text-[#f3ece2]"
            >
              {t("Commencer la consultation médicale", "Start medical consultation")}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
