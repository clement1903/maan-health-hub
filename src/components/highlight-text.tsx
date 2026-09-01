import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HighlightTextProps {
  text: string;
  keywords: string[];
  className?: string;
}

/**
 * Souligne progressivement les mots-clés d'un texte au scroll.
 * Le style de surlignage reprend la barre ambre du logo MAAN.
 */
export function HighlightText({ text, keywords, className }: HighlightTextProps) {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const refs = useRef<Map<string, HTMLSpanElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute("data-keyword");
          if (entry.isIntersecting && key && !visible.has(key)) {
            setVisible((prev) => new Set([...prev, key]));
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -8% 0px" },
    );

    refs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [text, keywords, visible]);

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
