import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type ImageZoomProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  caption?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
};

/**
 * Image cliquable ouvrant une modale légère et accessible :
 * rôle dialog, fermeture Échap / clic extérieur, focus géré, retour au déclencheur.
 */
export function ImageZoom({
  src,
  alt,
  className,
  imgClassName,
  caption,
  width = 1024,
  height = 768,
  children,
}: ImageZoomProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t(`Agrandir la photo : ${alt}`, `Enlarge the photo: ${alt}`)}
        className={cn(
          "group/zoom relative block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          width={width}
          height={height}
          className={cn(
            "w-full object-cover transition-transform duration-700 ease-[var(--ease)] group-hover/zoom:scale-[1.04]",
            imgClassName,
          )}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-border bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted opacity-0 backdrop-blur transition-opacity duration-300 group-hover/zoom:opacity-100 group-focus-visible/zoom:opacity-100"
        >
          {t("Agrandir", "Enlarge")}
        </span>
        {children}
      </button>

      {mounted && open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            >
              <div
                className="absolute inset-0 animate-[fade_0.25s_ease-out_both] bg-foreground/70 backdrop-blur-sm"
                onClick={close}
                aria-hidden
              />
              <div className="relative z-10 max-h-full w-full max-w-3xl animate-[rise_0.35s_var(--ease)_both] overflow-auto rounded-[24px] border border-border bg-background p-3 shadow-[0_60px_120px_-60px_var(--foreground)]">
                <img
                  src={src}
                  alt={alt}
                  className="w-full rounded-[16px] object-contain"
                />
                <div className="flex items-start justify-between gap-4 px-3 py-3">
                  <p className="text-pretty text-sm text-muted">{caption ?? alt}</p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    className="shrink-0 rounded-full border border-border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-clay/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                  >
                    {t("Fermer", "Close")}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
