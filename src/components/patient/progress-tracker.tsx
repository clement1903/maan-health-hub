import { useState } from "react";

import { useI18n } from "@/lib/i18n";
import { usePatient } from "@/lib/patient/store";
import type { ProgressTrack } from "@/lib/patient/types";
import { ClayButton, Eyebrow, Surface } from "./ui";

export function ProgressTracker({
  journeyId,
  progress,
}: {
  journeyId: string;
  progress: ProgressTrack;
}) {
  const { t } = useI18n();
  const { addMeasurement } = usePatient();
  const [value, setValue] = useState("");

  const entries = progress.entries;
  const first = entries[0];
  const last = entries[entries.length - 1];
  if (!first || !last) return null;

  const delta = last.value - first.value;
  const min = Math.min(...entries.map((e) => e.value));
  const max = Math.max(...entries.map((e) => e.value));
  const span = Math.max(max - min, 0.1);

  return (
    <Surface>
      <Eyebrow>{t("Progression", "Progress")}</Eyebrow>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Départ", "Start")}
          </p>
          <p className="mt-1 font-section text-xl tracking-tight">
            {first.value} {progress.unit}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Aujourd'hui", "Today")}
          </p>
          <p className="mt-1 font-section text-xl tracking-tight">
            {last.value} {progress.unit}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Évolution", "Change")}
          </p>
          <p className="mt-1 font-section text-xl tracking-tight text-clay">
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)} {progress.unit}
          </p>
        </div>
      </div>

      <div className="mt-6 flex h-24 items-end gap-2">
        {entries.map((e) => {
          const h = 30 + ((e.value - min) / span) * 60;
          return (
            <div key={e.date} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-[8px] bg-clay/70 transition-all duration-700 ease-[var(--ease)]"
                style={{ height: `${h}%` }}
                title={`${e.date} · ${e.value} ${progress.unit}`}
              />
              <span className="font-mono text-[9px] text-muted">{e.date.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>

      <form
        className="mt-6 flex flex-wrap items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(value.replace(",", "."));
          if (!Number.isFinite(n) || n <= 0) return;
          addMeasurement(journeyId, Number(n.toFixed(1)));
          setValue("");
        }}
      >
        <input
          inputMode="decimal"
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          placeholder={`${t("Ajouter une mesure", "Add a measurement")} (${progress.unit})`}
          className="min-h-11 flex-1 rounded-full border border-border bg-background px-4 text-[15px] outline-none transition-colors focus:border-clay"
        />
        <ClayButton type="submit" disabled={!value.trim()}>
          {t("Ajouter", "Add")}
        </ClayButton>
      </form>
    </Surface>
  );
}
