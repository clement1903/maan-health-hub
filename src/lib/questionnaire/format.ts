import type { AnswerValue, Question } from "./types";

const lifestyleLabels: Record<string, string> = {
  tabac: "Tabac",
  alcool: "Alcool",
  activite: "Activité physique",
  sommeil: "Sommeil",
};

/** Rend une réponse brute lisible, sans jamais la modifier. */
export function formatAnswer(question: Question, value: AnswerValue | undefined): string {
  if (value === undefined || value === null || value === "") return "Non renseigné";

  const labelOf = (v: string) =>
    question.options?.find((o) => o.value === v)?.label ?? v;

  switch (question.type) {
    case "boolean":
      return value === "oui" ? "Oui" : "Non";
    case "single":
      return labelOf(String(value));
    case "multi":
    case "symptoms":
    case "conditions":
      return Array.isArray(value) && value.length ? value.map(labelOf).join(", ") : "Non renseigné";
    case "medications":
    case "allergies":
    case "previous_treatments":
      return Array.isArray(value) && value.length ? value.join(" · ") : "Non renseigné";
    case "body": {
      const v = value as Record<string, unknown>;
      return `${v['height'] ?? "?"} cm · ${v['weight'] ?? "?"} kg`;
    }
    case "lifestyle": {
      const v = value as Record<string, string>;
      const parts = Object.entries(v)
        .filter(([, val]) => val)
        .map(([k, val]) => `${lifestyleLabels[k] ?? k} : ${val}`);
      return parts.length ? parts.join(" · ") : "Non renseigné";
    }
    case "file": {
      const files = value as { name: string }[];
      return files.length ? files.map((f) => f.name).join(", ") : "Aucun document";
    }
    case "number":
      return `${value}${question.unit ?? ""}`;
    case "date": {
      const d = new Date(String(value));
      return Number.isNaN(d.getTime())
        ? String(value)
        : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    }
    default:
      return String(value);
  }
}
