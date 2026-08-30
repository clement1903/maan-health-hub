import { jsPDF } from "jspdf";

import {
  questionnaireDefinitions,
  findDefinitionByCategory,
} from "@/lib/questionnaire/definitions";
import { formatAnswer } from "@/lib/questionnaire/format";
import { sectionLabels } from "@/lib/questionnaire/types";
import type {
  Answers,
  QuestionnaireDefinition,
  SectionId,
} from "@/lib/questionnaire/types";

export type QuestionnaireRecord = {
  id: string;
  category: string;
  status: string;
  created_at: string;
  definition_id?: string | null;
  version?: string | null;
  answers: unknown;
};

/** Les réponses sont soit la charge complète, soit un objet simple (ancien format). */
function extractAnswers(raw: unknown): Answers {
  if (raw && typeof raw === "object" && "answers" in (raw as Record<string, unknown>)) {
    return ((raw as Record<string, unknown>)["answers"] ?? {}) as Answers;
  }
  return (raw ?? {}) as Answers;
}

function findDefinition(record: QuestionnaireRecord): QuestionnaireDefinition | undefined {
  if (record.definition_id) {
    const byId = questionnaireDefinitions.find((d) => d.id === record.definition_id);
    if (byId) return byId;
  }
  return findDefinitionByCategory(record.category);
}

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Génère un récapitulatif PDF des informations saisies.
 * Les réponses originales sont reproduites telles quelles, sans interprétation.
 */
export function buildQuestionnairePdf(record: QuestionnaireRecord, email?: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const text = (
    value: string,
    opts: { size?: number; style?: "normal" | "bold"; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const { size = 10, style = "normal", color = [40, 36, 32], gap = 6 } = opts;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(value, maxWidth) as string[];
    ensureSpace(lines.length * (size + 3) + gap);
    doc.text(lines, margin, y);
    y += lines.length * (size + 3) + gap;
  };

  const rule = () => {
    ensureSpace(14);
    doc.setDrawColor(214, 205, 194);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  };

  const definition = findDefinition(record);
  const answers = extractAnswers(record.answers);

  // En-tête
  text("MAAN", { size: 20, style: "bold" });
  text("Des soins pensés pour les hommes", { size: 10, color: [140, 130, 120], gap: 12 });
  text("Récapitulatif de questionnaire médical", { size: 14, style: "bold" });
  text(
    [
      `Spécialité : ${definition?.title ?? record.category}`,
      `Envoyé le : ${dateFmt(record.created_at)}`,
      email ? `Compte : ${email}` : "",
      `Référence dossier : ${record.id.slice(0, 8).toUpperCase()}`,
      definition?.version ? `Version du questionnaire : ${definition.version}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    { size: 10, color: [110, 102, 94], gap: 12 },
  );
  rule();

  if (!definition) {
    text("Réponses saisies", { size: 12, style: "bold" });
    Object.entries(answers).forEach(([key, value]) => {
      text(key, { size: 10, style: "bold", gap: 2 });
      text(String(value ?? "Non renseigné"), { size: 10, color: [90, 84, 78] });
    });
  } else {
    const bySection = new Map<SectionId, typeof definition.questions>();
    definition.questions.forEach((q) => {
      if (!(q.id in answers)) return;
      const list = bySection.get(q.section) ?? [];
      list.push(q);
      bySection.set(q.section, list);
    });

    if (bySection.size === 0) {
      text("Aucune réponse enregistrée pour ce questionnaire.", { size: 10 });
    }

    bySection.forEach((questions, section) => {
      ensureSpace(40);
      text(sectionLabels[section] ?? section, {
        size: 12,
        style: "bold",
        color: [176, 92, 58],
        gap: 8,
      });
      questions.forEach((q) => {
        text(q.title, { size: 10, style: "bold", gap: 2 });
        text(formatAnswer(q, answers[q.id]), { size: 10, color: [90, 84, 78] });
      });
      y += 4;
    });
  }

  rule();
  text(
    "Document informatif généré automatiquement à partir des informations que vous avez saisies. " +
      "Il ne constitue ni un diagnostic, ni une ordonnance, ni une décision médicale. " +
      "Seul un médecin peut évaluer votre situation et décider, le cas échéant, de délivrer une prescription. " +
      "Aucun traitement n'est vendu ni délivré sans ordonnance. En cas d'urgence, appelez le 15 ou le 112.",
    { size: 8, color: [130, 122, 114] },
  );

  return doc;
}

export function downloadQuestionnairePdf(record: QuestionnaireRecord, email?: string) {
  const doc = buildQuestionnairePdf(record, email);
  const stamp = new Date(record.created_at).toISOString().slice(0, 10);
  doc.save(`MAAN-questionnaire-${stamp}.pdf`);
}
