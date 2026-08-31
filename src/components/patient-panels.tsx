import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/* ---------------------------------- Types --------------------------------- */

export type PatientDocument = {
  id: string;
  kind: string;
  title: string;
  summary: string | null;
  issued_by: string | null;
  issued_at: string;
  order_id: string | null;
};

export type SecureMessage = {
  id: string;
  body: string;
  topic: string;
  sender_role: string;
  created_at: string;
};

export type FollowUp = {
  id: string;
  scheduled_for: string;
  topic: string;
  note: string | null;
  status: string;
  order_id: string | null;
};

function useKindLabels(): Record<string, string> {
  const { t } = useI18n();
  return {
    ordonnance: t("Ordonnance", "Prescription"),
    compte_rendu: t("Compte rendu médical", "Medical report"),
    facture: t("Facture", "Invoice"),
    conseil: t("Conseils de traitement", "Treatment advice"),
  };
}

export function useFollowUpTopics() {
  const { t } = useI18n();
  return [
    { key: "suivi_traitement", label: t("Suivi de traitement", "Treatment follow-up") },
    { key: "ajustement", label: t("Ajustement de dosage", "Dosage adjustment") },
    { key: "renouvellement", label: t("Renouvellement d'ordonnance", "Prescription renewal") },
    { key: "effets", label: t("Effets indésirables", "Side effects") },
  ];
}

function useFollowUpStatus(): Record<string, string> {
  const { t } = useI18n();
  return {
    planifie: t("Planifié", "Scheduled"),
    confirme: t("Confirmé", "Confirmed"),
    termine: t("Terminé", "Completed"),
    annule: t("Annulé", "Cancelled"),
  };
}

/* -------------------------------- Documents ------------------------------- */

