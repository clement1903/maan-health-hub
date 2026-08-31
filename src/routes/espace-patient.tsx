import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import {
  DocumentsPanel,
  MessagesPanel,
  FollowUpPanel,
  NotificationPreferences,
  NotificationsFeed,
} from "@/components/patient-panels";
import { orderSteps } from "@/lib/order-status";
import { downloadQuestionnairePdf } from "@/lib/questionnaire-pdf";
import { OrderCheckout, type CheckoutOrder } from "@/components/order-checkout";
import { findDeliveryOption, paymentStatusLabels } from "@/lib/delivery";
import { questionnaireDefinitions } from "@/lib/questionnaire/definitions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/espace-patient")({
  head: () => ({
    meta: [
      { title: "Espace patient — MAAN, des soins pensés pour les hommes" },
      {
        name: "description",
        content:
          "Remplissez votre questionnaire médical, suivez la validation de votre prescription et l'état de votre livraison depuis votre espace patient MAAN.",
      },
      { property: "og:title", content: "Espace patient — MAAN" },
      {
        property: "og:description",
        content:
          "Questionnaire médical, validation de prescription et suivi de commande dans votre espace patient MAAN.",
      },
      { property: "og:url", content: "/espace-patient" },
      { name: "twitter:title", content: "Espace patient — MAAN" },
      {
        name: "twitter:description",
        content: "Questionnaire, prescription et suivi de commande chez MAAN.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/espace-patient" }],
  }),
  component: PatientArea,
});

function useCategories() {
  const { t } = useI18n();
  return [
    { key: "sexual", label: t("Sexual Management", "Sexual Management") },
    { key: "weight", label: t("Weight Management", "Weight Management") },
    { key: "hair", label: t("Hair Management", "Hair Management") },
    { key: "skin", label: t("Skin Management", "Skin Management") },
  ];
}

function useQuestions() {
  const { t } = useI18n();
  return [
    {
      key: "motif",
      label: t("Quel est le motif principal de votre demande ?", "What is the main reason for your request?"),
      placeholder: t("Décrivez votre situation en quelques phrases.", "Describe your situation in a few sentences."),
    },
    {
      key: "anciennete",
      label: t("Depuis combien de temps observez-vous ces symptômes ?", "How long have you noticed these symptoms?"),
      placeholder: t("Ex. 6 mois", "E.g. 6 months"),
    },
    {
      key: "antecedents",
      label: t("Antécédents médicaux notables ?", "Any notable medical history?"),
      placeholder: t("Hypertension, diabète, chirurgie…", "Hypertension, diabetes, surgery…"),
    },
    {
      key: "traitements",
      label: t("Traitements ou compléments en cours ?", "Any current treatments or supplements?"),
      placeholder: t("Nom et dosage si connu", "Name and dosage if known"),
    },
    {
      key: "allergies",
      label: t("Allergies connues ?", "Any known allergies?"),
      placeholder: t("Médicaments, excipients…", "Medications, excipients…"),
    },
  ];
}

const intakeSchema = z.object({
  category: z.enum(["sexual", "weight", "hair", "skin"]),
  answers: z.record(z.string(), z.string().trim().max(1000)),
});

function useStatusLabels(): Record<string, string> {
  const { t } = useI18n();
  return {
    soumis: t("Questionnaire soumis", "Questionnaire submitted"),
    en_revue: t("En revue médicale", "Under medical review"),
    prescrit: t("Prescription délivrée", "Prescription issued"),
    refuse: t("Non éligible", "Not eligible"),
    en_attente_validation: t("En attente de validation médicale", "Awaiting medical validation"),
    prescription_validee: t("Prescription validée", "Prescription validated"),
    en_preparation: t("En préparation en pharmacie", "Being prepared at the pharmacy"),
    expedie: t("Expédiée", "Shipped"),
    livre: t("Livrée", "Delivered"),
  };
}

type Questionnaire = {
  id: string;
  category: string;
  status: string;
  created_at: string;
  answers: Record<string, string>;
};

type Order = {
  id: string;
  reference: string;
  treatment: string;
  status: string;
  carrier: string | null;
  tracking_number: string | null;
  created_at: string;
} & CheckoutOrder;

type OrderEvent = {
  id: string;
  order_id: string;
  label: string;
  detail: string | null;
  created_at: string;
};

