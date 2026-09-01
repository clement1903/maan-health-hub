import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HighlightTextProps {
  text: string;
  keywords: string[];
  className?: string;
}

/**
 * Souligne les mots-clés d'un texte au scroll, un par un, dans l'ordre
 * de lecture. Le style de surlignage reprend la barre ambre du logo MAAN.
 */
export function HighlightText({ text, keywords, className }: HighlightTextProps) {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const visibleRef = useRef<Set<string>>(visible);
  const refs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const orderRef = useRef<Map<string, number>>(new Map());
  const pendingRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const revealNext = () => {
      const pending = Array.from(pendingRef.current);
      if (pending.length === 0) {
        timerRef.current = null;
        return;
      }

      // On active les mots dans l'ordre d'apparition dans le texte.
      pending.sort((a, b) => (orderRef.current.get(a) ?? 0) - (orderRef.current.get(b) ?? 0));
      const next = pending[0];
      if (!next) {
        timerRef.current = null;
        return;
      }
      pendingRef.current.delete(next);
      setVisible((prev) => new Set([...prev, next]));

      // Révélation suivante, petit à petit.
      timerRef.current = setTimeout(revealNext, 180);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute("data-keyword");
          if (
            entry.isIntersecting &&
            key &&
            !visibleRef.current.has(key) &&
            !pendingRef.current.has(key)
          ) {
            pendingRef.current.add(key);
            if (!timerRef.current) {
              timerRef.current = setTimeout(revealNext, 120);
            }
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -12% 0px" },
    );

    refs.current.forEach((el) => observer.observe(el));

    // Si des mots sont déjà en attente au montage, on relance la chaîne.
    if (pendingRef.current.size > 0 && !timerRef.current) {
      timerRef.current = setTimeout(revealNext, 120);
    }

    return () => observer.disconnect();
  }, [text, keywords]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  if (!keywords.length) return <span className={className}>{text}</span>;

  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const keyword = sorted.find(
          (k) => k.localeCompare(part, undefined, { sensitivity: "base" }) === 0,
        );
        if (!keyword) return <span key={i}>{part}</span>;

        const key = `${keyword}-${i}`;
        orderRef.current.set(key, i);
        return (
          <span key={key} className="relative inline-block">
            <span className="relative z-10">{part}</span>
            <span
              ref={(el) => {
                if (el) refs.current.set(key, el);
              }}
              data-keyword={key}
              className={cn(
                "absolute inset-x-0 bottom-1 z-0 h-2 origin-left rounded-sm bg-amber/35 transition-transform duration-700 ease-[var(--ease)]",
                visible.has(key) ? "scale-x-100" : "scale-x-0",
              )}
            />
          </span>
        );
      })}
    </span>
  );
}
