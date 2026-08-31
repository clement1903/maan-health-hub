/**
 * Accès Supabase de l'espace patient.
 * Les lignes de la base sont converties ici vers le modèle d'interface
 * (src/lib/patient/types.ts) : les composants ne connaissent que ce modèle.
 */

import { supabase } from "@/integrations/supabase/client";
import { journeyStages } from "./types";
import type {
  ActionPriority,
  Bi,
  CaseStatus,
  Delivery,
  Doctor,
  Journey,
  Message,
  MessageAuthor,
  Notification,
  PatientAction,
  PatientData,
  Plan,
  StageDetail,
  Treatment,
} from "./types";

type Json = Record<string, unknown> | unknown[] | null;

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function humanAt(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dateFmt.format(d);
}

export const domainTitles: Record<string, string> = {
  sexual: "Sexual Management",
  weight: "Weight Management",
  hair: "Hair Management",
  skin: "Skin Management",
};

export const domainConditions: Record<string, Bi> = {
  sexual: { fr: "Santé sexuelle", en: "Sexual health" },
  weight: { fr: "Accompagnement du poids", en: "Weight support" },
  hair: { fr: "Perte de cheveux", en: "Hair loss" },
  skin: { fr: "Santé de la peau", en: "Skin health" },
};

export function defaultStages(submittedAt: string): Json {
  return [
    {
      key: "evaluation",
      detail: { fr: "Questionnaire envoyé.", en: "Questionnaire sent." },
      at: humanAt(submittedAt),
    },
    { key: "medecin" },
    { key: "decision" },
    { key: "pharmacie" },
    { key: "livraison" },
    { key: "suivi" },
  ];
}

function asBi(value: unknown, fallback: Bi = { fr: "", en: "" }): Bi {
  if (value && typeof value === "object" && "fr" in (value as Bi)) return value as Bi;
  return fallback;
}

function mapStages(raw: unknown): StageDetail[] {
  const list = Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
  return journeyStages.map((s) => {
    const found = list.find((item) => item['key'] === s.key) ?? {};
    const stage: StageDetail = { key: s.key };
    if (found['detail']) stage.detail = asBi(found['detail']);
    if (typeof found['at'] === "string") stage.at = found['at'];
    return stage;
  });
}

type DoctorRow = {
  id: string;
  name: string;
  role_fr: string;
  role_en: string;
  big: string | null;
  photo_url: string | null;
};

function mapDoctor(row: DoctorRow | null | undefined): Doctor | null {
  if (!row) return null;
  const doctor: Doctor = { id: row.id, name: row.name, role: { fr: row.role_fr, en: row.role_en } };
  if (row.big) doctor.big = row.big;
  if (row.photo_url) doctor.photo = row.photo_url;
  return doctor;
}

type JourneyRow = {
  id: string;
  domain: string;
  title: string;
  condition_fr: string;
  condition_en: string;
  status: string;
  stage_index: number;
  stages: unknown;
  treatment: unknown;
  delivery: unknown;
  follow_up: unknown;
  plan: unknown;
  progress: unknown;
  photos_enabled: boolean;
  doctors: DoctorRow | null;
};

export type PatientBundle = PatientData & { journeyRows: JourneyRow[] };

