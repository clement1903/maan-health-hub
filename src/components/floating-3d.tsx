import { useState } from "react";
import { cn } from "@/lib/utils";

import img3dSexual from "@/assets/3d-sexual.png";
import img3dWeight from "@/assets/3d-weight.png";
import img3dHair from "@/assets/3d-hair.png";
import img3dSkin from "@/assets/3d-skin.png";

export const domaine3dImages: Record<string, string> = {
  sexuel: img3dSexual,
  poids: img3dWeight,
  cheveux: img3dHair,
  peau: img3dSkin,
};

type Floating3DProps = {
  domaine: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Décalage de l'animation de flottement, en secondes. */
  delay?: number;
  /** Affiche un halo coloré derrière le visuel. */
  halo?: boolean;
};

/**
 * Visuel produit 3D flottant : animation continue + inclinaison qui suit la souris.
 */
export function Floating3D({
  domaine,
  alt,
  className,
  imgClassName,
  delay = 0,
  halo = true,
}: Floating3DProps) {
  const src = domaine3dImages[domaine];
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hover, setHover] = useState(false);

  if (!src) return null;

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 12, ry: px * 16 });
  };

  return (
    <div
      className={cn("relative isolate", className)}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setTilt({ rx: 0, ry: 0 });
      }}
      style={{ perspective: "900px" }}
      aria-hidden="true"
    >
      {halo && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_35%,transparent),transparent_70%)] blur-2xl" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={1024}
        height={1024}
        className={cn(
          "relative w-full select-none drop-shadow-[0_35px_45px_rgba(0,0,0,0.22)]",
          imgClassName,
        )}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hover ? 1.06 : 1})`,
          transition: "transform 600ms var(--ease)",
          animation: `floaty 6.5s ease-in-out ${delay}s infinite`,
        }}
      />
    </div>
  );
}
