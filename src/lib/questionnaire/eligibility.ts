/**
 * MAAN — score de pré-éligibilité (0 à 100).
 *
 * Objectif : éviter qu'un patient prenne une consultation vidéo alors que les
 * règles de prescription du traitement concerné ne permettront pas au médecin
 * de délivrer une ordonnance.
 *
 * Ce score n'est PAS une décision médicale : il applique uniquement les
 * critères de prescription (contre-indications et précautions d'emploi)
 * associés à chaque famille de traitement.
 */

import { bmi, evaluateCondition } from "./engine";
import type { Answers, Condition } from "./types";

export type Bilingual = { fr: string; en: string };

type Rule = {
  id: string;
  /** "block" = contre-indication : la visio n'est pas ouverte. */
  kind: "block" | "malus";
  /** Points retirés sur 100 (règles "malus"). */
  weight?: number;
  label: Bilingual;
  detail: Bilingual;
  when: (answers: Answers) => boolean;
};

const cond = (c: Condition) => (answers: Answers) => evaluateCondition(answers, c);

function ageOf(answers: Answers): number | null {
  const raw = answers['date_naissance'];
  if (!raw) return null;
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

function imcOf(answers: Answers): number | null {
  const m = (answers['morphologie'] ?? {}) as Record<string, unknown>;
  return bmi(m['height'], m['weight']);
}

const has = (id: string, value: string) => cond({ questionId: id, op: "includes", value });
const eq = (id: string, value: string) => cond({ questionId: id, op: "eq", value });

/* ---------------------------------------------------------------- communes */

const communes: Rule[] = [
  {
    id: "age_mineur",
    kind: "block",
    label: { fr: "Âge inférieur à 18 ans", en: "Under 18 years old" },
    detail: {
      fr: "Ces traitements ne peuvent pas être prescrits à une personne mineure.",
      en: "These treatments cannot be prescribed to a minor.",
    },
    when: (a) => {
      const age = ageOf(a);
      return age !== null && age < 18;
    },
  },
  {
    id: "allergie_declaree",
    kind: "malus",
    weight: 10,
    label: { fr: "Allergie déclarée", en: "Declared allergy" },
    detail: {
      fr: "Le médecin devra vérifier la composition du traitement avant toute prescription.",
      en: "The doctor will need to check the treatment's composition before prescribing.",
    },
    when: eq("allergies_oui", "oui"),
  },
  {
    id: "traitement_en_cours",
    kind: "malus",
    weight: 10,
    label: { fr: "Traitement en cours", en: "Ongoing medication" },
    detail: {
      fr: "Une vérification des interactions médicamenteuses sera nécessaire.",
      en: "Drug interactions will need to be checked.",
    },
    when: eq("medicaments_actuels_oui", "oui"),
  },
  {
    id: "pathologie_autre",
    kind: "malus",
    weight: 10,
    label: { fr: "Autre pathologie déclarée", en: "Other condition declared" },
    detail: {
      fr: "Une pathologie non listée demande une évaluation complémentaire.",
      en: "A condition outside the list requires further assessment.",
    },
    when: has("antecedents", "autre"),
  },
];

/* ------------------------------------------------------------- par domaine */

const parCategorie: Record<string, Rule[]> = {
  sexual: [
    {
      id: "sexual_cardio",
      kind: "block",
      label: {
        fr: "Maladie cardiaque ou vasculaire",
        en: "Heart or vascular disease",
      },
      detail: {
        fr: "Les traitements de l'érection (sildénafil, tadalafil) sont contre-indiqués en cas de pathologie cardiovasculaire ou de traitement par dérivés nitrés. Une consultation en présentiel est nécessaire.",
        en: "Erectile treatments (sildenafil, tadalafil) are contraindicated with cardiovascular disease or nitrate therapy. An in-person consultation is required.",
      },
      when: has("antecedents", "cardiovasculaire"),
    },
    {
      id: "sexual_age",
      kind: "block",
      label: { fr: "Âge supérieur à 80 ans", en: "Over 80 years old" },
      detail: {
        fr: "Au-delà de 80 ans, une évaluation en présentiel est requise avant prescription.",
        en: "Above 80, an in-person assessment is required before prescribing.",
      },
      when: (a) => {
        const age = ageOf(a);
        return age !== null && age > 80;
      },
    },
    {
      id: "sexual_hta",
      kind: "malus",
      weight: 20,
      label: { fr: "Hypertension artérielle", en: "High blood pressure" },
      detail: {
        fr: "Le médecin devra vérifier votre tension et vos traitements antihypertenseurs.",
        en: "The doctor will check your blood pressure and antihypertensive medication.",
      },
      when: has("antecedents", "hypertension"),
    },
    {
      id: "sexual_renal_hepatique",
      kind: "malus",
      weight: 20,
      label: { fr: "Atteinte rénale ou hépatique", en: "Kidney or liver condition" },
      detail: {
        fr: "Le dosage doit être adapté, une vérification biologique peut être demandée.",
        en: "Dosing must be adapted; a blood test may be requested.",
      },
      when: (a) => has("antecedents", "renal")(a) || has("antecedents", "hepatique")(a),
    },
  ],

  weight: [
    {
      id: "weight_imc",
      kind: "block",
      label: { fr: "IMC inférieur à 27", en: "BMI below 27" },
      detail: {
        fr: "Les traitements de gestion du poids (GLP-1) ne sont prescrits qu'à partir d'un IMC de 30, ou de 27 avec une complication associée.",
        en: "Weight management treatments (GLP-1) are only prescribed from a BMI of 30, or 27 with an associated condition.",
      },
      when: (a) => {
        const i = imcOf(a);
        return i !== null && i < 27;
      },
    },
    {
      id: "weight_imc_limite",
      kind: "malus",
      weight: 20,
      label: { fr: "IMC entre 27 et 30", en: "BMI between 27 and 30" },
      detail: {
        fr: "La prescription n'est possible que si une complication liée au poids est confirmée par le médecin.",
        en: "Prescribing is only possible if a weight-related complication is confirmed by the doctor.",
      },
      when: (a) => {
        const i = imcOf(a);
        return i !== null && i >= 27 && i < 30;
      },
    },
    {
      id: "weight_cancer",
      kind: "block",
      label: { fr: "Antécédent de cancer", en: "History of cancer" },
      detail: {
        fr: "Un antécédent de cancer (notamment thyroïdien) contre-indique les traitements GLP-1 sans avis spécialisé.",
        en: "A history of cancer (notably thyroid) contraindicates GLP-1 treatments without specialist advice.",
      },
      when: has("antecedents", "cancer"),
    },
    {
      id: "weight_renal",
      kind: "malus",
      weight: 20,
      label: { fr: "Maladie rénale", en: "Kidney disease" },
      detail: {
        fr: "Une surveillance rénale est nécessaire avec ces traitements.",
        en: "Kidney monitoring is required with these treatments.",
      },
      when: has("antecedents", "renal"),
    },
    {
      id: "weight_psy",
      kind: "malus",
      weight: 15,
      label: { fr: "Suivi psychiatrique", en: "Psychiatric follow-up" },
      detail: {
        fr: "Le médecin devra coordonner la prescription avec votre suivi actuel.",
        en: "The doctor will need to coordinate with your current follow-up.",
      },
      when: has("antecedents", "psy"),
    },
  ],

  hair: [
    {
      id: "hair_plaques",
      kind: "block",
      label: { fr: "Chute par plaques", en: "Patchy hair loss" },
      detail: {
        fr: "Une perte par plaques évoque une cause qui ne relève pas du finastéride ou du minoxidil : un examen dermatologique est nécessaire.",
        en: "Patchy loss suggests a cause that finasteride or minoxidil does not treat: a dermatological exam is needed.",
      },
      when: has("zone_chute", "plaques"),
    },
    {
      id: "hair_cancer",
      kind: "block",
      label: { fr: "Antécédent de cancer", en: "History of cancer" },
      detail: {
        fr: "Le finastéride modifie le dosage du PSA : un avis spécialisé est requis en cas d'antécédent de cancer.",
        en: "Finasteride alters PSA levels: specialist advice is required with a history of cancer.",
      },
      when: has("antecedents", "cancer"),
    },
    {
      id: "hair_hepatique",
      kind: "malus",
      weight: 25,
      label: { fr: "Maladie du foie", en: "Liver disease" },
      detail: {
        fr: "Le finastéride est métabolisé par le foie : une évaluation est nécessaire.",
        en: "Finasteride is metabolised by the liver: an assessment is required.",
      },
      when: has("antecedents", "hepatique"),
    },
    {
      id: "hair_psy",
      kind: "malus",
      weight: 15,
      label: { fr: "Trouble psychiatrique suivi", en: "Psychiatric condition" },
      detail: {
        fr: "Des troubles de l'humeur ont été rapportés sous finastéride : le médecin en tiendra compte.",
        en: "Mood disorders have been reported with finasteride: the doctor will take this into account.",
      },
      when: has("antecedents", "psy"),
    },
  ],

  skin: [
    {
      id: "skin_autre",
      kind: "block",
      label: { fr: "Motif hors périmètre", en: "Reason outside scope" },
      detail: {
        fr: "Une lésion non identifiée doit être examinée en présentiel avant toute prescription.",
        en: "An unidentified lesion must be examined in person before any prescription.",
      },
      when: eq("probleme_peau", "autre"),
    },
    {
      id: "skin_hepatique",
      kind: "malus",
      weight: 20,
      label: { fr: "Maladie du foie", en: "Liver disease" },
      detail: {
        fr: "Les rétinoïdes demandent une surveillance hépatique.",
        en: "Retinoids require liver monitoring.",
      },
      when: has("antecedents", "hepatique"),
    },
    {
      id: "skin_cancer",
      kind: "malus",
      weight: 20,
      label: { fr: "Antécédent de cancer", en: "History of cancer" },
      detail: {
        fr: "Un antécédent de cancer cutané impose un avis dermatologique.",
        en: "A history of skin cancer requires dermatological advice.",
      },
      when: has("antecedents", "cancer"),
    },
  ],
};

export type EligibilityLevel = "eligible" | "a_verifier" | "bloque";

export type EligibilityReason = {
  id: string;
  kind: "block" | "malus";
  label: Bilingual;
  detail: Bilingual;
  weight: number;
};

export type EligibilityResult = {
  score: number;
  level: EligibilityLevel;
  /** true = le patient peut réserver la consultation vidéo. */
  canBookVideo: boolean;
  blockers: EligibilityReason[];
  warnings: EligibilityReason[];
};

export const ELIGIBILITY_THRESHOLD = 60;

export function evaluateEligibility(category: string, answers: Answers): EligibilityResult {
  const rules = [...communes, ...(parCategorie[category] ?? [])];
  const matched = rules.filter((r) => {
    try {
      return r.when(answers);
    } catch {
      return false;
    }
  });

  const toReason = (r: Rule): EligibilityReason => ({
    id: r.id,
    kind: r.kind,
    label: r.label,
    detail: r.detail,
    weight: r.weight ?? 0,
  });

  const blockers = matched.filter((r) => r.kind === "block").map(toReason);
  const warnings = matched.filter((r) => r.kind === "malus").map(toReason);

  const malus = warnings.reduce((sum, r) => sum + r.weight, 0);
  const raw = Math.max(0, 100 - malus);
  const score = blockers.length ? Math.min(raw, 25) : raw;

  const level: EligibilityLevel = blockers.length
    ? "bloque"
    : score < ELIGIBILITY_THRESHOLD
      ? "bloque"
      : score < 85
        ? "a_verifier"
        : "eligible";

  return { score, level, canBookVideo: level !== "bloque", blockers, warnings };
}