export async function fetchPatientData(userId: string): Promise<PatientData> {
  const [profileRes, journeysRes, messagesRes, actionsRes, notifsRes, measuresRes, photosRes] =
    await Promise.all([
      supabase.from("profiles").select("full_name, email").eq("id", userId).maybeSingle(),
      supabase
        .from("care_journeys")
        .select(
          "id, domain, title, condition_fr, condition_en, status, stage_index, stages, treatment, delivery, follow_up, plan, progress, photos_enabled, doctors(id, name, role_fr, role_en, big, photo_url)",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("journey_messages")
        .select("id, journey_id, author, author_name, body_fr, body_en, request, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      supabase
        .from("journey_actions")
        .select(
          "id, journey_id, title_fr, title_en, desc_fr, desc_en, priority, due_fr, due_en, cta_fr, cta_en, target, done",
        )
        .eq("user_id", userId)
        .eq("done", false)
        .order("created_at", { ascending: true }),
      supabase
        .from("patient_notifications")
        .select("id, title_fr, title_en, read, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("journey_measurements")
        .select("journey_id, value, recorded_at")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: true }),
      supabase
        .from("journey_photos")
        .select("id, journey_id, label_fr, label_en, src, taken_at")
        .eq("user_id", userId)
        .order("taken_at", { ascending: true }),
    ]);

  const fullName = profileRes.data?.full_name ?? "";
  const firstName = fullName.trim().split(/\s+/)[0] || (profileRes.data?.email ?? "").split("@")[0] || "";

  const journeyRows = (journeysRes.data ?? []) as unknown as JourneyRow[];
  const measures = measuresRes.data ?? [];
  const photos = photosRes.data ?? [];

  const journeys: Journey[] = journeyRows.map((row) => {
    const entries = measures
      .filter((m) => m.journey_id === row.id)
      .map((m) => ({ date: humanAt(m.recorded_at), value: Number(m.value) }));
    const progressRaw = (row.progress ?? null) as { unit?: string } | null;
    const journey: Journey = {
      id: row.id,
      domain: (row.domain as Journey["domain"]) ?? "sexual",
      title: row.title,
      condition: { fr: row.condition_fr, en: row.condition_en },
      status: (row.status as CaseStatus) ?? "SUBMITTED",
      stageIndex: row.stage_index,
      stages: mapStages(row.stages),
      doctor: mapDoctor(row.doctors),
      treatment: (row.treatment as Treatment | null) ?? null,
      delivery: (row.delivery as Delivery | null) ?? null,
      followUp: (row.follow_up as Journey["followUp"]) ?? { due: false },
      plan: (row.plan as Plan | null) ?? null,
    };
    if (progressRaw || entries.length > 0) {
      journey.progress = { kind: "weight", unit: progressRaw?.unit ?? "kg", entries };
    }
    if (row.photos_enabled) {
      journey.photos = {
        enabled: true,
        entries: photos
          .filter((p) => p.journey_id === row.id)
          .map((p) => ({
            id: p.id,
            label: { fr: p.label_fr, en: p.label_en },
            date: humanAt(p.taken_at),
            ...(p.src ? { src: p.src } : {}),
          })),
      };
    }
    return journey;
  });

  const messages: Message[] = (messagesRes.data ?? []).map((m) => {
    const msg: Message = {
      id: m.id,
      journeyId: m.journey_id ?? "",
      author: (m.author as MessageAuthor) ?? "system",
      body: { fr: m.body_fr, en: m.body_en },
      at: humanAt(m.created_at),
    };
    if (m.author_name) msg.authorName = m.author_name;
    const req = m.request as { question?: Bi; options?: Bi[]; answer?: string } | null;
    if (req?.question && Array.isArray(req.options)) {
      msg.request = {
        question: asBi(req.question),
        options: req.options.map((o) => asBi(o)),
        ...(req.answer ? { answer: req.answer } : {}),
      };
    }
    return msg;
  });

  const actions: PatientAction[] = (actionsRes.data ?? []).map((a) => {
    const action: PatientAction = {
      id: a.id,
      journeyId: a.journey_id ?? "",
      title: { fr: a.title_fr, en: a.title_en },
      desc: { fr: a.desc_fr, en: a.desc_en },
      priority: (a.priority as ActionPriority) ?? "normale",
      cta: { fr: a.cta_fr, en: a.cta_en },
      target: (a.target as PatientAction["target"]) ?? "messages",
      done: a.done,
    };
    if (a.due_fr || a.due_en) action.due = { fr: a.due_fr ?? "", en: a.due_en ?? "" };
    return action;
  });

  const notifications: Notification[] = (notifsRes.data ?? []).map((n) => ({
    id: n.id,
    title: { fr: n.title_fr, en: n.title_en },
    at: humanAt(n.created_at),
    read: n.read,
  }));

  const first = journeys[0];
  const headline: Bi = first
    ? { fr: "Votre espace MAAN est à jour.", en: "Your MAAN space is up to date." }
    : {
        fr: "Commencez une évaluation pour ouvrir votre premier parcours.",
        en: "Start an assessment to open your first journey.",
      };

  return { firstName, headline, journeys, actions, messages, notifications };
}
