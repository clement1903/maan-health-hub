import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Props = {
  variant?: "produits" | "questionnaire";
  className?: string;
};

/**
 * Mention légale médicale compacte.
 */
export function MedicalDisclaimer({ variant = "produits", className }: Props) {
  const { t } = useI18n();
  return (
    <aside
      role="note"
      aria-label={t("Information médicale", "Medical information")}
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border bg-sand/50 px-4 py-2 text-xs text-muted",
        className,
      )}
    >
      <ShieldCheck className="size-3.5 shrink-0 text-clay" aria-hidden="true" />
      <span>
        {variant === "questionnaire"
          ? t(
              "Ce questionnaire ne remplace pas une consultation médicale.",
              "This questionnaire does not replace a medical consultation.",
            )
          : t(
              "Informations indicatives, aucun traitement sans prescription médicale.",
              "Information provided for guidance only; no treatment without a medical prescription.",
            )}{" "}
        {t("En cas d’urgence, contactez le 15 ou le 112.", "In an emergency, call 15 or 112.")}
      </span>
    </aside>
  );
}
