import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HandwrittenSignatureProps = {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
};

export function HandwrittenSignature({
  text,
  className,
  duration = 2.4,
  delay = 0,
}: HandwrittenSignatureProps) {
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return <span className={cn("font-signature", className)}>{text}</span>;
  }

  return (
    <span
      ref={ref}
      className={cn("relative inline-block font-signature", className)}
      aria-label={text}
    >
      {/* Réserve l’espace et sert de référence de largeur */}
      <span className="invisible">{text}</span>

      {/* Texte révélé de gauche à droite */}
      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{
          width: visible ? "100%" : "0%",
          transition: `width ${duration}s cubic-bezier(0.32, 0.72, 0, 1)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        <span className="inline-block whitespace-nowrap">{text}</span>
      </span>

      {/* Curseur style stylo qui suit le tracé */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-clay shadow-sm",
          "ring-1 ring-clay/30 ring-offset-1 ring-offset-cream",
          visible ? "opacity-0" : "opacity-100",
        )}
        style={{
          bottom: "0.18em",
          left: visible ? "100%" : "0%",
          transition: `left ${duration}s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease`,
          transitionDelay: visible
            ? `${duration * 1000}ms, ${duration * 1000}ms`
            : `${delay}ms, ${delay}ms`,
        }}
      />
    </span>
  );
}
