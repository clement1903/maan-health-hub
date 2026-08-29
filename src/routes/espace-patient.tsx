import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

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

const categories = [
  { key: "sexual", label: "Sexual Management" },
  { key: "weight", label: "Weight Management" },
  { key: "hair", label: "Hair Management" },
  { key: "skin", label: "Skin Management" },
];

const questions = [
  { key: "motif", label: "Quel est le motif principal de votre demande ?", placeholder: "Décrivez votre situation en quelques phrases." },
  { key: "anciennete", label: "Depuis combien de temps observez-vous ces symptômes ?", placeholder: "Ex. 6 mois" },
  { key: "antecedents", label: "Antécédents médicaux notables ?", placeholder: "Hypertension, diabète, chirurgie…" },
  { key: "traitements", label: "Traitements ou compléments en cours ?", placeholder: "Nom et dosage si connu" },
  { key: "allergies", label: "Allergies connues ?", placeholder: "Médicaments, excipients…" },
];

const intakeSchema = z.object({
  category: z.enum(["sexual", "weight", "hair", "skin"]),
  answers: z.record(z.string(), z.string().trim().max(1000)),
});

const statusLabels: Record<string, string> = {
  soumis: "Questionnaire soumis",
  en_revue: "En revue médicale",
  prescrit: "Prescription délivrée",
  refuse: "Non éligible",
  en_attente_validation: "En attente de validation médicale",
  prescription_validee: "Prescription validée",
  en_preparation: "En préparation en pharmacie",
  expedie: "Expédiée",
  livre: "Livrée",
};

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
};

type OrderEvent = {
  id: string;
  order_id: string;
  label: string;
  detail: string | null;
  created_at: string;
};

function PatientArea() {
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
            Chargement de votre espace…
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
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"questionnaire" | "suivi">("questionnaire");

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
        .select("id, reference, treatment, status, carrier, tracking_number, created_at")
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
            Espace patient
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Bonjour.</h1>
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
          Se déconnecter
        </button>
      </div>

      <div className="mt-8 flex w-full max-w-sm rounded-full border border-border p-1 font-mono text-[11px] uppercase tracking-[0.14em]">
        {(
          [
            ["questionnaire", "Questionnaire"],
            ["suivi", "Suivi & mises à jour"],
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

      {tab === "questionnaire" ? (
        <QuestionnaireTab
          userId={userId}
          list={questionnaires.data ?? []}
          onDone={() => {
            qc.invalidateQueries({ queryKey: ["questionnaires", userId] });
            qc.invalidateQueries({ queryKey: ["orders", userId] });
            qc.invalidateQueries({ queryKey: ["order_events", userId] });
            setTab("suivi");
          }}
        />
      ) : (
        <SuiviTab orders={orders.data ?? []} events={events.data ?? []} />
      )}
    </>
  );
}

function QuestionnaireTab({
  userId,
  list,
  onDone,
}: {
  userId: string;
  list: Questionnaire[];
  onDone: () => void;
}) {
  const [category, setCategory] = useState<string>("sexual");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = intakeSchema.safeParse({ category, answers });
      if (!parsed.success) throw new Error("Réponses trop longues ou domaine invalide.");
      if (!(answers["motif"] ?? "").trim()) throw new Error("Le motif principal est obligatoire.");

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
    onError: (e) => setError(e instanceof Error ? e.message : "Erreur lors de l'envoi."),
  });

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h2 className="font-display text-2xl font-medium tracking-tight">Nouveau questionnaire</h2>
        <p className="mt-2 max-w-[50ch] text-pretty text-sm text-muted">
          Vos réponses sont lues par un médecin agréé. Aucun traitement n'est expédié sans
          prescription validée.
        </p>

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
            {submit.isPending ? "Envoi…" : "Envoyer au médecin"}
          </button>
        </form>
      </section>

      <aside className="lg:col-span-5">
        <h2 className="font-display text-2xl font-medium tracking-tight">Mes questionnaires</h2>
        <div className="mt-6 space-y-3">
          {list.length === 0 && (
            <p className="text-sm text-muted">Aucun questionnaire envoyé pour le moment.</p>
          )}
          {list.map((q) => (
            <div key={q.id} className="rounded-2xl border border-border bg-cream p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay">
                  {categories.find((c) => c.key === q.category)?.label ?? q.category}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {new Date(q.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="mt-2 text-sm">{statusLabels[q.status] ?? q.status}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

const trackSteps = orderSteps.map((s) => s.key) as string[];

function SuiviTab({ orders, events }: { orders: Order[]; events: OrderEvent[] }) {
  if (orders.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-cream p-8">
        <p className="text-sm text-muted">
          Aucune commande en cours. Envoyez un questionnaire pour lancer votre parcours.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
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
                <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">
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
                          {new Date(evt.created_at).toLocaleString("fr-FR")}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            {(o.carrier || o.tracking_number) && (
              <p className="mt-5 text-sm text-muted">
                Transporteur : {o.carrier ?? "—"} · Suivi : {o.tracking_number ?? "—"}
              </p>
            )}

            <div className="mt-6 space-y-3 border-t border-border pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Mises à jour
              </p>
              {orderEvents.length === 0 && (
                <p className="text-sm text-muted">Aucune mise à jour pour le moment.</p>
              )}
              {orderEvents.map((e) => (
                <div key={e.id} className="flex gap-4">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  <div>
                    <p className="text-sm font-medium">{e.label}</p>
                    {e.detail && <p className="text-sm text-muted">{e.detail}</p>}
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                      {new Date(e.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        );
      })}

      <p className="text-xs text-muted">
        Besoin de comprendre chaque étape ?{" "}
        <Link to="/parcours" className="underline decoration-clay/50 underline-offset-4">
          Voir le parcours d'accès aux traitements
        </Link>
        .
      </p>
    </div>
  );
}
