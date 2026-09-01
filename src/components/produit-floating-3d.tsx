import { useState } from "react";

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

export function ProduitFloating3D({
  produitId,
  alt,
  className,
}: {
  produitId: string;
  alt: string;
  className?: string;
}) {
  const src = produit3dImages[produitId];
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  if (!src) return null;

  return (
    <div
      className={cn("relative isolate shrink-0", className)}
      style={{ perspective: "800px" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: -py * 14, ry: px * 18 });
      }}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--amber)_38%,transparent),transparent_70%)] blur-2xl" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={768}
        height={768}
        className="relative w-full select-none drop-shadow-[0_24px_28px_rgba(0,0,0,0.18)]"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 600ms var(--ease)",
          animation: "floaty 6.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}
