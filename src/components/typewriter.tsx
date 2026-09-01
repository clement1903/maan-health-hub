import { useEffect, useRef, useState } from "react";

type TypewriterProps = {
  words: string[];
  /** false = animation en pause (hors viewport) */
  active?: boolean;
  /** Texte affiché si prefers-reduced-motion (remplace toute la partie animée) */
  reducedFallback?: string;
  className?: string;
};

/** Petite variation humaine autour d'une vitesse de base. */
const jitter = (base: number) => base + (Math.random() - 0.5) * base * 0.45;

/**
 * Effet de saisie au clavier, éditorial et discret :
 * tape une destination (~80-110 ms/car), pause 2 s (3 s pour la dernière),
 * efface (~45-70 ms/car), micro-pause 300 ms, destination suivante.
 * La largeur du mot le plus long est réservée pour éviter tout layout shift.
 */
export function Typewriter({
  words,
  active = true,
  reducedFallback,
  className,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [len, setLen] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing" | "pausing">("typing");
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  const word = words[index % words.length] ?? "";
  const isLast = index % words.length === words.length - 1;

  useEffect(() => {
    if (!active || reduced) return;
    let delay = 0;

    if (phase === "typing") {
      if (len < word.length) {
        delay = jitter(95); // frappe : 80–110 ms de base
        timerRef.current = setTimeout(() => setLen((l) => l + 1), delay);
      } else {
        timerRef.current = setTimeout(() => setPhase("holding"), 0);
      }
    } else if (phase === "holding") {
      timerRef.current = setTimeout(() => setPhase("erasing"), isLast ? 3000 : 2000);
    } else if (phase === "erasing") {
      if (len > 0) {
        timerRef.current = setTimeout(() => setLen((l) => l - 1), jitter(57)); // effacement : 45–70 ms
      } else {
        timerRef.current = setTimeout(() => setPhase("pausing"), 0);
      }
    } else {
      timerRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }, 300); // micro-pause avant la destination suivante
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [len, phase, index, active, reduced, word, isLast, words.length]);

  if (reduced) {
    return <span className={className}>{reducedFallback ?? words[0]}</span>;
  }

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const text = word.slice(0, len);

  return (
    <span className={className}>
      {/* réserve la largeur du mot le plus long : aucun saut de layout */}
      <span className="relative inline-block align-baseline">
        <span aria-hidden className="invisible">
          {longest}
        </span>
        <span className="absolute left-0 top-0 whitespace-nowrap">
          {text}
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.08em] animate-[pulse_1.1s_step-end_infinite] bg-clay"
          />
        </span>
      </span>
    </span>
  );
}
