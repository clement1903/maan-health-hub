import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-role";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { dispatchNotifications } from "@/lib/notifications.functions";
import { orderSteps } from "@/lib/order-status";
import { domaines } from "@/data/soins";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Espace administrateur — MAAN" },
      {
        name: "description",
        content:
          "Consultation des questionnaires, suivi des prescriptions et gestion de l'expédition des commandes MAAN.",
      },
      { property: "og:title", content: "Espace administrateur — MAAN" },
      {
        property: "og:description",
        content: "Questionnaires, prescriptions et expéditions MAAN.",
      },
      { property: "og:url", content: "/admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

type AdminQuestionnaire = {
  id: string;
  user_id: string;
  category: string;
  status: string;
  answers: Record<string, string>;
  created_at: string;
};

type AdminOrder = {
  id: string;
  user_id: string;
  questionnaire_id: string | null;
  reference: string;
  treatment: string;
  status: string;
  carrier: string | null;
  tracking_number: string | null;
  created_at: string;
};

type Profile = { id: string; full_name: string | null; email: string | null; phone: string | null };

type Notification = {
  id: string;
  channel: string;
  recipient: string | null;
  subject: string;
  status: string;
  created_at: string;
};

function buildOrderStatusLabels(t: (fr: string, en: string) => string): Record<string, string> {
  return {
    en_attente_validation: t("En attente de validation médicale", "Awaiting medical validation"),
    prescription_validee: t("Prescription validée", "Prescription validated"),
    en_preparation: t("En préparation en pharmacie", "Being prepared at the pharmacy"),
    expedie: t("Expédiée", "Shipped"),
    livre: t("Livrée", "Delivered"),
    refuse: t("Demande non retenue", "Request not accepted"),
  };
}

function buildQuestionnaireStatusLabels(t: (fr: string, en: string) => string): Record<string, string> {
  return {
    soumis: t("Questionnaire soumis", "Questionnaire submitted"),
    en_revue: t("En revue médicale", "Under medical review"),
    prescrit: t("Prescription délivrée", "Prescription issued"),
    refuse: t("Non éligible", "Not eligible"),
  };
}

function AdminPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(user?.id);

  if (!loading && !user) {
    navigate({ to: "/auth" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
        {loading || roleLoading || !user ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {t("Vérification des accès…", "Checking access…")}
          </p>
        ) : !isAdmin ? (
          <div className="rounded-[20px] border border-border bg-cream p-8">
            <h1 className="font-display text-2xl font-medium tracking-tight">{t("Accès réservé", "Restricted access")}</h1>
            <p className="mt-3 max-w-[52ch] text-pretty text-sm text-muted">
              {t(
                "Cet espace est réservé aux administrateurs MAAN. Si vous devez y accéder, demandez l'attribution du rôle administrateur à votre compte.",
                "This area is reserved for MAAN administrators. If you need access, ask for the administrator role to be granted to your account.",
              )}
            </p>
          </div>
        ) : (
          <AdminConsole />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function AdminConsole() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"questionnaires" | "commandes" | "notifications">(
    "questionnaires",
  );
  const dispatch = useServerFn(dispatchNotifications);
  const [flash, setFlash] = useState<string | null>(null);

  const profiles = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email, phone");
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });

  const questionnaires = useQuery({
    queryKey: ["admin", "questionnaires"],
    queryFn: async (): Promise<AdminQuestionnaire[]> => {
      const { data, error } = await supabase
        .from("questionnaires")
        .select("id, user_id, category, status, answers, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminQuestionnaire[];
    },
  });

  const orders = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async (): Promise<AdminOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, user_id, questionnaire_id, reference, treatment, status, carrier, tracking_number, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminOrder[];
    },
  });

  const notifications = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, channel, recipient, subject, status, created_at")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
  });

  const send = useMutation({
    mutationFn: () => dispatch({ data: undefined }),
    onSuccess: (r) => {
      setFlash(
        t(
          `${r.sent} envoyée(s), ${r.skipped} ignorée(s), ${r.failed} en échec.`,
          `${r.sent} sent, ${r.skipped} skipped, ${r.failed} failed.`,
        ),
      );
      qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
    onError: (e) =>
      setFlash(e instanceof Error ? e.message : t("Erreur d'envoi.", "Sending error.")),
  });

  const profileFor = (id: string) => profiles.data?.find((p) => p.id === id);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Espace administrateur", "Administrator area")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">{t("Console MAAN", "MAAN console")}</h1>
        </div>
        <button
          type="button"
          onClick={() => send.mutate()}
          disabled={send.isPending}
          className="rounded-full bg-clay px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-deep disabled:opacity-60"
        >
          {send.isPending ? t("Envoi…", "Sending…") : t("Envoyer les notifications en attente", "Send pending notifications")}
        </button>
      </div>
      {flash && <p className="mt-3 text-sm text-clay">{flash}</p>}

      <div className="mt-8 flex w-full max-w-xl rounded-full border border-border p-1 font-mono text-[11px] uppercase tracking-[0.12em]">
        {(
          [
            ["questionnaires", t("Questionnaires", "Questionnaires")],
            ["commandes", t("Commandes & expédition", "Orders & shipping")],
            ["notifications", t("Notifications", "Notifications")],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 rounded-full px-3 py-2 transition-all duration-400 ease-[var(--ease)]",
              tab === k ? "bg-clay text-cream" : "text-muted hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "questionnaires" && (
        <QuestionnairesAdmin list={questionnaires.data ?? []} profileFor={profileFor} />
      )}
      {tab === "commandes" && (
        <OrdersAdmin
          list={orders.data ?? []}
          profileFor={profileFor}
          onChanged={() => {
            qc.invalidateQueries({ queryKey: ["admin", "orders"] });
            qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
            send.mutate();
          }}
        />
      )}
      {tab === "notifications" && <NotificationsAdmin list={notifications.data ?? []} />}
    </>
  );
}

