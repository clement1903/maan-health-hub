/**
 * Couche d'accès aux données de l'espace patient.
 * Branchée sur le backend réel (comptes, parcours, messages, suivi).
 * L'interface ne connaît que ce contrat.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fetchPatientData } from "./api";
import type { Bi, Journey, PatientData } from "./types";

const emptyData: PatientData = {
  firstName: "",
  headline: { fr: "", en: "" },
  journeys: [],
  actions: [],
  messages: [],
  notifications: [],
};

type Ctx = {
  data: PatientData;
  loading: boolean;
  refresh: () => Promise<void>;
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

export function PatientProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<PatientData>(emptyData);
  const [loading, setLoading] = useState(true);
  const userId = user?.id;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!userId) {
      setData(emptyData);
      setLoading(false);
      return;
    }
    const next = await fetchPatientData(userId);
    if (!mounted.current) return;
    setData(next);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    void refresh();
  }, [authLoading, refresh]);

  // Mises à jour temps réel : messages du médecin, statut du parcours, notifications.
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`patient-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "journey_messages", filter: `user_id=eq.${userId}` },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "care_journeys", filter: `user_id=eq.${userId}` },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "journey_actions", filter: `user_id=eq.${userId}` },
        () => void refresh(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, refresh]);

  const journeyById = useCallback(
    (id: string) => data.journeys.find((j) => j.id === id),
    [data.journeys],
  );

  const answerInfoRequest = useCallback(
    (messageId: string, answer: string) => {
      if (!userId) return;
      const target = data.messages.find((m) => m.id === messageId);
      if (!target?.request) return;
      void (async () => {
        await supabase
          .from("journey_messages")
          .update({ request: { ...target.request, answer } as never })
          .eq("id", messageId);
        await supabase.from("journey_messages").insert({
          user_id: userId,
          journey_id: target.journeyId || null,
          author: "patient",
          body_fr: answer,
          body_en: answer,
        });
        await supabase.from("journey_actions").delete().eq("user_id", userId).eq("target", "messages");
        await refresh();
      })();
    },
    [data.messages, refresh, userId],
  );

  const sendPatientMessage = useCallback(
    (journeyId: string, body: string) => {
      if (!userId) return;
      void (async () => {
        await supabase.from("journey_messages").insert({
          user_id: userId,
          journey_id: journeyId || null,
          author: "patient",
          body_fr: body,
          body_en: body,
        });
        await refresh();
      })();
    },
    [refresh, userId],
  );

  const completeAction = useCallback(
    (actionId: string) => {
      setData((prev) => ({
        ...prev,
        actions: prev.actions.map((a) => (a.id === actionId ? { ...a, done: true } : a)),
      }));
      void (async () => {
        await supabase.from("journey_actions").update({ done: true }).eq("id", actionId);
        window.setTimeout(() => void refresh(), 900);
      })();
    },
    [refresh],
  );

  const submitFollowUp = useCallback(
    (journeyId: string, answers: Record<string, string>) => {
      if (!userId) return;
      const summary = Object.entries(answers)
        .map(([k, v]) => `${k} : ${v}`)
        .join(" · ");
      void (async () => {
        await supabase.from("journey_messages").insert({
          user_id: userId,
          journey_id: journeyId,
          author: "patient",
          body_fr: `Suivi envoyé — ${summary}`,
          body_en: `Follow-up sent — ${summary}`,
        });
        await supabase
          .from("care_journeys")
          .update({
            follow_up: { due: false, last: new Date().toISOString() } as never,
          })
          .eq("id", journeyId);
        await supabase.from("journey_actions").delete().eq("user_id", userId).eq("target", "suivi");
        await refresh();
      })();
    },
    [refresh, userId],
  );

  const addMeasurement = useCallback(
    (journeyId: string, value: number) => {
      if (!userId) return;
      void (async () => {
        await supabase
          .from("journey_measurements")
          .insert({ user_id: userId, journey_id: journeyId, kind: "weight", value });
        await refresh();
      })();
    },
    [refresh, userId],
  );

  const addPhoto = useCallback(
    (journeyId: string, label: Bi, src?: string) => {
      if (!userId) return;
      void (async () => {
        await supabase.from("journey_photos").insert({
          user_id: userId,
          journey_id: journeyId,
          label_fr: label.fr,
          label_en: label.en,
          src: src ?? null,
        });
        await refresh();
      })();
    },
    [refresh, userId],
  );

  const setPlanState = useCallback(
    (journeyId: string, state: "actif" | "pause" | "annule") => {
      const journey = data.journeys.find((j) => j.id === journeyId);
      if (!journey?.plan) return;
      void (async () => {
        await supabase
          .from("care_journeys")
          .update({ plan: { ...journey.plan, state } as never })
          .eq("id", journeyId);
        await refresh();
      })();
    },
    [data.journeys, refresh],
  );

  const markNotificationsRead = useCallback(() => {
    if (!userId) return;
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
    void supabase
      .from("patient_notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
  }, [userId]);

  const unreadMessages = useMemo(
    () =>
      data.messages.filter(
        (m) => (m.author === "doctor" || m.author === "maan") && m.request && m.request.answer === undefined,
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
      loading: loading || authLoading,
      refresh,
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
      authLoading,
      refresh,
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
