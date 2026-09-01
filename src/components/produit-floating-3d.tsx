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

export type Tilt = { rx: number; ry: number };

export function ProduitFloating3D({
  produitId,
  alt,
  className,
  tilt: externalTilt,
}: {
  produitId: string;
  alt: string;
  className?: string;
  /** Tilt piloté par le parent (ex. souris sur toute la carte). */
  tilt?: Tilt;
}) {
  const src = produit3dImages[produitId];
  const [innerTilt, setInnerTilt] = useState<Tilt>({ rx: 0, ry: 0 });
  // Rotation complète à chaque montage (clic sur « sélectionner » remonte le composant via key).
  const [spin, setSpin] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setSpin(360));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!src) return null;

  const tilt = externalTilt ?? innerTilt;

  return (
    <div
      className={cn("relative isolate shrink-0", className)}
      style={{ perspective: "800px" }}
      onMouseMove={
        externalTilt
          ? undefined
          : (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              setInnerTilt({ rx: -py * 14, ry: px * 18 });
            }
      }
      onMouseLeave={externalTilt ? undefined : () => setInnerTilt({ rx: 0, ry: 0 })}
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_38%,transparent),transparent_70%)] blur-2xl" />
      {/* Wrapper : lévitation verticale */}
      <div
        className="relative"
        style={{ animation: "floaty 6.5s ease-in-out infinite" }}
      >
        {/* Image : tilt souris + rotation de sélection */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          width={768}
          height={768}
          className="relative w-full select-none drop-shadow-[0_14px_22px_rgba(0,0,0,0.16)]"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry + spin}deg)`,
            transition: "transform 550ms var(--ease)",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
