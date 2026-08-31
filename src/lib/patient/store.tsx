/**
 * Couche d'accès aux données de l'espace patient.
 * Aujourd'hui alimentée par les scénarios de démonstration ; l'interface
 * ne connaît que ce contrat, ce qui permet de brancher un backend réel
 * et une authentification réelle sans toucher aux composants visuels.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { buildScenario, scenarioKeys, type ScenarioKey } from "./demo";
import type { Bi, Journey, Message, PatientData } from "./types";

const SCENARIO_KEY = "maan.patient.scenario";

type Ctx = {
  data: PatientData;
  loading: boolean;
  scenario: ScenarioKey;
  setScenario: (s: ScenarioKey) => void;
  journeyById: (id: string) => Journey | undefined;
  unreadMessages: number;
  pendingActions: number;
  answerInfoRequest: (messageId: string, answer: string) => void;
  sendPatientMessage: (journeyId: string, body: string) => void;
  completeAction: (actionId: string) => void;
  submitFollowUp: (journeyId: string, answers: Record<string, string>) => void;
  addMeasurement: (journeyId: string, value: number) => void;
  addPhoto: (journeyId: string, label: Bi, src?: string) => void;
  setPlanState: (journeyId: string, state: "actif" | "pause" | "annule") => void;
  markNotificationsRead: () => void;
};

const PatientContext = createContext<Ctx | null>(null);

function nowLabel() {
  return new Date().toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PatientProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<ScenarioKey>("B");
  const [data, setData] = useState<PatientData>(() => buildScenario("B"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(SCENARIO_KEY);
    const key = (scenarioKeys as readonly string[]).includes(stored ?? "")
      ? (stored as ScenarioKey)
      : "B";
    setScenarioState(key);
    setData(buildScenario(key));
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const setScenario = useCallback((s: ScenarioKey) => {
    setScenarioState(s);
    setData(buildScenario(s));
    setLoading(true);
    try {
      window.localStorage.setItem(SCENARIO_KEY, s);
    } catch {
      /* stockage indisponible */
    }
    window.setTimeout(() => setLoading(false), 320);
  }, []);

  const journeyById = useCallback(
    (id: string) => data.journeys.find((j) => j.id === id),
    [data.journeys],
  );

  const answerInfoRequest = useCallback((messageId: string, answer: string) => {
    setData((prev) => {
      const target = prev.messages.find((m) => m.id === messageId);
      if (!target?.request) return prev;
      const reply: Message = {
        id: `${messageId}-reply`,
        journeyId: target.journeyId,
        author: "patient",
        body: { fr: answer, en: answer },
        at: nowLabel(),
      };
      const confirm: Message = {
        id: `${messageId}-confirm`,
        journeyId: target.journeyId,
        author: "system",
        body: {
          fr: "Information envoyée au médecin.",
          en: "Information sent to the doctor.",
        },
        at: nowLabel(),
      };
      return {
        ...prev,
        messages: [
          ...prev.messages.map((m) =>
            m.id === messageId && m.request
              ? { ...m, request: { ...m.request, answer } }
              : m,
          ),
          reply,
          confirm,
        ],
        journeys: prev.journeys.map((j) =>
          j.id === target.journeyId
            ? {
                ...j,
                status: "DOCTOR_REVIEW" as const,
                stages: j.stages.map((s) =>
                  s.key === "medecin"
                    ? {
                        ...s,
                        detail: {
                          fr: "Information transmise. Analyse médicale en cours.",
                          en: "Information sent. Medical review in progress.",
                        },
                        at: nowLabel(),
                      }
                    : s,
                ),
              }
            : j,
        ),
        actions: prev.actions.filter((a) => a.target !== "messages"),
      };
    });
  }, []);

  const sendPatientMessage = useCallback((journeyId: string, body: string) => {
    setData((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `m-${Date.now()}`,
          journeyId,
          author: "patient",
          body: { fr: body, en: body },
          at: nowLabel(),
        },
      ],
    }));
  }, []);

  const completeAction = useCallback((actionId: string) => {
    setData((prev) => ({
      ...prev,
      actions: prev.actions.map((a) => (a.id === actionId ? { ...a, done: true } : a)),
    }));
    window.setTimeout(() => {
      setData((prev) => ({ ...prev, actions: prev.actions.filter((a) => a.id !== actionId) }));
    }, 900);
  }, []);

  const submitFollowUp = useCallback((journeyId: string, answers: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      journeys: prev.journeys.map((j) =>
        j.id === journeyId
          ? {
              ...j,
              status: "FOLLOW_UP_COMPLETED" as const,
              followUp: { ...j.followUp, last: nowLabel(), due: false },
            }
          : j,
      ),
      messages: [
        ...prev.messages,
        {
          id: `m-fu-${Date.now()}`,
          journeyId,
          author: "system",
          body: {
            fr: `Suivi envoyé (${Object.keys(answers).length} réponses). Votre médecin pourra le consulter.`,
            en: `Follow-up sent (${Object.keys(answers).length} answers). Your doctor will be able to review it.`,
          },
          at: nowLabel(),
        },
      ],
      actions: prev.actions.filter((a) => a.target !== "suivi"),
    }));
  }, []);

  const addMeasurement = useCallback((journeyId: string, value: number) => {
    setData((prev) => ({
      ...prev,
      journeys: prev.journeys.map((j) =>
        j.id === journeyId && j.progress
          ? {
              ...j,
              progress: {
                ...j.progress,
                entries: [
                  ...j.progress.entries,
                  {
                    date: new Date().toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                    value,
                  },
                ],
              },
            }
          : j,
      ),
    }));
  }, []);

  const addPhoto = useCallback((journeyId: string, label: Bi, src?: string) => {
    setData((prev) => ({
      ...prev,
      journeys: prev.journeys.map((j) =>
        j.id === journeyId && j.photos
          ? {
              ...j,
              photos: {
                ...j.photos,
                entries: [
                  ...j.photos.entries,
                  {
                    id: `p-${Date.now()}`,
                    label,
                    date: new Date().toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                    ...(src ? { src } : {}),
                  },
                ],
              },
            }
          : j,
      ),
    }));
  }, []);

  const setPlanState = useCallback((journeyId: string, state: "actif" | "pause" | "annule") => {
    setData((prev) => ({
      ...prev,
      journeys: prev.journeys.map((j) =>
        j.id === journeyId && j.plan ? { ...j, plan: { ...j.plan, state } } : j,
      ),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const unreadMessages = useMemo(
    () =>
      data.messages.filter(
        (m) => (m.author === "doctor" || m.author === "maan") && m.request?.answer === undefined && m.request,
      ).length,
    [data.messages],
  );

  const pendingActions = useMemo(
    () => data.actions.filter((a) => !a.done && a.priority !== "info").length,
    [data.actions],
  );

  const value = useMemo<Ctx>(
    () => ({
      data,
      loading,
      scenario,
      setScenario,
      journeyById,
      unreadMessages,
      pendingActions,
      answerInfoRequest,
      sendPatientMessage,
      completeAction,
      submitFollowUp,
      addMeasurement,
      addPhoto,
      setPlanState,
      markNotificationsRead,
    }),
    [
      data,
      loading,
      scenario,
      setScenario,
      journeyById,
      unreadMessages,
      pendingActions,
      answerInfoRequest,
      sendPatientMessage,
      completeAction,
      submitFollowUp,
      addMeasurement,
      addPhoto,
      setPlanState,
      markNotificationsRead,
    ],
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function usePatient() {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error("usePatient doit être utilisé dans <PatientProvider>");
  return ctx;
}
