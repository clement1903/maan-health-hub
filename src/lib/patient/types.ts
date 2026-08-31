/**
 * MAAN — modèle de données de l'espace patient.
 * Purement structurel : aucune logique clinique n'est encodée ici.
 * Les données affichées proviennent d'un adaptateur (démo aujourd'hui,
 * backend réel demain) — voir src/lib/patient/store.tsx.
 */

import type { Lang } from "@/lib/i18n";

export type Bi = { fr: string; en: string };

export function tr(v: Bi | string | undefined, lang: Lang): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return lang === "en" ? v.en : v.fr;
}

/** États techniques du dossier. Traduits en langage humain pour le patient. */
export type CaseStatus =
  | "DRAFT"
  | "QUESTIONNAIRE_IN_PROGRESS"
  | "QUESTIONNAIRE_COMPLETED"
  | "SUBMITTED"
  | "AWAITING_DOCTOR"
  | "DOCTOR_REVIEW"
  | "MORE_INFORMATION_REQUIRED"
  | "CONSULTATION_REQUIRED"
  | "MEDICAL_DECISION_COMPLETED"
  | "PRESCRIPTION_CREATED"
  | "SENT_TO_PHARMACY"
  | "PHARMACY_PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "FOLLOW_UP_DUE"
  | "FOLLOW_UP_COMPLETED"
  | "RENEWAL_REVIEW"
  | "PAUSED"
  | "CANCELLED";

export const statusHuman: Record<CaseStatus, Bi> = {
  DRAFT: { fr: "Dossier commencé.", en: "File started." },
  QUESTIONNAIRE_IN_PROGRESS: {
    fr: "Votre évaluation est en cours.",
    en: "Your assessment is in progress.",
  },
  QUESTIONNAIRE_COMPLETED: {
    fr: "Votre évaluation est complète.",
    en: "Your assessment is complete.",
  },
  SUBMITTED: { fr: "Votre dossier a été envoyé.", en: "Your file has been sent." },
  AWAITING_DOCTOR: {
    fr: "Votre dossier attend un médecin.",
    en: "Your file is waiting for a doctor.",
  },
  DOCTOR_REVIEW: {
    fr: "Votre médecin examine votre dossier.",
    en: "Your doctor is reviewing your file.",
  },
  MORE_INFORMATION_REQUIRED: {
    fr: "Votre médecin a besoin d'une information.",
    en: "Your doctor needs one piece of information.",
  },
  CONSULTATION_REQUIRED: {
    fr: "Une consultation en ligne est nécessaire.",
    en: "An online consultation is required.",
  },
  MEDICAL_DECISION_COMPLETED: {
    fr: "La décision médicale a été rendue.",
    en: "The medical decision has been made.",
  },
  PRESCRIPTION_CREATED: {
    fr: "Votre prescription a été délivrée.",
    en: "Your prescription has been issued.",
  },
  SENT_TO_PHARMACY: {
    fr: "Votre traitement est transmis à la pharmacie.",
    en: "Your treatment has been sent to the pharmacy.",
  },
  PHARMACY_PREPARING: {
    fr: "Votre traitement est en préparation.",
    en: "Your treatment is being prepared.",
  },
  SHIPPED: { fr: "Votre colis est en route.", en: "Your parcel is on its way." },
  DELIVERED: { fr: "Votre traitement est arrivé.", en: "Your treatment has arrived." },
  FOLLOW_UP_DUE: { fr: "Votre suivi est disponible.", en: "Your follow-up is available." },
  FOLLOW_UP_COMPLETED: { fr: "Votre suivi est enregistré.", en: "Your follow-up is recorded." },
  RENEWAL_REVIEW: {
    fr: "Votre renouvellement est en cours d'examen.",
    en: "Your renewal is under review.",
  },
  PAUSED: { fr: "Votre plan est en pause.", en: "Your plan is paused." },
  CANCELLED: { fr: "Votre plan est annulé.", en: "Your plan is cancelled." },
};

/** Les six étapes visibles du parcours de soin. */
export const journeyStages = [
  { key: "evaluation", label: { fr: "Évaluation", en: "Assessment" } },
  { key: "medecin", label: { fr: "Analyse médicale", en: "Medical review" } },
  { key: "decision", label: { fr: "Décision médicale", en: "Medical decision" } },
  { key: "pharmacie", label: { fr: "Préparation", en: "Preparation" } },
  { key: "livraison", label: { fr: "Livraison", en: "Delivery" } },
  { key: "suivi", label: { fr: "Suivi", en: "Follow-up" } },
] as const;

export type StageKey = (typeof journeyStages)[number]["key"];
export type StageState = "done" | "current" | "todo";

export type StageDetail = {
  key: StageKey;
  /** Précision affichée au clic sur l'étape. */
  detail?: Bi;
  /** Horodatage lisible (déjà formaté), ex. "28 août 2026 • 14:32". */
  at?: string;
};

export type Doctor = {
  id: string;
  name: string;
  role: Bi;
  big?: string;
  photo?: string;
};

export type Treatment = {
  name: string;
  posologie?: Bi;
  note?: Bi;
};

export type DeliveryStageKey = "prescription" | "preparation" | "expedition" | "livraison";

export type Delivery = {
  stage: DeliveryStageKey;
  eta?: string;
  carrier?: string;
  tracking?: string;
};

export type PlanState = "actif" | "pause" | "annule";

export type Plan = {
  state: PlanState;
  nextCharge?: string;
  nextDelivery?: string;
  nextMedicalReview?: string;
  /** Le renouvellement commercial n'est jamais une garantie de prescription. */
  medicalReviewRequired: boolean;
};

export type Measurement = { date: string; value: number };

export type ProgressTrack = {
  kind: "weight";
  unit: string;
  entries: Measurement[];
};

export type PhotoEntry = { id: string; label: Bi; date: string; src?: string };

export type PhotoModule = { enabled: boolean; entries: PhotoEntry[] };

export type Journey = {
  id: string;
  domain: "sexual" | "weight" | "hair" | "skin";
  title: string;
  condition: Bi;
  status: CaseStatus;
  stageIndex: number;
  stages: StageDetail[];
  doctor: Doctor | null;
  treatment: Treatment | null;
  delivery: Delivery | null;
  followUp: { last?: string; next?: string; due: boolean };
  plan: Plan | null;
  progress?: ProgressTrack;
  photos?: PhotoModule;
};

export type ActionPriority = "haute" | "normale" | "info";

export type PatientAction = {
  id: string;
  journeyId: string;
  title: Bi;
  desc: Bi;
  priority: ActionPriority;
  due?: Bi;
  cta: Bi;
  /** Destination interne de l'action. */
  target: "messages" | "suivi" | "traitement" | "profil";
  done?: boolean;
};

export type MessageAuthor = "doctor" | "maan" | "system" | "patient";

export type InfoRequest = {
  question: Bi;
  options: Bi[];
  answer?: string;
};

export type Message = {
  id: string;
  journeyId: string;
  author: MessageAuthor;
  authorName?: string;
  body: Bi;
  at: string;
  request?: InfoRequest;
};

export type Notification = {
  id: string;
  title: Bi;
  at: string;
  read: boolean;
};

export type PatientData = {
  firstName: string;
  headline: Bi;
  journeys: Journey[];
  actions: PatientAction[];
  messages: Message[];
  notifications: Notification[];
};

export function stageStateFor(journey: Journey, index: number): StageState {
  if (index < journey.stageIndex) return "done";
  if (index === journey.stageIndex) return "current";
  return "todo";
}
