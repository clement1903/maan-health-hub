import { useCallback, useEffect, useRef, useState } from "react";

import elevatorAsset from "@/assets/sexuel/elevator-down-campaign.mp4.asset.json";
import elevatorPoster from "@/assets/sexuel/elevator-down-poster.jpg";

/**
 * Micro-campagne cinématographique — Sexual Management.
 * « Ça devait monter. »
 * La vidéo se lit seule (autoplay, muted, playsInline) et boucle en douceur.
 */

const HOLD_AFTER_END_MS = 5000; // on laisse la dernière scène respirer
const RESTART_FADE_MS = 700;

export function SexuelHeroCampaign() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const restartTimer = useRef<number | null>(null);
  const [restarting, setRestarting] = useState(false);

  const handleEnded = useCallback(() => {
    restartTimer.current = window.setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      setRestarting(true);
      window.setTimeout(() => {
        v.currentTime = 0;
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
      aria-label="MAAN Sexual Management campaign"
      className="relative isolate min-h-[92vh] overflow-hidden bg-[#14100c]"
    >
      {/* Vidéo plein écran */}
      <div
        className={
          "absolute inset-0 transition-opacity duration-700" +
          (restarting ? " opacity-0" : " opacity-100")
        }
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
    </section>
  );
}
