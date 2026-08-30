import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QuestionnaireRunner } from "@/components/questionnaire/runner";
import { findDefinitionBySlug, questionnaireDefinitions } from "@/lib/questionnaire/definitions";
import type { Answers, SubmissionPayload } from "@/lib/questionnaire/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/questionnaire/$slug")({
  validateSearch: (search: Record<string, unknown>): { produit?: string } =>
    typeof search['produit'] === "string" && search['produit']
      ? { produit: search['produit'] as string }
      : {},
  head: () => ({
    meta: [
      { title: "Questionnaire médical — MAAN" },
      {
        name: "description",
        content:
          "Répondez à quelques questions pour permettre à un médecin indépendant d'évaluer votre dossier. Sauvegarde automatique, reprise à tout moment.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Questionnaire médical — MAAN" },
      {
        property: "og:description",
        content:
          "Un questionnaire conversationnel, une question à la fois, pour préparer votre évaluation médicale.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Questionnaire médical — MAAN" },
      {
        name: "twitter:description",
        content: "Préparez votre dossier médical MAAN en quelques minutes.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuestionnairePage,
});

type Draft = { answers: Answers; currentQuestionId: string | null };

function localKey(slug: string) {
  return `maan.questionnaire.${slug}`;
}

function QuestionnairePage() {
  const { slug } = Route.useParams();
  const { produit } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const definition = findDefinitionBySlug(slug);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!definition) return;
    let cancelled = false;
    const load = async () => {
      const local = window.localStorage.getItem(localKey(slug));
      let base: Draft | null = local ? (JSON.parse(local) as Draft) : null;
      if (user) {
        const { data } = await supabase
          .from("questionnaire_drafts")
          .select("answers, current_question_id")
          .eq("definition_id", definition.id)
          .maybeSingle();
        if (data) {
          base = {
            answers: (data.answers ?? {}) as Answers,
            currentQuestionId: data.current_question_id ?? null,
          };
        }

      }
      if (!cancelled) {
        setDraft(base);
        setReady(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [slug, user, definition]);

  if (!definition) {
    return (
      <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-24 text-center">
          <h1 className="font-display text-3xl">Questionnaire introuvable</h1>
          <ul className="mt-8 space-y-2">
            {questionnaireDefinitions.map((d) => (
              <li key={d.id}>
                <Link to="/questionnaire/$slug" params={{ slug: d.slug }} className="text-clay underline">
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const autosave = (state: Draft) => {
    window.localStorage.setItem(localKey(slug), JSON.stringify(state));
    if (!user) return;
    void supabase.from("questionnaire_drafts").upsert(
      {
        user_id: user.id,
        definition_id: definition.id,
        version: definition.version,
        answers: state.answers as never,
        current_question_id: state.currentQuestionId,
      },
      { onConflict: "user_id,definition_id" },
    );
  };

  const submit = async (payload: SubmissionPayload) => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setSubmitting(true);
    setError(null);
    const { data: questionnaire, error: qError } = await supabase
      .from("questionnaires")
      .insert({
        user_id: user.id,
        category: payload.category,
        answers: payload as never,
        status: "soumis",
        definition_id: payload.definitionId,
        version: payload.version,
        shown_questions: payload.shownQuestions as never,
        triggered_rules: payload.triggeredRules as never,
        overall_signal: payload.overallSignal,
        edit_log: payload.editLog as never,
        submitted_at: payload.submittedAt,
      })
      .select("id")
      .single();

    if (qError || !questionnaire) {
      setSubmitting(false);
      setError("L'envoi a échoué. Réessayez dans un instant.");
      return;
    }

    const reference = `MAAN-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    await supabase.from("orders").insert({
      user_id: user.id,
      questionnaire_id: questionnaire.id,
      reference,
      treatment: definition.title,
      status: "en_attente_validation",
    });

    window.localStorage.removeItem(localKey(slug));
    await supabase
      .from("questionnaire_drafts")
      .delete()
      .eq("definition_id", definition.id)
      .eq("user_id", user.id);

    setSubmitting(false);
    navigate({ to: "/espace-patient" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="flex-1">
        {!ready || loading ? (
          <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted">Chargement…</div>
        ) : (
          <>
            {!user ? (
              <p className="mx-auto mt-6 max-w-2xl rounded-[16px] border border-border bg-card px-5 py-4 text-sm text-muted">
                Vos réponses sont enregistrées sur cet appareil.{" "}
                <Link to="/auth" className="text-clay underline">
                  Connectez-vous
                </Link>{" "}
                pour les retrouver partout et envoyer votre dossier.
              </p>
            ) : null}
            {error ? (
              <p className="mx-auto mt-6 max-w-2xl rounded-[16px] border border-border bg-card px-5 py-4 text-sm text-clay">
                {error}
              </p>
            ) : null}
            <QuestionnaireRunner
              definition={definition}
              userId={user?.id ?? null}
              initialAnswers={draft?.answers}
              initialQuestionId={draft?.currentQuestionId ?? null}
              onAutosave={autosave}
              productContext={produit ?? null}
              onSubmit={submit}
              submitting={submitting}
            />
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
