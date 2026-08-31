import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { journeyStages, statusHuman, tr, type CaseStatus } from "@/lib/patient/types";

type JourneyRow = {
  id: string;
  user_id: string;
  domain: string;
  title: string;
  status: string;
  stage_index: number;
  doctor_id: string | null;
  created_at: string;
};

type DoctorRow = { id: string; name: string; role_fr: string };

type Profile = { id: string; full_name: string | null; email: string | null };

const statuses = Object.keys(statusHuman) as CaseStatus[];

export function JourneysAdmin({ profileFor }: { profileFor: (id: string) => Profile | undefined }) {
  const { lang, t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);

  const journeys = useQuery({
    queryKey: ["admin", "journeys"],
    queryFn: async (): Promise<JourneyRow[]> => {
      const { data, error } = await supabase
        .from("care_journeys")
        .select("id, user_id, domain, title, status, stage_index, doctor_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JourneyRow[];
    },
  });

  const doctors = useQuery({
    queryKey: ["admin", "doctors"],
    queryFn: async (): Promise<DoctorRow[]> => {
      const { data, error } = await supabase.from("doctors").select("id, name, role_fr").eq("active", true);
      if (error) throw error;
      return (data ?? []) as DoctorRow[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("care_journeys").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "journeys"] }),
  });

  if (journeys.isLoading) {
    return <p className="mt-10 text-sm text-muted">{t("Chargement…", "Loading…")}</p>;
  }

  if ((journeys.data ?? []).length === 0) {
    return (
      <p className="mt-10 rounded-[18px] border border-border bg-card px-5 py-6 text-sm text-muted">
        {t("Aucun parcours patient pour le moment.", "No patient journey yet.")}
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {(journeys.data ?? []).map((j) => {
        const profile = profileFor(j.user_id);
        const expanded = open === j.id;
        return (
          <article key={j.id} className="rounded-[20px] border border-border bg-card p-5">
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : j.id)}
              className="flex w-full flex-wrap items-center gap-3 text-left"
            >
              <span className="font-section text-lg tracking-tight">{j.title}</span>
              <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {j.status}
              </span>
              <span className="text-sm text-muted">
                {profile?.full_name || profile?.email || j.user_id.slice(0, 8)}
              </span>
              <span className="ml-auto font-mono text-[11px] text-muted">
                {new Date(j.created_at).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR")}
              </span>
            </button>

            {expanded ? (
              <div className="mt-5 space-y-5 border-t border-border pt-5">
                <p className="text-sm text-muted">{tr(statusHuman[j.status as CaseStatus], lang)}</p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block text-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {t("Statut", "Status")}
                    </span>
                    <select
                      value={j.status}
                      onChange={(e) => update.mutate({ id: j.id, patch: { status: e.target.value } })}
                      className="mt-2 w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {t("Étape", "Stage")}
                    </span>
                    <select
                      value={j.stage_index}
                      onChange={(e) =>
                        update.mutate({ id: j.id, patch: { stage_index: Number(e.target.value) } })
                      }
                      className="mt-2 w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm"
                    >
                      {journeyStages.map((s, i) => (
                        <option key={s.key} value={i}>
                          {i + 1}. {tr(s.label, lang)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {t("Médecin assigné", "Assigned doctor")}
                    </span>
                    <select
                      value={j.doctor_id ?? ""}
                      onChange={(e) =>
                        update.mutate({ id: j.id, patch: { doctor_id: e.target.value || null } })
                      }
                      className="mt-2 w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">{t("Non assigné", "Unassigned")}</option>
                      {(doctors.data ?? []).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <DoctorMessageForm
                  journeyId={j.id}
                  userId={j.user_id}
                  doctorName={(doctors.data ?? []).find((d) => d.id === j.doctor_id)?.name ?? ""}
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function DoctorMessageForm({
  journeyId,
  userId,
  doctorName,
}: {
  journeyId: string;
  userId: string;
  doctorName: string;
}) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("Oui, Non");
  const [sent, setSent] = useState(false);

  const send = useMutation({
    mutationFn: async () => {
      const opts = options
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
        .map((o) => ({ fr: o, en: o }));
      const request =
        question.trim() && opts.length > 0
          ? { question: { fr: question.trim(), en: question.trim() }, options: opts }
          : null;
      const { error } = await supabase.from("journey_messages").insert({
        user_id: userId,
        journey_id: journeyId,
        author: "doctor",
        author_name: doctorName || null,
        body_fr: body.trim(),
        body_en: body.trim(),
        request: request as never,
      });
      if (error) throw error;
      if (request) {
        await supabase.from("journey_actions").insert({
          user_id: userId,
          journey_id: journeyId,
          title_fr: "Répondre à votre médecin",
          title_en: "Reply to your doctor",
          desc_fr: "Une information est nécessaire pour poursuivre votre dossier.",
          desc_en: "One piece of information is needed to continue your file.",
          priority: "haute",
          cta_fr: "Répondre maintenant",
          cta_en: "Reply now",
          target: "messages",
        });
      }
    },
    onSuccess: () => {
      setBody("");
      setQuestion("");
      setSent(true);
      qc.invalidateQueries({ queryKey: ["admin", "journeys"] });
      window.setTimeout(() => setSent(false), 2500);
    },
  });

  return (
    <form
      className="rounded-[16px] border border-border bg-background p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (body.trim()) send.mutate();
      }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
        {t("Message du médecin au patient", "Doctor message to the patient")}
      </p>
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t("Votre message…", "Your message…")}
        className="mt-3 w-full resize-none rounded-[12px] border border-border bg-card px-3 py-2 text-sm outline-none focus:border-clay"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("Question structurée (optionnel)", "Structured question (optional)")}
          className="rounded-[12px] border border-border bg-card px-3 py-2 text-sm outline-none focus:border-clay"
        />
        <input
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          placeholder={t("Réponses séparées par une virgule", "Answers separated by commas")}
          className="rounded-[12px] border border-border bg-card px-3 py-2 text-sm outline-none focus:border-clay"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={!body.trim() || send.isPending}
          className={cn(
            "rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep",
            (!body.trim() || send.isPending) && "opacity-60",
          )}
        >
          {send.isPending ? t("Envoi…", "Sending…") : t("Envoyer au patient", "Send to patient")}
        </button>
        {sent ? <span className="text-sm text-clay">{t("Message envoyé.", "Message sent.")}</span> : null}
      </div>
    </form>
  );
}