function PatientArea() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        {loading || !user ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {t("Chargement de votre espace…", "Loading your space…")}
          </p>
        ) : (
          <Dashboard email={user.email ?? ""} userId={user.id} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Dashboard({ email, userId }: { email: string; userId: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"questionnaire" | "suivi" | "documents" | "messages" | "parametres">("questionnaire");

  const questionnaires = useQuery({
    queryKey: ["questionnaires", userId],
    queryFn: async (): Promise<Questionnaire[]> => {
      const { data, error } = await supabase
        .from("questionnaires")
        .select("id, category, status, created_at, answers")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Questionnaire[];
    },
  });

  const orders = useQuery({
    queryKey: ["orders", userId],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, reference, treatment, status, carrier, tracking_number, created_at, delivery_method, delivery_address, delivery_eta_min_days, delivery_eta_max_days, payment_status, amount_cents, paid_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Order[];
    },
  });

  const events = useQuery({
    queryKey: ["order_events", userId],
    queryFn: async (): Promise<OrderEvent[]> => {
      const { data, error } = await supabase
        .from("order_events")
        .select("id, order_id, label, detail, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderEvent[];
    },
  });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
            {t("Espace patient", "Patient area")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">{t("Bonjour.", "Hello.")}</h1>
          <p className="mt-2 text-sm text-muted">{email}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
          className="rounded-full border border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-clay/40 hover:text-foreground"
        >
          {t("Se déconnecter", "Sign out")}
        </button>
      </div>

      <div className="mt-8 flex w-full max-w-3xl flex-wrap gap-1 rounded-full border border-border p-1 font-mono text-[11px] uppercase tracking-[0.14em]">
        {(
          [
            ["questionnaire", t("Questionnaire", "Questionnaire")],
            ["suivi", t("Suivi & mises à jour", "Tracking & updates")],
            ["documents", t("Documents", "Documents")],
            ["messages", t("Messagerie", "Messages")],
            ["parametres", t("Paramètres", "Settings")],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-full px-3 py-2 transition-all duration-400 ease-[var(--ease)]",
              tab === k ? "bg-clay text-cream" : "text-muted hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "questionnaire" && (
        <QuestionnaireTab
          userId={userId}
          email={email}
          list={questionnaires.data ?? []}
          onDone={() => {
            qc.invalidateQueries({ queryKey: ["questionnaires", userId] });
            qc.invalidateQueries({ queryKey: ["orders", userId] });
            qc.invalidateQueries({ queryKey: ["order_events", userId] });
            setTab("suivi");
          }}
        />
      )}
      {tab === "suivi" && (
        <>
          <SuiviTab orders={orders.data ?? []} events={events.data ?? []} userId={userId} />
          <NotificationsFeed userId={userId} />
          <FollowUpPanel userId={userId} orderId={orders.data?.[0]?.id ?? null} />
        </>
      )}
      {tab === "documents" && <DocumentsPanel userId={userId} />}
      {tab === "messages" && <MessagesPanel userId={userId} />}
      {tab === "parametres" && <NotificationPreferences userId={userId} />}

    </>
  );
}

function QuestionnaireTab({
  userId,
  email,
  list,
  onDone,
}: {
  userId: string;
  email: string;
  list: Questionnaire[];
  onDone: () => void;
}) {
  const { t, lang } = useI18n();
  const categories = useCategories();
  const questions = useQuestions();
  const statusLabels = useStatusLabels();
  const [category, setCategory] = useState<string>("sexual");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = intakeSchema.safeParse({ category, answers });
      if (!parsed.success) throw new Error(t("Réponses trop longues ou domaine invalide.", "Answers too long or invalid category."));
      if (!(answers["motif"] ?? "").trim())
        throw new Error(t("Le motif principal est obligatoire.", "The main reason is required."));

      const { data: q, error: qErr } = await supabase
        .from("questionnaires")
        .insert({ user_id: userId, category: parsed.data.category, answers: parsed.data.answers, status: "en_revue" })
        .select("id")
        .single();
      if (qErr) throw qErr;

      const label = categories.find((c) => c.key === category)?.label ?? category;
      const reference = `MAAN-${Date.now().toString(36).toUpperCase().slice(-6)}`;

      const { data: order, error: oErr } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          questionnaire_id: q.id,
          reference,
          treatment: label,
          status: "en_attente_validation",
        })
        .select("id")
        .single();
      if (oErr) throw oErr;

      const { error: eErr } = await supabase.from("order_events").insert([
        {
          order_id: order.id,
          user_id: userId,
          label: "Questionnaire reçu",
          detail: "Votre questionnaire a été transmis à un médecin pour évaluation.",
        },
      ]);
      if (eErr) throw eErr;
    },
    onSuccess: () => {
      setAnswers({});
      setError(null);
      onDone();
    },
    onError: (e) => setError(e instanceof Error ? e.message : t("Erreur lors de l'envoi.", "An error occurred while sending.")),
  });

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h2 className="font-section text-2xl font-medium tracking-tight">
          {t("Nouveau questionnaire", "New questionnaire")}
        </h2>
        <p className="mt-2 max-w-[50ch] text-pretty text-sm text-muted">
          {t(
            "Vos réponses sont lues par un médecin agréé. Aucun traitement n'est expédié sans prescription validée.",
            "Your answers are reviewed by a licensed doctor. No treatment is shipped without a validated prescription.",
          )}
        </p>

        <div className="mt-6 rounded-[18px] border border-border bg-card p-5">
          <p className="font-section text-base font-semibold tracking-tight">
            {t("Questionnaire guidé, une question à la fois", "Guided questionnaire, one question at a time")}
          </p>
          <p className="mt-2 text-sm text-muted">
            {t(
              "Adapté à votre situation, enregistré automatiquement, reprenable à tout moment.",
              "Tailored to your situation, automatically saved, and resumable at any time.",
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {questionnaireDefinitions.map((d) => (
              <Link
                key={d.id}
                to="/questionnaire/$slug"
                params={{ slug: d.slug }}
                className="rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-clay transition hover:border-clay"
              >
                {d.title} · {d.estimatedMinutes} {t("min", "min")}
              </Link>
            ))}
          </div>
        </div>


        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-400 ease-[var(--ease)]",
                category === c.key
                  ? "border-clay bg-clay text-cream"
                  : "border-border text-muted hover:border-clay/40 hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <form
          className="mt-7 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          {questions.map((q) => (
            <label key={q.key} className="block">
              <span className="text-sm font-medium">{q.label}</span>
              <textarea
                rows={q.key === "motif" ? 3 : 2}
                maxLength={1000}
                placeholder={q.placeholder}
                value={answers[q.key] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-clay"
              />
            </label>
          ))}

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={submit.isPending}
            className="rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:bg-clay-deep disabled:opacity-60"
          >
            {submit.isPending ? t("Envoi…", "Sending…") : t("Envoyer au médecin", "Send to the doctor")}
          </button>
        </form>
      </section>

      <aside className="lg:col-span-5">
        <h2 className="font-section text-2xl font-medium tracking-tight">
          {t("Mes questionnaires", "My questionnaires")}
        </h2>
        <div className="mt-6 space-y-3">
          {list.length === 0 && (
            <p className="text-sm text-muted">{t("Aucun questionnaire envoyé pour le moment.", "No questionnaire sent yet.")}</p>
          )}
          {list.map((q) => (
            <div key={q.id} className="rounded-2xl border border-border bg-cream p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay">
                  {categories.find((c) => c.key === q.category)?.label ?? q.category}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {new Date(q.created_at).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR")}
                </span>
              </div>
              <p className="mt-2 text-sm">{statusLabels[q.status] ?? q.status}</p>
              <button
                type="button"
                onClick={() => downloadQuestionnairePdf(q as never, email)}
                className="mt-3 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-clay/40 hover:text-foreground"
              >
                {t("Télécharger le récapitulatif PDF", "Download PDF summary")}
              </button>
            </div>
          ))}

        </div>
      </aside>
    </div>
  );
}

