import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type Chapitre = { start: number; title: string };

export const chapitres: Chapitre[] = [
  { start: 0, title: "Questionnaire médical" },
  { start: 2, title: "Décision médicale" },
  { start: 4, title: "Préparation en pharmacie" },
  { start: 6, title: "Livraison discrète" },
  { start: 8, title: "Suivi médical" },
];

export function ParcoursVideo({
  src,
  poster,
  onChapterChange,
}: {
  src: string;
  poster: string;
  onChapterChange?: (index: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    onChapterChange?.(active);
  }, [active, onChapterChange]);

  const seek = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = chapitres[i]!.start + 0.05;
    setActive(i);
    void v.play().catch(() => undefined);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-[24px] shadow-[0_50px_120px_-60px_var(--foreground)]">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label="Vidéo explicative du parcours : questionnaire, décision médicale, préparation en pharmacie, livraison et suivi"
          className="aspect-[5/3] w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            const d = v.duration || 10;
            setProgress(v.currentTime / d);
            let idx = 0;
            for (let i = 0; i < chapitres.length; i += 1) {
              if (v.currentTime >= chapitres[i]!.start) idx = i;
            }
            setActive(idx);
          }}
        />

        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) void v.play().catch(() => undefined);
            else v.pause();
          }}
          className="absolute right-3 top-3 rounded-full bg-background/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-clay backdrop-blur-sm transition-colors hover:bg-background"
        >
          {playing ? "Pause" : "Lecture"}
        </button>

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay backdrop-blur-sm">
          {chapitres[active]!.title}
        </span>

        <div className="absolute inset-x-0 bottom-0 h-1 bg-foreground/15">
          <div
            className="h-full bg-clay"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      <ol className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {chapitres.map((c, i) => (
          <li key={c.title}>
            <button
              type="button"
              onClick={() => seek(i)}
              aria-current={active === i}
              className={cn(
                "flex w-full items-center gap-3 rounded-full border px-4 py-2 text-left text-sm transition-all duration-400 ease-[var(--ease)]",
                active === i
                  ? "border-clay bg-clay text-cream"
                  : "border-border text-muted hover:border-clay/40 hover:text-foreground",
              )}
            >
              <span className="font-mono text-[10px] tabular-nums opacity-70">
                0:0{c.start}
              </span>
              <span className="truncate">{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
