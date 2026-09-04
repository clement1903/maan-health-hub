import { useCallback, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import portrait from "@/assets/skin/skin-hero-portrait.jpg";

/**
 * Hero « analyse de peau » de la page Skin Management — inspiré de lovi.care.
 * Un homme face caméra dont la tête suit la souris (gauche ↔ droite).
 * Un iPhone superposé révèle une analyse de peau animée (scan + maillage).
 */

// Points du maillage d'analyse (positions en % dans l'écran du téléphone)
const MESH_DOTS: Array<[number, number]> = [
  [50, 18], [38, 22], [62, 22], [30, 30], [70, 30], [44, 32], [56, 32],
  [26, 42], [74, 42], [36, 44], [64, 44], [50, 46], [42, 54], [58, 54],
  [30, 56], [70, 56], [50, 60], [38, 66], [62, 66], [46, 72], [54, 72],
  [50, 80], [34, 24], [66, 24], [47, 39], [53, 39],
];

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
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-cream text-ink"
    >
      <style>{`
        @keyframes skin-scan {
          0% { top: 6%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: 88%; opacity: 0; }
        }
        @keyframes skin-dot {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes skin-progress {
          0% { width: 8%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* TITRE — haut, centré, façon Lovi */}
      <div className="relative z-20 mx-auto max-w-4xl px-6 pt-28 text-center md:pt-32">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-clay" />
          MAAN · Skin Management
        </p>
        <h1 className="mt-6 font-display text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
          {t("Votre peau, analysée.", "Your skin, analysed.")}
          <br />
          <em className="italic text-clay">
            {t("Sans quitter la maison.", "Without leaving home.")}
          </em>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink/60 md:text-lg">
          {t(
            "Un médecin enregistré étudie votre peau en ligne et vous prescrit le traitement adapté.",
            "A registered doctor reviews your skin online and prescribes the right treatment.",
          )}
        </p>
      </div>

      {/* SCÈNE — portrait + iPhone */}
      <div className="relative z-10 mx-auto mt-4 w-full max-w-[560px] flex-1 px-6 md:-mt-2">
        <div
          className="relative mx-auto aspect-[896/1152] w-full max-w-[460px]"
          style={{ perspective: "900px" }}
        >
          {/* PORTRAIT — la tête suit la souris */}
          <img
            src={portrait}
            alt={t(
              "Portrait d'un homme face caméra, sa tête suit le mouvement de votre souris.",
              "Portrait of a man facing the camera, his head follows your mouse movement.",
            )}
            width={896}
            height={1152}
            className="h-full w-full rounded-b-[2.5rem] object-cover object-top transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `rotateY(${nx * 9}deg) translateX(${nx * 14}px) scale(1.04)`,
            }}
            draggable={false}
          />

          {/* IPHONE — superposé sur le visage */}
          <div
            className="absolute left-1/2 top-[16%] w-[52%] -translate-x-1/2 transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: `translateX(calc(-50% + ${nx * -10}px))` }}
          >
            <div className="relative aspect-[9/19] w-full rounded-[2.6rem] border-[6px] border-[#1c1a18] bg-black shadow-[0_30px_80px_-20px_rgba(28,26,24,0.5)]">
              {/* Encoche */}
              <span
                aria-hidden
                className="absolute left-1/2 top-2.5 z-30 h-4 w-16 -translate-x-1/2 rounded-full bg-[#1c1a18]"
              />
              {/* Écran */}
              <div className="absolute inset-[3px] overflow-hidden rounded-[2.2rem]">
                {/* Visage zoomé à travers l'écran */}
                <img
                  src={portrait}
                  alt=""
                  aria-hidden
                  width={896}
                  height={1152}
                  className="absolute inset-0 h-full w-full object-cover object-[50%_18%] transition-transform duration-300 ease-out will-change-transform"
                  style={{ transform: `scale(2.6) translateX(${nx * -6}px)` }}
                  draggable={false}
                />
                {/* Voile léger pour lisibilité */}
                <span aria-hidden className="absolute inset-0 bg-black/10" />

                {/* Ligne de scan */}
                <span
                  aria-hidden
                  className="absolute left-[8%] right-[8%] h-[2px] rounded-full bg-clay shadow-[0_0_18px_4px_rgba(196,98,45,0.55)]"
                  style={{ animation: "skin-scan 3.4s ease-in-out infinite" }}
                />

                {/* Maillage d'analyse */}
                {MESH_DOTS.map(([x, y], i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="absolute h-1 w-1 rounded-full bg-white/90 shadow-[0_0_6px_2px_rgba(255,255,255,0.4)]"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      animation: `skin-dot 2.4s ease-in-out ${(i % 9) * 0.28}s infinite`,
                    }}
                  />
                ))}

                {/* Label haut */}
                <p className="absolute inset-x-0 top-[9%] text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white drop-shadow">
                  {t("Analyse de la peau…", "Skin analysis…")}
                </p>

                {/* Barre de progression + métriques */}
                <div className="absolute inset-x-[10%] bottom-[7%]">
                  <div className="h-1 overflow-hidden rounded-full bg-white/25">
                    <span
                      className="block h-full rounded-full bg-clay"
                      style={{ animation: "skin-progress 3.4s ease-in-out infinite" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[8px] uppercase tracking-widest text-white/90 drop-shadow">
                    <span>{t("Hydratation", "Hydration")}</span>
                    <span>Texture</span>
                    <span>{t("Rougeurs", "Redness")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA — bas */}
      <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 pb-14 pt-6 text-center">
        <Link
          to="/questionnaire/$slug"
          params={{ slug: "peau" }}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-clay"
        >
          {t("Commencer la consultation médicale", "Start medical consultation")}
          <span aria-hidden>→</span>
        </Link>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
          {t("Consultation médicale · sans aucun frais", "Medical consultation · FREE of charge")}
        </p>
      </div>
    </section>
  );
}