const trackSteps = orderSteps.map((s) => s.key) as string[];

function useOverviewSteps() {
  const { t } = useI18n();
  return [
    { key: "en_attente_validation", label: t("Reçu", "Received") },
    { key: "prescription_validee", label: t("En revue / approuvé", "Under review / approved") },
    { key: "en_preparation", label: t("En préparation", "In preparation") },
    { key: "expedie", label: t("Expédié", "Shipped") },
    { key: "livre", label: t("Livré", "Delivered") },
  ];
}

function StatusOverview({ orders }: { orders: Order[] }) {
  const { t } = useI18n();
  const overviewSteps = useOverviewSteps();
  const statusLabels = useStatusLabels();
  const latest = orders[0];
  if (!latest) return null;
  const index = Math.max(0, trackSteps.indexOf(latest.status));
  const pct = ((index + 1) / overviewSteps.length) * 100;

  return (
    <section className="rounded-[20px] border border-border bg-background p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay">
            {t("Statut de ma demande", "Status of my request")}
          </p>
          <h3 className="mt-1 font-section text-2xl font-medium tracking-tight">
            {statusLabels[latest.status] ?? latest.status}
          </h3>
        </div>
        <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
          {paymentStatusLabels[latest.payment_status] ?? latest.payment_status}
        </span>
      </div>

      <div
        className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("Avancement de la demande", "Request progress")}
      >
        <span
          className="block h-full rounded-full bg-clay transition-[width] duration-700 ease-[var(--ease)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-5">
        {overviewSteps.map((s, i) => (
          <li
            key={s.key}
            className={cn(
              "rounded-xl border px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
              i <= index ? "border-clay/40 bg-clay/[0.07] text-clay" : "border-border text-muted",
            )}
          >
            {s.label}
          </li>
        ))}
      </ol>
    </section>
  );
}

