import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import elevatorAsset from "@/assets/sexuel/elevator-down-campaign.mp4.asset.json";
import elevatorPoster from "@/assets/sexuel/elevator-down-poster.jpg";

/**
 * Micro-campagne cinématographique — Sexual Management.
 * « Ça devait monter. »
 * La vidéo se lit seule (autoplay, muted, playsInline) ; le texte
 * apparaît sur la fin, comme un punchline de pub premium.
 */

const HOLD_AFTER_END_MS = 5000; // on laisse la dernière scène respirer
const RESTART_FADE_MS = 700;

type Phase = 0 | 1 | 2 | 3; // 0 = film seul, puis les couches de texte

export function SexuelHeroCampaign() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const restartTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>(0);
  const [restarting, setRestarting] = useState(false);

  const handleEnded = useCallback(() => {
    setPhase(1);
    window.setTimeout(() => setPhase(2), 400);
    window.setTimeout(() => setPhase(3), 800);
    // On tient la chute quelques secondes, puis on relance en douceur.
    restartTimer.current = window.setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      setRestarting(true);
      window.setTimeout(() => {
        v.currentTime = 0;
        setPhase(0);
        void v.play().catch(() => undefined);
        setRestarting(false);
      }, RESTART_FADE_MS);
    }, HOLD_AFTER_END_MS);
  }, []);

  useEffect(
    () => () => {
      if (restartTimer.current) window.clearTimeout(restartTimer.current);
    },
    [],
  );

  return (
    <section
      aria-label={t("Campagne Santé sexuelle MAAN", "MAAN Sexual Management campaign")}
      className="relative isolate min-h-[92vh] overflow-hidden bg-[#14100c]"
    >
      {/* Vidéo plein écran */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          restarting && "opacity-0",
        )}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={elevatorAsset.url}
          poster={elevatorPoster}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
        />
      </div>

      {/* Fondu cinéma : lisibilité du texte sans casser l'image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,12,8,0.35)_0%,rgba(16,12,8,0)_30%,rgba(16,12,8,0)_45%,rgba(16,12,8,0.72)_100%)]"
      />

      {/* Chute de campagne */}
      <div className="relative z-10 flex min-h-[92vh] items-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-16 lg:pb-24">
          <h2
            className={cn(
              "font-display text-5xl leading-[1.02] font-medium tracking-tight text-[#f3ece2] transition-all duration-1000 ease-out lg:text-7xl",
              "drop-shadow-[0_10px_40px_rgba(0,0,0,0.55)]",
              phase >= 1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            {t("Ça devait monter.", "It was supposed to go up.")}
          </h2>

          <p
            className={cn(
              "mt-4 font-display text-xl text-[#f3ece2]/75 italic transition-all delay-100 duration-1000 ease-out lg:text-2xl",
              phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            {t("Ça arrive.", "It happens.")}
          </p>

          <div
            className={cn(
              "mt-10 flex flex-wrap items-center gap-6 transition-all delay-150 duration-1000 ease-out",
              phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#f3ece2]/60">
              MAAN — {t("Santé sexuelle", "Sexual Management")}
            </p>
            <span aria-hidden className="hidden h-px w-10 bg-[#f3ece2]/25 sm:block" />
            <Link
              to="/questionnaire/$slug"
              params={{ slug: "sexuel" }}
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#f3ece2] transition-colors hover:text-clay"
            >
              {t("En parler", "Talk about it")}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
