import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient/store";
import { tr } from "@/lib/patient/types";
import { ClayButton, Eyebrow, Surface } from "./ui";

export function NotificationCenter() {
  const { lang, t } = useI18n();
  const { data, markNotificationsRead } = usePatient();

  return (
    <Surface>
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>{t("Notifications", "Notifications")}</Eyebrow>
        <ClayButton variant="ghost" onClick={markNotificationsRead} className="px-4 text-[13px]">
          {t("Tout marquer lu", "Mark all read")}
        </ClayButton>
      </div>

      <ul className="mt-4 divide-y divide-border">
        {data.notifications.map((n) => (
          <li key={n.id} className="flex items-start gap-3 py-3">
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors duration-500",
                n.read ? "bg-border" : "bg-clay",
              )}
            />
            <div>
              <p className="text-[15px]">{tr(n.title, lang)}</p>
              <p className="font-mono text-[10px] text-muted">{n.at}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[12px] text-muted">
        {t(
          "Nos notifications externes ne révèlent jamais votre pathologie ni votre traitement.",
          "Our external notifications never reveal your condition or your treatment.",
        )}
      </p>
    </Surface>
  );
}
