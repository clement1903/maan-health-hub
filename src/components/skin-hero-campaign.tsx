import { useCallback, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import portrait from "@/assets/skin/skin-hero-portrait-dark.jpg";

/**
 * Hero « analyse de peau » de la page Skin Management — direction Modern Luxury.
 * Fond sombre espresso, portrait cinéma avec lumière terracotta, tête qui suit la souris,
 * iPhone flottant glassmorphic affichant les métriques d'analyse de peau.
 */

export function SkinHeroCampaign() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [nx, setNx] = useState(0); // -1 (gauche) → 1 (droite)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setNx(Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1)));
  }, []);

  const onMouseLeave = useCallback(() => setNx(0), []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-espresso text-cream"
    >
      <style>{`
        @keyframes skin-scan-lux {
          0% { top: 6%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: 88%; opacity: 0; }
        }
        @keyframes skin-dot-lux {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes skin-progress-lux {
          0% { width: 8%; }
          100% { width: 100%; }
        }
        @keyframes skin-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Glows atmosphériques */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-[520px] w-[520px] rounded-full bg-clay/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-amber/10 blur-[140px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 md:py-28">
        {/* Badge */}
        <div className="mb-10 inline-flex items-center rounded-full border border-cream/10 bg-cream/5 px-5 py-2 backdrop-blur-md">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-cream/70">
            MAAN <span className="mx-3 opacity-30 italic">·</span> {t("Skin Management", "Skin Management")}
          </span>
        </div>

        {/* Headline */}
        <div className="max-w-4xl text-center">
          <h1 className="font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
            <em className="italic">{t("Votre peau, analysée.", "Your skin, analysed.")}</em>
            <br />
            <span className="font-light text-cream/90">
              {t("Sans quitter la maison.", "Without leaving home.")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-cream/45 md:text-lg">
            {t(
              "Un médecin enregistré étudie votre peau en ligne et vous prescrit le traitement adapté.",
              "A registered doctor reviews your skin online and prescribes the right treatment.",
            )}
          </p>
        </div>

        {/* Scène visuelle — portrait + iPhone */}
        <div className="group relative mt-20 w-full max-w-2xl sm:max-w-3xl md:mt-28 lg:max-w-4xl">
          {/* Portrait avec grille technique */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-cream/10">
            <img
              src={portrait}
              alt={t(
                "Portrait d'un homme face caméra, sa tête suit le mouvement de votre souris.",
                "Portrait of a man facing the camera, his head follows your mouse movement.",
              )}
              width={1600}
              height={1000}
              className="h-full w-full object-cover object-[50%_20%] transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `rotateY(${nx * 6}deg) translateX(${nx * 12}px) scale(1.05)`,
              }}
              draggable={false}
            />

            {/* Overlay gradient bas */}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />

            {/* Grille technique subtile */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full stroke-cream/[0.12]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="skin-grid-lux" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#skin-grid-lux)" />
            </svg>
          </div>

          {/* iPhone flottant glassmorphic */}
          <div
            className="absolute left-1/2 top-[64%] w-[190px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out will-change-transform sm:w-[210px] md:w-[230px] lg:w-[250px]"
            style={{ transform: `translate(calc(-50% + ${nx * -10}px), -50%) rotate(${nx * -1}deg)` }}
          >
            <div className="relative aspect-[9/19.5] w-full rounded-[2.8rem] border border-cream/20 bg-[#0f0f0f]/80 p-2.5 shadow-[0_0_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] border border-cream/10 bg-black">
                {/* Encoche */}
                <span
                  aria-hidden
                  className="absolute left-1/2 top-3 z-30 h-4 w-20 -translate-x-1/2 rounded-full bg-[#0f0f0f]"
                />

                {/* Contenu écran */}
                <div className="flex h-full flex-col px-7 pb-6 pt-12">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-cream/40">
                        {t("Analyse en cours", "Live Scan")}
                      </p>
                      <p className="mt-1 font-display text-xl italic text-cream">
                        {t("Optimisation", "Optimizing")}
                      </p>
                    </div>
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-clay shadow-[0_0_10px_rgba(196,98,45,0.8)] animate-pulse" />
                  </div>

                  {/* Cercle score */}
                  <div className="mt-8 flex flex-1 flex-col items-center justify-center">
                    <div className="relative aspect-square w-36 md:w-40">
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-cream/10"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-full border-t border-clay/60"
                        style={{ animation: "skin-spin 8s linear infinite" }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display text-5xl font-light text-cream md:text-6xl">88</span>
                        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-cream/40">
                          {t("Hydratation", "Hydration")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Métriques */}
                  <div className="space-y-5">
                    {[
                      { label: t("Hydratation", "Hydration"), value: "88%", width: "88%" },
                      { label: "Texture", value: t("Uniforme", "Uniform"), width: "80%" },
                      { label: t("Rougeurs", "Redness"), value: t("Minimes", "Minimal"), width: "32%" },
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] text-cream/60">
                          <span className="font-mono uppercase tracking-[0.15em]">{metric.label}</span>
                          <span>{metric.value}</span>
                        </div>
                        <div className="h-[2px] w-full overflow-hidden rounded-full bg-cream/10">
                          <div
                            className="h-full rounded-full bg-cream"
                            style={{ width: metric.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA interne */}
                  <button
                    type="button"
                    className="mt-6 w-full rounded-xl bg-cream py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-espresso transition-colors hover:bg-clay hover:text-cream"
                  >
                    {t("Voir le rapport", "View Report")}
                  </button>
                </div>

                {/* Ligne de scan animée */}
                <span
                  aria-hidden
                  className="absolute left-[10%] right-[10%] h-[2px] rounded-full bg-clay shadow-[0_0_18px_4px_rgba(196,98,45,0.55)]"
                  style={{ animation: "skin-scan-lux 3.6s ease-in-out infinite" }}
                />

                {/* Points d'analyse */}
                {[
                  [50, 22], [38, 26], [62, 26], [30, 34], [70, 34], [44, 36], [56, 36],
                  [26, 46], [74, 46], [36, 48], [64, 48], [50, 50], [42, 58], [58, 58],
                  [30, 60], [70, 60], [50, 64], [38, 70], [62, 70], [46, 76], [54, 76],
                ].map(([x, y], i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="absolute h-1 w-1 rounded-full bg-clay/90 shadow-[0_0_6px_2px_rgba(196,98,45,0.45)]"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      animation: `skin-dot-lux 2.6s ease-in-out ${(i % 9) * 0.28}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA principal */}
        <div className="mt-14 flex flex-col items-center text-center">
          <Link
            to="/questionnaire/$slug"
            params={{ slug: "peau" }}
            className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 text-sm font-medium text-espresso transition-all hover:bg-clay hover:text-cream hover:pr-10"
          >
            {t("Commencer la consultation médicale", "Start medical consultation")}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/40">
            {t("Consultation médicale · sans aucun frais", "Medical consultation · FREE of charge")}
          </p>
        </div>
      </div>
    </section>
  );
}
