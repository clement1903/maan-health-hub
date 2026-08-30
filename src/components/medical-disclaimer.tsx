import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  variant?: "produits" | "questionnaire";
  className?: string;
};

/**
 * Mentions légales + disclaimer médical.
 * Affiché près des produits et au début du questionnaire.
 */
export function MedicalDisclaimer({ variant = "produits", className }: Props) {
  const title =
    variant === "questionnaire"
      ? "Avant de commencer : information médicale"
      : "Mentions légales et information médicale";

  return (
    <aside
      role="note"
      aria-label={title}
      className={cn(
        "rounded-[18px] border border-border bg-sand/50 p-5 text-sm leading-relaxed text-muted",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        {title}
      </p>
      {variant === "questionnaire" ? (
        <p className="mt-3 text-pretty">
          Ce questionnaire ne constitue ni un diagnostic, ni une prescription. Vos réponses sont
          transmises telles quelles à un médecin indépendant, seul habilité à décider si un
          traitement est approprié, si des informations complémentaires sont nécessaires, ou s'il
          n'est pas adapté. Aucune décision n'est automatisée. Répondez avec précision et sincérité :
          la qualité de l'évaluation en dépend. En cas d'urgence, contactez le 15 ou le 112.
        </p>
      ) : (
        <p className="mt-3 text-pretty">
          Les informations présentées ici sont fournies à titre indicatif et ne remplacent pas un avis
          médical. Les médicaments présentés sont disponibles sur ordonnance uniquement : aucun
          traitement n'est vendu ni délivré sans prescription d'un médecin. Les posologies affichées
          sont indicatives ; seul le médecin fixe la dose adaptée. Lisez toujours la notice et
          signalez tout effet indésirable.
        </p>
      )}
      <p className="mt-3 text-pretty">
        MAAN — Des soins pensés pour les hommes.{" "}
        <Link
          to="/conformite"
          className="underline decoration-clay/40 decoration-2 underline-offset-4 transition hover:decoration-clay"
        >
          Conformité et confidentialité
        </Link>{" "}
        ·{" "}
        <Link
          to="/cookies"
          className="underline decoration-clay/40 decoration-2 underline-offset-4 transition hover:decoration-clay"
        >
          Politique des cookies
        </Link>
      </p>
    </aside>
  );
}
