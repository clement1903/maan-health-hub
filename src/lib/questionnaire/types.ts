/**
 * MAAN — moteur de questionnaire médical adaptatif.
 *
 * Ce fichier décrit uniquement la STRUCTURE d'un questionnaire.
 * Aucune règle clinique n'est codée ici : les règles sont fournies par
 * chaque définition de questionnaire et restent des placeholders tant
 * que MAAN n'a pas validé de protocole clinique.
 */

export type QuestionType =
  | "boolean"
  | "single"
  | "multi"
  | "number"
  | "body" // taille / poids
  | "date"
  | "medications"
  | "conditions"
  | "text"
  | "symptoms"
  | "previous_treatments"
  | "allergies"
  | "lifestyle"
  | "file";

export type SectionId =
  | "identite"
  | "motif"
  | "symptomes"
  | "antecedents"
  | "medicaments"
  | "allergies"
  | "traitements_precedents"
  | "mode_de_vie"
  | "autres";

export const sectionLabels: Record<SectionId, string> = {
  identite: "Informations personnelles",
  motif: "Motif de la demande",
  symptomes: "Symptômes",
  antecedents: "Antécédents médicaux",
  medicaments: "Médicaments actuels",
  allergies: "Allergies",
  traitements_precedents: "Traitements précédents",
  mode_de_vie: "Mode de vie",
  autres: "Autres informations pertinentes",
};

export type Option = {
  value: string;
  label: string;
  description?: string;
  /** Option de type « aucune / rien de tout cela » : exclut les autres. */
  exclusive?: boolean;
};

/** Opérateurs de branchement. */
export type Operator =
  | "eq"
  | "neq"
  | "includes"
  | "excludes"
  | "answered"
  | "empty"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export type Predicate = {
  questionId: string;
  op: Operator;
  /** Sur les champs composés (taille/poids), cible une sous-clé. */
  path?: string;
  value?: string | number | boolean | string[];
};

export type Condition =
  | Predicate
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

export type AnswerValue =
  | string
  | number
  | boolean
  | string[]
  | { name: string; path: string }[]
  | Record<string, unknown>
  | null;

export type Answers = Record<string, AnswerValue>;

export type Question = {
  id: string;
  type: QuestionType;
  section: SectionId;
  /** Grande question affichée à l'écran. */
  title: string;
  /** Sous-titre court, ton rassurant. */
  subtitle?: string;
  /** « Pourquoi cette question ? » — explication simple et transparente. */
  why?: string;
  placeholder?: string;
  required?: boolean;
  options?: Option[];
  /** Contraintes pour les valeurs numériques. */
  min?: number;
  max?: number;
  unit?: string;
  maxLength?: number;
  /** Accepte plusieurs fichiers (type "file"). */
  multiple?: boolean;
  /** La question n'est affichée que si la condition est vraie. */
  condition?: Condition;
};

/** Signal interne d'aide à la décision — jamais une décision médicale. */
export type Signal = "green" | "amber" | "red";

export type ClinicalRule = {
  id: string;
  /** Description lisible par le médecin. */
  label: string;
  when: Condition;
  signal: Signal;
  /** Note transmise au médecin dans le dossier. */
  note: string;
  /** Placeholder tant qu'aucun protocole validé n'a été fourni. */
  placeholder: true;
};

export type TriggeredRule = {
  id: string;
  label: string;
  signal: Signal;
  note: string;
};

export type QuestionnaireDefinition = {
  id: string;
  /** Version du questionnaire, conservée dans chaque soumission. */
  version: string;
  slug: string;
  /** Clé de spécialité MAAN (sexual, weight, hair, skin…). */
  category: string;
  title: string;
  intro: string;
  /** Estimation du temps nécessaire, en minutes. */
  estimatedMinutes: number;
  questions: Question[];
  rules: ClinicalRule[];
  /** Documents éventuellement demandés (identifiants de questions "file"). */
  requestedDocuments?: string[];
};

/** Journal des modifications faites depuis l'écran de synthèse. */
export type EditLogEntry = {
  questionId: string;
  at: string;
  from: AnswerValue;
  to: AnswerValue;
};

export type SubmissionPayload = {
  definitionId: string;
  version: string;
  category: string;
  /** Réponses brutes du patient — toujours conservées telles quelles. */
  answers: Answers;
  /** Questions réellement affichées, dans l'ordre. */
  shownQuestions: string[];
  triggeredRules: TriggeredRule[];
  /** Signal global = le plus élevé des signaux déclenchés. */
  overallSignal: Signal;
  editLog: EditLogEntry[];
  submittedAt: string;
};
