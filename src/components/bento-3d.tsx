import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

import img3dSexual from "@/assets/3d-sexual.png";
import img3dWeight from "@/assets/3d-weight.png";
import img3dHair from "@/assets/3d-hair.png";
import img3dSkin from "@/assets/3d-skin.png";

type Card = {
  slug: string;
  title: string;
  accent: string;
  cta: string;
  img: string;
  alt: string;
  gradient: string;
  large?: boolean;
  delay: number;
};

/** Carte 3D : le visuel produit flotte et suit la souris sur deux axes. */
function BentoCard({ card }: { card: Card }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 10, ry: px * 14, x: px * 26, y: py * 20 });
  };

  const reset = () => {
    setHover(false);
    setTilt({ rx: 0, ry: 0, x: 0, y: 0 });
  };

  return (
    <Link
      ref={ref}
      to="/soins/$domaine"
      params={{ domaine: card.slug }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      className={cn(
        "group relative isolate flex min-h-[220px] overflow-hidden rounded-[28px] p-6 transition-shadow duration-500 lg:p-8",
        card.large ? "min-h-[340px] lg:min-h-[380px]" : "",
        hover
          ? "shadow-[0_50px_100px_-45px_var(--foreground)]"
          : "shadow-[0_20px_50px_-40px_var(--foreground)]",
      )}
      style={{
        background: card.gradient,
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${hover ? -4 : 0}px)`,
        transformStyle: "preserve-3d",
        transition: "transform 500ms var(--ease), box-shadow 500ms var(--ease)",
      }}
    >
      {/* halo lumineux */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55),transparent_65%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative z-10 flex w-full flex-col justify-between">
        <div style={{ transform: "translateZ(40px)" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay-deep/70">
            {card.accent}
          </p>
          <h3
            className={cn(
              "mt-2 max-w-[12ch] text-balance font-section font-medium leading-[1.05] tracking-tight text-foreground",
              card.large ? "text-3xl lg:text-4xl" : "text-2xl",
            )}
          >
            {card.title}
          </h3>
        </div>
        <span
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 group-hover:gap-3 group-hover:text-foreground"
          style={{ transform: "translateZ(30px)" }}
        >
          {card.cta}
          <span aria-hidden="true">→</span>
        </span>
      </div>

      <img
        src={card.img}
        alt={card.alt}
        loading="lazy"
        width={1024}
        height={1024}
        className={cn(
          "pointer-events-none absolute select-none drop-shadow-[0_35px_45px_rgba(0,0,0,0.25)]",
          card.large
            ? "-bottom-6 -right-4 w-[62%] max-w-[340px]"
            : "-bottom-8 -right-6 w-[52%] max-w-[210px]",
        )}
        style={{
          transform: `translate3d(${tilt.x}px, ${tilt.y}px, 90px) rotate(${hover ? -4 : 0}deg) scale(${hover ? 1.08 : 1})`,
          transition: "transform 600ms var(--ease)",
          animation: `floaty ${card.large ? 7 : 6}s ease-in-out ${card.delay}s infinite`,
        }}
      />
    </Link>
  );
}

export function Bento3D() {
  const { t } = useI18n();

  const cards: Card[] = [
    {
      slug: "poids",
      title: t("Perdez du poids, durablement.", "Lose weight, for good."),
      accent: t("Poids", "Weight"),
      cta: t("Voir les traitements", "See treatments"),
      img: img3dWeight,
      alt: t("Stylo injecteur médical en 3D", "3D medical injection pen"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--amber) 40%, var(--cream)), color-mix(in oklab, var(--clay) 22%, var(--cream)))",
      large: true,
      delay: 0,
    },
    {
      slug: "sexuel",
      title: t("Retrouvez confiance au lit.", "Get your confidence back."),
      accent: t("Santé sexuelle", "Sexual health"),
      cta: t("Découvrir", "Discover"),
      img: img3dSexual,
      alt: t("Comprimé bleu en rendu 3D", "3D render of a blue tablet"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--sand) 70%, var(--cream)), var(--cream))",
      delay: 0.6,
    },
    {
      slug: "cheveux",
      title: t("Gardez vos cheveux.", "Keep your hair."),
      accent: t("Cheveux", "Hair"),
      cta: t("Découvrir", "Discover"),
      img: img3dHair,
      alt: t("Comprimés et pipette en rendu 3D", "3D render of tablets and a dropper"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--clay) 16%, var(--cream)), var(--cream))",
      delay: 1.2,
    },
    {
      slug: "peau",
      title: t("Une peau nette.", "Clear, calm skin."),
      accent: t("Peau", "Skin"),
      cta: t("Découvrir", "Discover"),
      img: img3dSkin,
      alt: t("Tube de crème en rendu 3D", "3D render of a cream tube"),
      gradient:
        "linear-gradient(135deg, color-mix(in oklab, var(--amber) 22%, var(--cream)), var(--cream))",
      delay: 1.8,
    },
  ];

  const [large, ...rest] = cards;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <BentoCard card={large} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        {rest.slice(0, 2).map((c) => (
          <BentoCard key={c.slug} card={c} />
        ))}
      </div>
      <div className="lg:col-span-12">
        <BentoCard card={rest[2]} />
      </div>
    </div>
  );
}
