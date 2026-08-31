import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Delivery, DeliveryStageKey } from "@/lib/patient/types";
import { Eyebrow, Surface } from "./ui";

const order: DeliveryStageKey[] = ["prescription", "preparation", "expedition", "livraison"];

export function DeliveryTracker({ delivery }: { delivery: Delivery | null }) {
  const { t } = useI18n();

  const labels: Record<DeliveryStageKey, string> = {
    prescription: t("Prescription", "Prescription"),
    preparation: t("Préparation pharmacie", "Pharmacy preparation"),
    expedition: t("Expédition", "Shipping"),
    livraison: t("Livraison", "Delivery"),
  };

  if (!delivery) {
    return (
      <Surface>
        <Eyebrow>{t("Livraison", "Delivery")}</Eyebrow>
        <p className="mt-3 text-sm text-muted">
          {t(
            "Aucune livraison prévue pour le moment.",
            "No delivery scheduled at the moment.",
          )}
        </p>
      </Surface>
    );
  }

  const activeIndex = order.indexOf(delivery.stage);

  return (
    <Surface>
      <Eyebrow>{t("Livraison", "Delivery")}</Eyebrow>
      <ul className="mt-5 space-y-3">
        {order.map((k, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "current" : "todo";
          return (
            <li key={k} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] transition-all duration-500",
                  state === "done" && "border-clay bg-clay text-cream",
                  state === "current" && "border-clay text-clay",
                  state === "todo" && "border-border text-muted",
                )}
              >
                {state === "done" ? "✓" : state === "current" ? "●" : "○"}
              </span>
              <span className={cn("text-[15px]", state === "todo" ? "text-muted" : "text-foreground")}>
                {labels[k]}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 space-y-1 text-sm text-muted">
        {delivery.eta ? (
          <p>
            {t("Réception estimée", "Estimated arrival")} :{" "}
            <span className="text-foreground">{delivery.eta}</span>
          </p>
        ) : null}
        {delivery.carrier ? (
          <p>
            {t("Transporteur", "Carrier")} : <span className="text-foreground">{delivery.carrier}</span>
          </p>
        ) : null}
        {delivery.tracking ? (
          <p className="font-mono text-[12px] text-clay">{delivery.tracking}</p>
        ) : null}
      </div>

      <p className="mt-5 rounded-[14px] bg-sand px-4 py-3 text-sm text-foreground/80">
        {t(
          "Votre colis est envoyé dans un emballage discret, sans mention du traitement.",
          "Your parcel is sent in discreet packaging, with no mention of the treatment.",
        )}
      </p>
    </Surface>
  );
}
