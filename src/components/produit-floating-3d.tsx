import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import imgViagra from "@/assets/3d/prod-viagra.png";
import imgSildenafil from "@/assets/3d/prod-sildenafil.png";
import imgCialis from "@/assets/3d/prod-cialis.png";
import imgTadalafil from "@/assets/3d/prod-tadalafil.png";
import imgWegovy from "@/assets/3d/prod-wegovy.png";
import imgOzempic from "@/assets/3d/prod-ozempic.png";
import imgFinasteride from "@/assets/3d/prod-finasteride.png";
import imgMinoxidil from "@/assets/3d/prod-minoxidil.png";
import imgTretinoine from "@/assets/3d/prod-tretinoine.png";
import imgMetronidazole from "@/assets/3d/prod-metronidazole.png";

/** Visuel 3D en lévitation, un par médicament. */
export const produit3dImages: Record<string, string> = {
  viagra: imgViagra,
  "sildenafil-generique": imgSildenafil,
  cialis: imgCialis,
  "tadalafil-generique": imgTadalafil,
  wegovy: imgWegovy,
  ozempic: imgOzempic,
  finasteride: imgFinasteride,
  minoxidil: imgMinoxidil,
  "retinoide-topique": imgTretinoine,
  metronidazole: imgMetronidazole,
};

export type ProductMotion = { x: number; y: number; rx: number; ry: number };

export function ProduitFloating3D({
  produitId,
  alt,
  className,
  motion: externalMotion,
}: {
  produitId: string;
  alt: string;
  className?: string;
  /** Déplacement et inclinaison pilotés par la souris sur toute la rubrique. */
  motion?: ProductMotion;
}) {
  const src = produit3dImages[produitId];
  const [innerMotion, setInnerMotion] = useState<ProductMotion>({ x: 0, y: 0, rx: 0, ry: 0 });
  // Rotation complète à chaque montage (clic sur « sélectionner » remonte le composant via key).
  const [spin, setSpin] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setSpin(360));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!src) return null;

  const motion = externalMotion ?? innerMotion;

  return (
    <div
      className={cn("relative isolate shrink-0", className)}
      style={{ perspective: "800px" }}
      onPointerMove={
        externalMotion
          ? undefined
          : (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
               setInnerMotion({ x: px * 34, y: py * 24, rx: -py * 12, ry: px * 16 });
            }
      }
      onPointerLeave={
        externalMotion
          ? undefined
          : () => setInnerMotion({ x: 0, y: 0, rx: 0, ry: 0 })
      }
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_38%,transparent),transparent_70%)] blur-2xl" />
      {/* Wrapper : lévitation verticale */}
      <div
        className="relative"
        style={{ animation: "floaty 6.5s ease-in-out infinite" }}
      >
        {/* Rotation de sélection (spin) sur un wrapper dédié : transition lente */}
        <div
          className="relative"
          style={{
            transform: `rotateY(${spin}deg)`,
            transition: "transform 900ms var(--ease)",
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Image : suit réellement la souris, avec un léger tilt 3D secondaire. */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            width={768}
            height={768}
            className="relative w-full select-none drop-shadow-[0_14px_22px_rgba(0,0,0,0.16)]"
            style={{
              transform: `translate3d(${motion.x}px, ${motion.y}px, 28px) rotateX(${motion.rx}deg) rotateY(${motion.ry}deg)`,
              transition:
                motion.x === 0 && motion.y === 0
                  ? "transform 650ms var(--ease)"
                  : "transform 110ms ease-out",
              willChange: "transform",
            }}
          />
        </div>
      </div>
    </div>
  );
}