export function DocumentsPanel({ userId }: { userId: string }) {
  const { t, lang } = useI18n();
  const kindLabels = useKindLabels();
  const documents = useQuery({
    queryKey: ["documents", userId],
    queryFn: async (): Promise<PatientDocument[]> => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, kind, title, summary, issued_by, issued_at, order_id")
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PatientDocument[];
    },
  });

  const list = documents.data ?? [];
  const locale = lang === "en" ? "en-US" : "fr-FR";

  return (
    <div className="mt-10">
      <h2 className="font-section text-2xl font-medium tracking-tight">{t("Mes documents", "My documents")}</h2>
      <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">
        {t(
          "Ordonnances, comptes rendus et conseils déposés par l'équipe médicale. Ces documents restent privés et ne sont accessibles que depuis votre espace connecté.",
          "Prescriptions, reports and advice shared by the medical team. These documents remain private and are only accessible from your signed-in space.",
        )}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.length === 0 && (
          <p className="text-sm text-muted">
            {t(
              "Aucun document pour le moment. Ils apparaîtront ici après la décision médicale.",
              "No documents yet. They will appear here after the medical decision.",
            )}
          </p>
        )}
        {list.map((d) => (
          <article key={d.id} className="rounded-2xl border border-border bg-cream p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                {kindLabels[d.kind] ?? d.kind}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {new Date(d.issued_at).toLocaleDateString(locale)}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-medium">{d.title}</h3>
            {d.summary && <p className="mt-1 text-pretty text-sm text-muted">{d.summary}</p>}
            {d.issued_by && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {d.issued_by}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Messages -------------------------------- */

export function MessagesPanel({ userId }: { userId: string }) {
  const { t, lang } = useI18n();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("ordonnance");
  const [error, setError] = useState<string | null>(null);

  const messages = useQuery({
    queryKey: ["messages", userId],
    refetchInterval: 30000,
    queryFn: async (): Promise<SecureMessage[]> => {
      const { data, error: err } = await supabase
        .from("messages")
        .select("id, body, topic, sender_role, created_at")
        .order("created_at", { ascending: true });
      if (err) throw err;
      return (data ?? []) as SecureMessage[];
    },
  });

  const send = useMutation({
    mutationFn: async () => {
      const text = body.trim();
      if (!text) throw new Error(t("Votre message est vide.", "Your message is empty."));
      if (text.length > 4000)
        throw new Error(t("Message trop long (4000 caractères maximum).", "Message too long (4000 characters maximum)."));
      const { error: err } = await supabase.from("messages").insert({
        user_id: userId,
        sender_id: userId,
        sender_role: "patient",
        topic,
        body: text,
      });
      if (err) throw err;
    },
    onSuccess: () => {
      setBody("");
      setError(null);
      qc.invalidateQueries({ queryKey: ["messages", userId] });
    },
    onError: (e) => setError(e instanceof Error ? e.message : t("Envoi impossible.", "Unable to send.")),
  });

  const list = messages.data ?? [];
  const locale = lang === "en" ? "en-US" : "fr-FR";

  const topicButtons: [string, string][] = [
    ["ordonnance", t("Ordonnance", "Prescription")],
    ["ajustement", t("Ajustement", "Adjustment")],
    ["renouvellement", t("Renouvellement", "Renewal")],
    ["general", t("Autre", "Other")],
  ];

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h2 className="font-section text-2xl font-medium tracking-tight">{t("Messagerie sécurisée", "Secure messaging")}</h2>
        <p className="mt-2 max-w-[54ch] text-pretty text-sm text-muted">
          {t(
            "Échangez avec l'équipe médicale sur votre ordonnance, un ajustement de dosage ou un renouvellement. Conversation privée, jamais accessible publiquement.",
            "Exchange with the medical team about your prescription, a dosage adjustment or a renewal. Private conversation, never publicly accessible.",
          )}
        </p>

        <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-border bg-cream p-5">
          {list.length === 0 && (
            <p className="text-sm text-muted">
              {t("Aucun message. Posez votre première question ci-dessous.", "No messages yet. Ask your first question below.")}
            </p>
          )}
          {list.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                m.sender_role === "patient"
                  ? "ml-auto bg-clay text-cream"
                  : "bg-background text-foreground border border-border",
              )}
            >
              <p className="text-pretty whitespace-pre-wrap">{m.body}</p>
              <p
                className={cn(
                  "mt-1 font-mono text-[10px] uppercase tracking-[0.1em]",
                  m.sender_role === "patient" ? "text-cream/70" : "text-muted",
                )}
              >
                {m.sender_role === "patient" ? t("Vous", "You") : t("Équipe médicale", "Medical team")} ·{" "}
                {new Date(m.created_at).toLocaleString(locale)}
              </p>
            </div>
          ))}
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            send.mutate();
          }}
        >
          <div className="flex flex-wrap gap-2">
            {topicButtons.map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTopic(k)}
                className={cn(
                  "rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-400 ease-[var(--ease)]",
                  topic === k
                    ? "border-clay bg-clay text-cream"
                    : "border-border text-muted hover:border-clay/40 hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            maxLength={4000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("Décrivez votre question pour le médecin…", "Describe your question for the doctor…")}
            className="w-full resize-none rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-clay"
          />
          {error && <p className="text-sm text-clay">{error}</p>}
          <button
            type="submit"
            disabled={send.isPending}
            className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-clay-deep disabled:opacity-60"
          >
            {send.isPending ? t("Envoi…", "Sending…") : t("Envoyer au médecin", "Send to the doctor")}
          </button>
        </form>
      </section>

      <aside className="lg:col-span-5">
        <div className="rounded-2xl border border-border bg-cream p-6">
          <h3 className="font-section text-lg font-medium tracking-tight">{t("Confidentialité", "Privacy")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              {t(
                "Les messages sont rattachés à votre compte et lisibles uniquement par vous et l'équipe médicale.",
                "Messages are linked to your account and readable only by you and the medical team.",
              )}
            </li>
            <li>
              {t(
                "Aucune donnée de santé n'est envoyée par e-mail ou SMS : les notifications restent neutres.",
                "No health data is ever sent by email or SMS: notifications remain neutral.",
              )}
            </li>
            <li>{t("En cas d'urgence, contactez le 15 ou votre médecin traitant.", "In an emergency, call 15 or contact your treating physician.")}</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* -------------------------------- Suivi ---------------------------------- */

export function FollowUpPanel({
  userId,
  orderId,
}: {
  userId: string;
  orderId?: string | null;
}) {
  const { t, lang } = useI18n();
  const followUpTopics = useFollowUpTopics();
  const followUpStatus = useFollowUpStatus();
  const qc = useQueryClient();
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState(followUpTopics[0]!.key);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const minDate = useMemo(() => {
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    return d.toISOString().slice(0, 16);
  }, []);

  const followUps = useQuery({
    queryKey: ["follow_ups", userId],
    queryFn: async (): Promise<FollowUp[]> => {
      const { data, error: err } = await supabase
        .from("follow_ups")
        .select("id, scheduled_for, topic, note, status, order_id")
        .order("scheduled_for", { ascending: true });
      if (err) throw err;
      return (data ?? []) as FollowUp[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!date) throw new Error(t("Choisissez une date de suivi.", "Choose a follow-up date."));
      const when = new Date(date);
      if (Number.isNaN(when.getTime()) || when.getTime() < Date.now())
        throw new Error(t("La date doit être dans le futur.", "The date must be in the future."));
      const { error: err } = await supabase.from("follow_ups").insert({
        user_id: userId,
        order_id: orderId ?? null,
        scheduled_for: when.toISOString(),
        topic,
        note: note.trim().slice(0, 500) || null,
      });
      if (err) throw err;
    },
    onSuccess: () => {
      setNote("");
      setDate("");
      setError(null);
      qc.invalidateQueries({ queryKey: ["follow_ups", userId] });
    },
    onError: (e) => setError(e instanceof Error ? e.message : t("Planification impossible.", "Unable to schedule.")),
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase
        .from("follow_ups")
        .update({ status: "annule" })
        .eq("id", id);
      if (err) throw err;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["follow_ups", userId] }),
  });

  const list = followUps.data ?? [];
  const locale = lang === "en" ? "en-US" : "fr-FR";

  return (
    <div className="mt-8 rounded-[20px] border border-border bg-background p-7">
      <h3 className="font-section text-xl font-medium tracking-tight">{t("Planifier mon suivi", "Schedule my follow-up")}</h3>
      <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">
        {t(
          "Choisissez un créneau pour faire le point avec un médecin : tolérance, efficacité, ajustement ou renouvellement. Vous recevez un rappel discret.",
          "Choose a time slot to check in with a doctor: tolerance, effectiveness, adjustment or renewal. You will receive a discreet reminder.",
        )}
      </p>

      <form
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Date et heure", "Date and time")}
          </span>
          <input
            type="datetime-local"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-clay"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Sujet", "Topic")}
          </span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-clay"
          >
            {followUpTopics.map((tItem) => (
              <option key={tItem.key} value={tItem.key}>
                {tItem.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Note pour le médecin (optionnel)", "Note for the doctor (optional)")}
          </span>
          <textarea
            rows={2}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full resize-none rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-clay"
            placeholder={t("Ex. tolérance, effets ressentis, question de dosage", "E.g. tolerance, side effects, dosage question")}
          />
        </label>
        {error && <p className="text-sm text-clay sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-clay-deep disabled:opacity-60"
          >
            {create.isPending ? t("Planification…", "Scheduling…") : t("Planifier ce suivi", "Schedule this follow-up")}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3 border-t border-border pt-5">
        {list.length === 0 && <p className="text-sm text-muted">{t("Aucun suivi planifié.", "No follow-up scheduled.")}</p>}
        {list.map((f) => (
          <div key={f.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {new Date(f.scheduled_for).toLocaleString(locale)} ·{" "}
                {followUpTopics.find((tItem) => tItem.key === f.topic)?.label ?? f.topic}
              </p>
              {f.note && <p className="text-sm text-muted">{f.note}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                {followUpStatus[f.status] ?? f.status}
              </span>
              {f.status !== "annule" && f.status !== "termine" && (
                <button
                  type="button"
                  onClick={() => cancel.mutate(f.id)}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted underline underline-offset-4 hover:text-foreground"
                >
                  {t("Annuler", "Cancel")}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Préférences -------------------------------- */

export function NotificationPreferences({ userId }: { userId: string }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [saved, setSaved] = useState(false);

  const profile = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("phone, notify_email, notify_sms")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!profile.data) return;
    setPhone(profile.data.phone ?? "");
    setEmail(profile.data.notify_email ?? true);
    setSms(profile.data.notify_sms ?? false);
  }, [profile.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ phone: phone.trim() || null, notify_email: email, notify_sms: sms })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <div className="mt-8 rounded-[20px] border border-border bg-cream p-7">
      <h3 className="font-section text-xl font-medium tracking-tight">{t("Notifications discrètes", "Discreet notifications")}</h3>
      <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">
        {t(
          "Vous êtes prévenu à chaque changement d'étape, à l'expédition et avant chaque suivi. Les messages ne mentionnent jamais le traitement ni la spécialité concernée.",
          "You are notified at each step change, at shipping, and before each follow-up. Messages never mention the treatment or specialty concerned.",
        )}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={email}
            onChange={(e) => setEmail(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-clay)]"
          />
          {t("Recevoir les mises à jour par e-mail", "Receive updates by email")}
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={sms}
            onChange={(e) => setSms(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-clay)]"
          />
          {t("Recevoir les mises à jour par SMS", "Receive updates by SMS")}
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t("Numéro de mobile (pour les SMS)", "Mobile number (for SMS)")}
          </span>
          <input
            type="tel"
            value={phone}
            maxLength={20}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("+33 6 12 34 56 78", "+1 555 123 4567")}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-clay"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="rounded-full border border-clay px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-clay transition-colors hover:bg-clay hover:text-cream disabled:opacity-60"
        >
          {save.isPending ? t("Enregistrement…", "Saving…") : t("Enregistrer mes préférences", "Save my preferences")}
        </button>
        {saved && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
            {t("Préférences enregistrées", "Preferences saved")}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Notifications ----------------------------- */

function useNotificationChannelLabels(): Record<string, string> {
  const { t } = useI18n();
  return {
    email: t("E-mail", "Email"),
    sms: t("SMS", "SMS"),
  };
}

export function NotificationsFeed({ userId }: { userId: string }) {
  const { t, lang } = useI18n();
  const notificationChannelLabels = useNotificationChannelLabels();
  const notifications = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, channel, subject, body, status, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  const locale = lang === "en" ? "en-US" : "fr-FR";

  return (
    <section className="mt-6 rounded-[20px] border border-border bg-background p-6">
      <h3 className="font-section text-lg font-medium tracking-tight">{t("Notifications", "Notifications")}</h3>
      <p className="mt-1 text-sm text-muted">
        {t(
          "Chaque changement de statut déclenche un message discret, sans mention du traitement.",
          "Every status change triggers a discreet message, without mentioning the treatment.",
        )}
      </p>
      <div className="mt-5 space-y-3">
        {(notifications.data ?? []).length === 0 && (
          <p className="text-sm text-muted">{t("Aucune notification pour le moment.", "No notifications yet.")}</p>
        )}
        {(notifications.data ?? []).map((n) => (
          <article key={n.id} className="rounded-2xl border border-border bg-cream p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">{n.subject}</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                {notificationChannelLabels[n.channel] ?? n.channel}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{n.body}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {new Date(n.created_at).toLocaleString(locale)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
