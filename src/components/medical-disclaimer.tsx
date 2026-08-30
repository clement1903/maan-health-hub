import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  variant?: "produits" | "questionnaire";
  className?: string;
};

/**
 * Mention légale médicale compacte.
 * Le texte complet figure sur /conformite.
 */
export function MedicalDisclaimer({ variant = "produits", className }: Props) {
  return (
    <aside
      role="note"
      aria-label="Information médicale"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border bg-sand/50 px-4 py-2 text-xs text-muted",
        className,
      )}
    >
      <ShieldCheck className="size-3.5 shrink-0 text-clay" aria-hidden="true" />
      <span>
        {variant === "questionnaire"
          ? "Ce questionnaire ne remplace pas une consultation médicale."
          : "Informations indicatives, aucun traitement sans prescription médicale."}{" "}
        En cas d’urgence, contactez le 15 ou le 112.
      </span>
      <Link
        to="/conformite"
        hash="medical"
        className="shrink-0 underline decoration-clay/40 decoration-2 underline-offset-4 transition hover:decoration-clay"
      >
        Conformité et confidentialité
      </Link>
    </aside>
  );
}
