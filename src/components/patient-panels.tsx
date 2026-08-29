import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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

const kindLabels: Record<string, string> = {
  ordonnance: "Ordonnance",
  compte_rendu: "Compte rendu médical",
  facture: "Facture",
  conseil: "Conseils de traitement",
};

export const followUpTopics = [
  { key: "suivi_traitement", label: "Suivi de traitement" },
  { key: "ajustement", label: "Ajustement de dosage" },
  { key: "renouvellement", label: "Renouvellement d'ordonnance" },
  { key: "effets", label: "Effets indésirables" },
];

const followUpStatus: Record<string, string> = {
  planifie: "Planifié",
  confirme: "Confirmé",
  termine: "Terminé",
  annule: "Annulé",
};

/* -------------------------------- Documents ------------------------------- */

export function DocumentsPanel({ userId }: { userId: string }) {
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

  return (
    <div className="mt-10">
      <h2 className="font-section text-2xl font-medium tracking-tight">Mes documents</h2>
      <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">
        Ordonnances, comptes rendus et conseils déposés par l'équipe médicale. Ces documents restent
        privés et ne sont accessibles que depuis votre espace connecté.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.length === 0 && (
          <p className="text-sm text-muted">
            Aucun document pour le moment. Ils apparaîtront ici après la décision médicale.
          </p>
        )}
        {list.map((d) => (
          <article key={d.id} className="rounded-2xl border border-border bg-cream p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                {kindLabels[d.kind] ?? d.kind}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {new Date(d.issued_at).toLocaleDateString("fr-FR")}
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
      if (!text) throw new Error("Votre message est vide.");
      if (text.length > 4000) throw new Error("Message trop long (4000 caractères maximum).");
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
    onError: (e) => setError(e instanceof Error ? e.message : "Envoi impossible."),
  });

  const list = messages.data ?? [];

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h2 className="font-section text-2xl font-medium tracking-tight">Messagerie sécurisée</h2>
        <p className="mt-2 max-w-[54ch] text-pretty text-sm text-muted">
          Échangez avec l'équipe médicale sur votre ordonnance, un ajustement de dosage ou un
          renouvellement. Conversation privée, jamais accessible publiquement.
        </p>

        <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-border bg-cream p-5">
          {list.length === 0 && (
            <p className="text-sm text-muted">
              Aucun message. Posez votre première question ci-dessous.
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
                {m.sender_role === "patient" ? "Vous" : "Équipe médicale"} ·{" "}
                {new Date(m.created_at).toLocaleString("fr-FR")}
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
            {[
              ["ordonnance", "Ordonnance"],
              ["ajustement", "Ajustement"],
              ["renouvellement", "Renouvellement"],
              ["general", "Autre"],
            ].map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTopic(k!)}
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
            placeholder="Décrivez votre question pour le médecin…"
            className="w-full resize-none rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-clay"
          />
          {error && <p className="text-sm text-clay">{error}</p>}
          <button
            type="submit"
            disabled={send.isPending}
            className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-clay-deep disabled:opacity-60"
          >
            {send.isPending ? "Envoi…" : "Envoyer au médecin"}
          </button>
        </form>
      </section>

      <aside className="lg:col-span-5">
        <div className="rounded-2xl border border-border bg-cream p-6">
          <h3 className="font-section text-lg font-medium tracking-tight">Confidentialité</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>Les messages sont rattachés à votre compte et lisibles uniquement par vous et l'équipe médicale.</li>
            <li>Aucune donnée de santé n'est envoyée par e-mail ou SMS : les notifications restent neutres.</li>
            <li>En cas d'urgence, contactez le 15 ou votre médecin traitant.</li>
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
      if (!date) throw new Error("Choisissez une date de suivi.");
      const when = new Date(date);
      if (Number.isNaN(when.getTime()) || when.getTime() < Date.now())
        throw new Error("La date doit être dans le futur.");
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
    onError: (e) => setError(e instanceof Error ? e.message : "Planification impossible."),
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

  return (
    <div className="mt-8 rounded-[20px] border border-border bg-background p-7">
      <h3 className="font-section text-xl font-medium tracking-tight">Planifier mon suivi</h3>
      <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">
        Choisissez un créneau pour faire le point avec un médecin : tolérance, efficacité,
        ajustement ou renouvellement. Vous recevez un rappel discret.
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
            Date et heure
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
            Sujet
          </span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-clay"
          >
            {followUpTopics.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Note pour le médecin (optionnel)
          </span>
          <textarea
            rows={2}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full resize-none rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-clay"
            placeholder="Ex. tolérance, effets ressentis, question de dosage"
          />
        </label>
        {error && <p className="text-sm text-clay sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-clay-deep disabled:opacity-60"
          >
            {create.isPending ? "Planification…" : "Planifier ce suivi"}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3 border-t border-border pt-5">
        {list.length === 0 && <p className="text-sm text-muted">Aucun suivi planifié.</p>}
        {list.map((f) => (
          <div key={f.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {new Date(f.scheduled_for).toLocaleString("fr-FR")} ·{" "}
                {followUpTopics.find((t) => t.key === f.topic)?.label ?? f.topic}
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
                  Annuler
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
      <h3 className="font-section text-xl font-medium tracking-tight">Notifications discrètes</h3>
      <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">
        Vous êtes prévenu à chaque changement d'étape, à l'expédition et avant chaque suivi. Les
        messages ne mentionnent jamais le traitement ni la spécialité concernée.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={email}
            onChange={(e) => setEmail(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-clay)]"
          />
          Recevoir les mises à jour par e-mail
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={sms}
            onChange={(e) => setSms(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-clay)]"
          />
          Recevoir les mises à jour par SMS
        </label>
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Numéro de mobile (pour les SMS)
          </span>
          <input
            type="tel"
            value={phone}
            maxLength={20}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
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
          {save.isPending ? "Enregistrement…" : "Enregistrer mes préférences"}
        </button>
        {saved && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
            Préférences enregistrées
          </span>
        )}
      </div>
    </div>
  );
}
