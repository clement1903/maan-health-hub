import { useEffect, useRef, useState } from "react";

import { ImageZoom } from "@/components/image-zoom";
import { produitDetails, type Produit } from "@/data/soins";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  label: string;
  titre: string;
  render: () => React.ReactNode;
};

export function ProduitCarrousel({ produit }: { produit: Produit }) {
  const details = produitDetails[produit.molecule];
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const slides: Slide[] = [
    {
      id: "photo",
      label: "Photo",
      titre: "Le traitement",
      render: () => (
        <div className="space-y-4">
          <ImageZoom
            src={produit.image}
            alt={produit.alt}
            caption={`${produit.molecule} — ${produit.forme}`}
            className="rounded-[16px] border border-border"
            imgClassName="aspect-[16/10]"
          />
          <p className="text-pretty text-sm text-muted">{produit.forme}</p>
        </div>
      ),
    },
    {
      id: "action",
      label: "Mode d'action",
      titre: "Comment ça agit",
      render: () => (
        <div className="space-y-4">
          <p className="text-pretty">
            {details?.modeAction ??
              "Le mode d'action détaillé est expliqué par le médecin lors de l'évaluation de votre dossier."}
          </p>
          <p className="text-pretty text-sm text-muted">
            Posologie indicative — {produit.posologie}
          </p>
        </div>
      ),
    },
    {
      id: "precautions",
      label: "Précautions",
      titre: "Ce qu'il faut signaler",
      render: () => (
        <div className="space-y-4">
          <p className="text-pretty">{produit.precautions}</p>
          <p className="text-pretty text-sm text-muted">
            Ces éléments sont demandés dans le questionnaire. Ils aident le médecin à décider ; ils
            ne constituent ni un diagnostic ni une autorisation de traitement.
          </p>
        </div>
      ),
    },
    {
      id: "suivi",
      label: "Suivi",
      titre: "Après la prescription",
      render: () => (
        <p className="text-pretty">
          {details?.suivi ??
            "Un suivi est proposé après la mise en route du traitement afin d'évaluer l'efficacité et la tolérance."}
        </p>
      ),
    },
  ];

  useEffect(() => {
    setIndex(0);
  }, [produit.nom]);

  const go = (next: number) => {
    const clamped = (next + slides.length) % slides.length;
    setIndex(clamped);
    tabsRef.current[clamped]?.focus();
  };

  const active = slides[index]!;

  return (
    <div className="rounded-[24px] border border-border bg-background p-6 lg:p-8">
      <div
        role="tablist"
        aria-label={`Informations sur ${produit.molecule}`}
        className="flex flex-wrap gap-2"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(index + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(index - 1);
          } else if (e.key === "Home") {
            e.preventDefault();
            go(0);
          } else if (e.key === "End") {
            e.preventDefault();
            go(slides.length - 1);
          }
        }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${produit.molecule}-${s.id}`}
            aria-selected={index === i}
            aria-controls={`panel-${produit.molecule}-${s.id}`}
            tabIndex={index === i ? 0 : -1}
            onClick={() => setIndex(i)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300",
              index === i
                ? "border-clay bg-clay text-cream"
                : "border-border text-muted hover:border-clay/40 hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${produit.molecule}-${active.id}`}
        aria-labelledby={`tab-${produit.molecule}-${active.id}`}
        key={active.id}
        className="mt-6 animate-[rise_0.4s_var(--ease)_both]"
      >
        <h4 className="font-section text-xl font-medium tracking-tight">{active.titre}</h4>
        <div className="mt-4 text-sm leading-relaxed">{active.render()}</div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5">
        <div className="flex items-center gap-2" aria-hidden>
          {slides.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 ease-[var(--ease)]",
                index === i ? "w-7 bg-clay" : "w-1.5 bg-border",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Élément précédent"
            className="h-10 w-10 rounded-full border border-border text-muted transition-colors hover:border-clay/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Élément suivant"
            className="h-10 w-10 rounded-full border border-border text-muted transition-colors hover:border-clay/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
