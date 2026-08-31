import { useRef } from "react";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import { tr, type PhotoModule } from "@/lib/patient/types";
import { ClayButton, Eyebrow, Surface } from "./ui";

export function PhotoProgress({
  journeyId,
  photos,
}: {
  journeyId: string;
  photos: PhotoModule;
}) {
  const { lang, t } = useI18n();
  const { addPhoto } = usePatient();
  const input = useRef<HTMLInputElement | null>(null);

  if (!photos.enabled) return null;

  return (
    <Surface>
      <Eyebrow>{t("Ma progression", "My progress")}</Eyebrow>
      <p className="mt-2 text-sm text-muted">
        {t(
          "Optionnel. Comparez vos photos dans le temps.",
          "Optional. Compare your photos over time.",
        )}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.entries.map((p) => (
          <figure
            key={p.id}
            className="overflow-hidden rounded-[16px] border border-border bg-background transition-transform duration-500 ease-[var(--ease)] hover:-translate-y-0.5"
          >
            <div className="aspect-[3/4] w-full bg-sand">
              {p.src ? (
                <img src={p.src} alt={tr(p.label, lang)} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-2xl text-clay/50">◍</div>
              )}
            </div>
            <figcaption className="px-3 py-2">
              <p className="font-section text-sm tracking-tight">{tr(p.label, lang)}</p>
              <p className="font-mono text-[10px] text-muted">{p.date}</p>
            </figcaption>
          </figure>
        ))}

        <button
          type="button"
          onClick={() => input.current?.click()}
          className="grid aspect-[3/4] place-items-center rounded-[16px] border border-dashed border-border text-sm text-muted transition-colors hover:border-clay hover:text-clay"
        >
          + {t("Ajouter", "Add")}
        </button>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          addPhoto(
            journeyId,
            {
              fr: `Photo ${photos.entries.length + 1}`,
              en: `Photo ${photos.entries.length + 1}`,
            },
            url,
          );
          e.target.value = "";
        }}
      />

      <p className="mt-5 rounded-[14px] bg-sand px-4 py-3 text-sm text-foreground/80">
        {t(
          "Visible uniquement par vous et les professionnels de santé autorisés lorsqu'elles font partie de votre suivi.",
          "Visible only to you and authorised health professionals when part of your follow-up.",
        )}
      </p>

      <div className="mt-4">
        <ClayButton variant="ghost" onClick={() => input.current?.click()}>
          {t("Ajouter une photo", "Add a photo")}
        </ClayButton>
      </div>
    </Surface>
  );
}
