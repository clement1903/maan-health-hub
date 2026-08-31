import { createFileRoute } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import { SecureMessages } from "@/components/patient/secure-messages";
import { Skeleton } from "@/components/patient/ui";

export const Route = createFileRoute("/mon-espace/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useI18n();
  const { loading } = usePatient();

  if (loading) return <Skeleton className="h-72 w-full rounded-[22px]" />;

  return (
    <div className="space-y-8" style={{ animation: "fade 0.5s var(--ease) both" }}>
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t("Messages", "Messages")}
        </h1>
        <p className="mt-2 max-w-[46ch] text-pretty text-[15px] text-muted">
          {t(
            "Vos échanges sécurisés avec votre médecin et l'équipe MAAN.",
            "Your secure exchanges with your doctor and the MAAN team.",
          )}
        </p>
      </header>

      <SecureMessages />
    </div>
  );
}