function SuiviTab({
  orders,
  events,
  userId,
}: {
  orders: Order[];
  events: OrderEvent[];
  userId: string;
}) {
  const { t, lang } = useI18n();
  const statusLabels = useStatusLabels();
  if (orders.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-cream p-8">
        <p className="text-sm text-muted">
          {t("Aucune commande en cours. Envoyez un questionnaire pour lancer votre parcours.", "No order in progress. Submit a questionnaire to start your journey.")}
        </p>
      </div>
    );
  }

  const locale = lang === "en" ? "en-US" : "fr-FR";

  return (
    <div className="mt-10 space-y-6">
      <StatusOverview orders={orders} />
      {orders.map((o) => {
        const stepIndex = Math.max(0, trackSteps.indexOf(o.status));
        const orderEvents = events.filter((e) => e.order_id === o.id);
        return (
          <article key={o.id} className="rounded-[20px] border border-border bg-cream p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay">
                  {o.reference}
                </p>
                <h3 className="mt-1 font-section text-2xl font-medium tracking-tight">
                  {o.treatment}
                </h3>
              </div>
              <span className="rounded-full border border-clay/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-clay">
                {statusLabels[o.status] ?? o.status}
              </span>
            </div>

            <ol className="mt-7 space-y-0">
              {orderSteps.map((s, i) => {
                const done = i <= stepIndex;
                const current = i === stepIndex;
                const evt = orderEvents.find(
                  (e) => e.label.toLowerCase() === s.label.toLowerCase(),
                );
                return (
                  <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < orderSteps.length - 1 && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-[7px] top-4 h-full w-px transition-colors duration-500",
                          i < stepIndex ? "bg-clay" : "bg-border",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "relative mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 transition-all duration-500 ease-[var(--ease)]",
                        done ? "border-clay bg-clay" : "border-border bg-background",
                        current && "shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-clay)_18%,transparent)]",
                      )}
                    />
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors",
                          done ? "text-foreground" : "text-muted",
                        )}
                      >
                        {s.label}
                      </p>
                      <p className="text-pretty text-sm text-muted">{s.desc}</p>
                      {evt && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-clay">
                          {new Date(evt.created_at).toLocaleString(locale)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            {o.delivery_method && o.delivery_eta_min_days !== null && (
              <p className="mt-4 text-sm text-muted">
                {findDeliveryOption(o.delivery_method).label} ·{" "}
                {t("réception estimée sous", "estimated delivery within")}{" "}
                {o.delivery_eta_min_days}–{o.delivery_eta_max_days}{" "}
                {t("jours ouvrés après expédition", "business days after shipping")}
                {o.delivery_address?.city ? ` · ${o.delivery_address.city}` : ""}
              </p>
            )}

            <OrderCheckout order={o} userId={userId} />

            {(o.carrier || o.tracking_number) && (
              <p className="mt-5 text-sm text-muted">
                {t("Transporteur", "Carrier")} : {o.carrier ?? "—"} · {t("Suivi", "Tracking")} :{" "}
                {o.tracking_number ?? "—"}
              </p>
            )}

            <div className="mt-6 space-y-3 border-t border-border pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {t("Mises à jour", "Updates")}
              </p>
              {orderEvents.length === 0 && (
                <p className="text-sm text-muted">{t("Aucune mise à jour pour le moment.", "No updates yet.")}</p>
              )}
              {orderEvents.map((e) => (
                <div key={e.id} className="flex gap-4">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  <div>
                    <p className="text-sm font-medium">{e.label}</p>
                    {e.detail && <p className="text-sm text-muted">{e.detail}</p>}
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                      {new Date(e.created_at).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        );
      })}

      <p className="text-xs text-muted">
        {t("Besoin de comprendre chaque étape ?", "Need to understand each step?")}{" "}
        <Link to="/parcours" className="underline decoration-clay/50 underline-offset-4">
          {t("Voir le parcours d'accès aux traitements", "View the treatment access journey")}
        </Link>
        .
      </p>
    </div>
  );
}