function QuestionnairesAdmin({
  list,
  profileFor,
}: {
  list: AdminQuestionnaire[];
  profileFor: (id: string) => Profile | undefined;
}) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);
  const questionnaireStatusLabels = buildQuestionnaireStatusLabels(t);

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("questionnaires").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "questionnaires"] }),
  });

  if (list.length === 0) {
    return <p className="mt-10 text-sm text-muted">{t("Aucun questionnaire pour le moment.", "No questionnaire yet.")}</p>;
  }

  return (
    <div className="mt-10 space-y-3">
      {list.map((q) => {
        const p = profileFor(q.user_id);
        const dom = domaines.find((d) => d.key === q.category);
        const expanded = open === q.id;
        return (
          <article key={q.id} className="rounded-[18px] border border-border bg-cream p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay">
                  {dom?.tag ?? q.category}
                </p>
                <h3 className="mt-1 font-section text-xl font-medium tracking-tight">
                  {p?.full_name || p?.email || t("Patient", "Patient")}
                </h3>
                <p className="text-sm text-muted">{p?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={q.status}
                  onChange={(e) => setStatus.mutate({ id: q.id, status: e.target.value })}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-clay"
                >
                  {Object.entries(questionnaireStatusLabels).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : q.id)}
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted underline decoration-clay/40 underline-offset-4"
                >
                  {expanded ? t("Masquer", "Hide") : t("Réponses", "Answers")}
                </button>
              </div>
            </div>
            {expanded && (
              <dl className="mt-5 space-y-3 border-t border-border pt-5">
                {Object.entries(q.answers ?? {}).map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {k}
                    </dt>
                    <dd className="mt-1 text-pretty text-sm">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
            )}
          </article>
        );
      })}
    </div>
  );
}

function OrdersAdmin({
  list,
  profileFor,
  onChanged,
}: {
  list: AdminOrder[];
  profileFor: (id: string) => Profile | undefined;
  onChanged: () => void;
}) {
  const { t } = useI18n();
  const orderStatusLabels = buildOrderStatusLabels(t);
  const update = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<AdminOrder, "status" | "carrier" | "tracking_number">>;
    }) => {
      const { error } = await supabase.from("orders").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: onChanged,
  });

  if (list.length === 0) {
    return <p className="mt-10 text-sm text-muted">{t("Aucune commande pour le moment.", "No order yet.")}</p>;
  }

  return (
    <div className="mt-10 space-y-4">
      {list.map((o) => {
        const p = profileFor(o.user_id);
        return (
          <article key={o.id} className="rounded-[18px] border border-border bg-cream p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay">
                  {o.reference}
                </p>
                <h3 className="mt-1 font-section text-xl font-medium tracking-tight">
                  {o.treatment}
                </h3>
                <p className="text-sm text-muted">
                  {p?.full_name || t("Patient", "Patient")} · {p?.email}
                </p>
              </div>
              <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                {orderStatusLabels[o.status] ?? o.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {t("État", "Status")}
                </span>
                <select
                  value={o.status}
                  onChange={(e) => update.mutate({ id: o.id, patch: { status: e.target.value } })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-clay"
                >
                  {orderSteps.map((s) => (
                    <option key={s.key} value={s.key}>
                      {orderStatusLabels[s.key]}
                    </option>
                  ))}
                  <option value="refuse">{orderStatusLabels["refuse"]}</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {t("Transporteur", "Carrier")}
                </span>
                <input
                  defaultValue={o.carrier ?? ""}
                  maxLength={80}
                  onBlur={(e) =>
                    e.target.value !== (o.carrier ?? "") &&
                    update.mutate({ id: o.id, patch: { carrier: e.target.value || null } })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-clay"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {t("Numéro de suivi", "Tracking number")}
                </span>
                <input
                  defaultValue={o.tracking_number ?? ""}
                  maxLength={80}
                  onBlur={(e) =>
                    e.target.value !== (o.tracking_number ?? "") &&
                    update.mutate({ id: o.id, patch: { tracking_number: e.target.value || null } })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-clay"
                />
              </label>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {t(
                "Chaque changement d'état crée un événement de suivi et une notification patient.",
                "Every status change creates a tracking event and a patient notification.",
              )}
            </p>
          </article>
        );
      })}
    </div>
  );
}

function NotificationsAdmin({ list }: { list: Notification[] }) {
  const { t, lang } = useI18n();
  if (list.length === 0) {
    return <p className="mt-10 text-sm text-muted">{t("Aucune notification.", "No notification.")}</p>;
  }
  return (
    <div className="mt-10 divide-y divide-border border-y border-border">
      {list.map((n) => (
        <div key={n.id} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-12 sm:gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-clay sm:col-span-1">
            {n.channel}
          </span>
          <span className="text-sm sm:col-span-5">{n.subject}</span>
          <span className="text-sm text-muted sm:col-span-3">{n.recipient ?? "—"}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:col-span-2">
            {n.status}
          </span>
          <span className="font-mono text-[10px] text-muted sm:col-span-1">
            {new Date(n.created_at).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR")}
          </span>
        </div>
      ))}
    </div>
  );
}
