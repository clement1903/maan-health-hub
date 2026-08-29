import { useRef, useState, type ReactNode } from "react";

/** Wraps content in an element that gently follows the cursor. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: "inline-block",
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0
          ? "transform 0.6s var(--ease)"
          : "transform 0.15s ease-out",
      }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setOffset({
          x: (event.clientX - (rect.left + rect.width / 2)) * strength,
          y: (event.clientY - (rect.top + rect.height / 2)) * strength,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </span>
  );
}

/** Wraps content in a card that tilts subtly toward the cursor. */
export function Tilt({
  children,
  max = 6,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, active: false });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `perspective(1100px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.active ? 1.012 : 1})`,
        transition: t.active ? "transform 0.12s ease-out" : "transform 0.7s var(--ease)",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        setT({ rx: -py * max * 2, ry: px * max * 2, active: true });
      }}
      onMouseLeave={() => setT({ rx: 0, ry: 0, active: false })}
    >
      {children}
    </div>
  );
}
