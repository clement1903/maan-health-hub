import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { tr, type Doctor } from "@/lib/patient/types";
import { ClayButton, Eyebrow, Surface } from "./ui";

export function DoctorCard({ doctor }: { doctor: Doctor | null }) {
  const { lang, t } = useI18n();

  if (!doctor) {
    return (
      <Surface>
        <Eyebrow>{t("Votre médecin", "Your doctor")}</Eyebrow>
        <p className="mt-3 text-[15px] text-muted">
          {t(
            "Votre dossier est en attente d'attribution à un médecin.",
            "Your file is waiting to be assigned to a doctor.",
          )}
        </p>
      </Surface>
    );
  }

  return (
    <Surface interactive>
      <Eyebrow>{t("Votre médecin", "Your doctor")}</Eyebrow>
      <div className="mt-4 flex items-center gap-4">
        {doctor.photo ? (
          <img
            src={doctor.photo}
            alt={doctor.name}
            loading="lazy"
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : null}
        <div className="min-w-0">
          <p className="font-section text-lg tracking-tight">{doctor.name}</p>
          <p className="text-sm text-muted">{tr(doctor.role, lang)}</p>
          {doctor.big ? (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
              {t("Certifié BIG", "BIG registered")} · {doctor.big}
            </p>
          ) : null}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        {t(
          `${doctor.name} suit actuellement votre traitement.`,
          `${doctor.name} is currently following your treatment.`,
        )}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/mon-espace/messages">
          <ClayButton>{t("Envoyer un message", "Send a message")}</ClayButton>
        </Link>
        <Link to="/mon-espace/profil">
          <ClayButton variant="ghost">{t("Voir mon dossier", "View my record")}</ClayButton>
        </Link>
      </div>
    </Surface>
  );
}
