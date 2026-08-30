import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Info, Pencil, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { QuestionField } from "./question-field";
import {
  evaluateRules,
  highestSignal,
  isQuestionComplete,
  remainingMinutes,
  visibleQuestions,
} from "@/lib/questionnaire/engine";
import { formatAnswer } from "@/lib/questionnaire/format";
import {
  sectionLabels,
  type Answers,
  type AnswerValue,
  type EditLogEntry,
  type QuestionnaireDefinition,
  type SectionId,
  type SubmissionPayload,
} from "@/lib/questionnaire/types";

type Props = {
  definition: QuestionnaireDefinition;
  userId?: string | null | undefined;
  initialAnswers?: Answers | undefined;
  initialQuestionId?: string | null | undefined;
  onAutosave?: ((state: { answers: Answers; currentQuestionId: string | null }) => void) | undefined;
  productContext?: string | null | undefined;
  onSubmit: (payload: SubmissionPayload) => void | Promise<void>;
  submitting?: boolean | undefined;
};

type Phase = "intro" | "questions" | "summary";

export function QuestionnaireRunner({
  definition,
  userId,
  initialAnswers,
  initialQuestionId,
  onAutosave,
  productContext,
  onSubmit,
  submitting,
}: Props) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers ?? {});
  const [editLog, setEditLog] = useState<EditLogEntry[]>([]);
  const [phase, setPhase] = useState<Phase>(
    initialAnswers && Object.keys(initialAnswers).length ? "questions" : "intro",
  );
  const [index, setIndex] = useState(0);
  const [returnToSummary, setReturnToSummary] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const questions = useMemo(() => visibleQuestions(definition, answers), [definition, answers]);
  const current = questions[Math.min(index, questions.length - 1)];
  const total = questions.length;
  const percent = total ? Math.round(((index + (phase === "summary" ? total : 0)) / total) * 100) : 0;

  // Reprise exactement là où le patient s'était arrêté.
  useEffect(() => {
    if (!initialQuestionId) return;
    const i = questions.findIndex((q) => q.id === initialQuestionId);
    if (i >= 0) setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestionId]);

  // Sauvegarde automatique après chaque réponse.
  useEffect(() => {
    if (!onAutosave || phase === "intro") return;
    const t = window.setTimeout(() => {
      onAutosave({ answers, currentQuestionId: current?.id ?? null });
      setSavedAt(new Date());
    }, 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, current?.id, phase]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [index, phase]);

  const setAnswer = useCallback(
    (questionId: string, value: AnswerValue) => {
      setAnswers((prev) => {
        const before = prev[questionId];
        if (returnToSummary && before !== value) {
          setEditLog((log) => [
            ...log,
            { questionId, at: new Date().toISOString(), from: before ?? null, to: value },
          ]);
        }
        return { ...prev, [questionId]: value };
      });
    },
    [returnToSummary],
  );

  const goNext = useCallback(() => {
    if (returnToSummary) {
      setReturnToSummary(false);
      setPhase("summary");
      return;
    }
    setDirection(1);
    if (index >= total - 1) {
      setPhase("summary");
      return;
    }
    setIndex((i) => i + 1);
  }, [index, total, returnToSummary]);

  const goBack = useCallback(() => {
    setDirection(-1);
    if (returnToSummary) {
      setReturnToSummary(false);
      setPhase("summary");
      return;
    }
    if (index === 0) {
      setPhase("intro");
      return;
    }
    setIndex((i) => i - 1);
  }, [index, returnToSummary]);

  const canContinue = current ? isQuestionComplete(current, answers) : false;

  const submit = async () => {
    const triggered = evaluateRules(definition.rules, answers);
    await onSubmit({
      definitionId: definition.id,
      version: definition.version,
      category: definition.category,
      answers: productContext ? { ...answers, produit_selectionne: productContext } : answers,
      shownQuestions: questions.map((q) => q.id),
      triggeredRules: triggered,
      overallSignal: highestSignal(triggered.map((t) => t.signal)),
      editLog,
      submittedAt: new Date().toISOString(),
    });
  };

  if (phase === "intro") {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
          Questionnaire médical
        </p>
        <h1 className="mt-5 text-balance font-display text-4xl font-medium leading-[1.08] lg:text-5xl">
          {definition.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[46ch] text-pretty text-lg text-muted">{definition.intro}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Clock className="size-3.5" /> environ {definition.estimatedMinutes} minutes
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <ShieldCheck className="size-3.5" /> réponses confidentielles
          </span>
        </div>
        {productContext ? (
          <div
            role="status"
            aria-live="polite"
            className="mx-auto mt-6 inline-flex max-w-[52ch] items-start gap-3 rounded-[18px] border border-clay/30 bg-clay/8 px-5 py-4 text-left text-sm text-foreground"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-clay text-cream">
              <Check className="size-3" />
            </span>
            <span>
              Votre consultation est lancée pour{" "}
              <span className="font-medium text-clay">{productContext}</span>. Répondez aux
              questions pour permettre au médecin d'évaluer si ce traitement peut être approprié.
            </span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setPhase("questions")}
          className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-clay px-8 text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-clay-deep hover:gap-3"
        >
          Commencer <ArrowRight className="size-4" />
        </button>
        <p className="mt-6 text-sm text-muted">
          Vous pouvez vous arrêter à tout moment : vos réponses sont enregistrées et vous reprendrez
          exactement où vous en étiez.
        </p>
      </div>
    );
  }

  if (phase === "summary") {
    const sections = Array.from(new Set(questions.map((q) => q.section))) as SectionId[];
    const answered = questions.filter((q) => isQuestionComplete(q, answers)).length;
    const remaining = total - answered;
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">Synthèse</p>
        <h1 className="mt-4 text-balance font-display text-3xl font-medium leading-tight lg:text-4xl">
          Relisez votre dossier avant l'envoi.
        </h1>
        <p className="mt-4 max-w-[54ch] text-muted">
          Vos réponses sont transmises telles quelles au médecin. Vous pouvez encore modifier chaque
          élément.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "Questions répondues", v: `${answered} / ${total}` },
            { k: "Sections complétées", v: `${sections.length} / ${sections.length}` },
            { k: "Étapes restantes", v: remaining === 0 ? "Aucune" : `${remaining}` },
            { k: "Dernière étape", v: "Envoi du dossier" },
          ].map((item) => (
            <div key={item.k} className="rounded-[16px] border border-border bg-card px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {item.k}
              </dt>
              <dd className="mt-1 text-base font-medium">{item.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-sand" aria-hidden="true">
          <div
            className="h-full rounded-full bg-clay transition-[width] duration-500 ease-out"
            style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Progression {total ? Math.round((answered / total) * 100) : 0}% —{" "}
          {remaining === 0
            ? "il ne reste plus qu'à envoyer votre dossier"
            : `${remaining} réponse(s) à compléter avant l'envoi`}
        </p>

        <MedicalDisclaimer variant="questionnaire" className="mt-8" />

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section}>
              <h2 className="font-section text-lg font-semibold tracking-tight">
                {sectionLabels[section]}
              </h2>
              <ul className="mt-3 divide-y divide-[var(--border)] overflow-hidden rounded-[18px] border border-border bg-card">
                {questions
                  .filter((q) => q.section === section)
                  .map((q) => (
                    <li key={q.id} className="flex items-start justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="text-sm text-muted">{q.title}</p>
                        <p className="mt-1 text-base">{formatAnswer(q, answers[q.id])}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIndex(questions.findIndex((x) => x.id === q.id));
                          setReturnToSummary(true);
                          setPhase("questions");
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-clay transition hover:border-clay"
                      >
                        <Pencil className="size-3" /> Modifier
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-[18px] border border-border bg-sand/50 p-5 text-sm text-muted">
          Votre dossier est transmis à un médecin indépendant. Lui seul décide si un traitement est
          approprié, si des informations complémentaires sont nécessaires, ou si le traitement n'est
          pas adapté. Aucune décision n'est automatisée.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setPhase("questions");
              setIndex(total - 1);
            }}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border px-6 text-base transition hover:border-clay"
          >
            <ArrowLeft className="size-4" /> Revenir aux questions
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submit()}
            className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-clay px-8 text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-clay-deep disabled:opacity-60"
          >
            <Check className="size-4" />
            {submitting ? "Envoi en cours…" : "Vérifier et envoyer mon dossier"}
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-6 pb-24 pt-6">
      <div className="sticky top-0 z-10 -mx-6 bg-background/85 px-6 pb-4 pt-4 backdrop-blur-md">
        <div className="h-1 w-full overflow-hidden rounded-full bg-sand">
          <div
            className="h-full rounded-full bg-clay transition-[width] duration-500 ease-out"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          <span>
            Question {index + 1} / {total}
          </span>
          <span>{remainingMinutes(definition, answers, index)} min restantes</span>
        </div>
        {productContext ? (
          <p className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
            Traitement envisagé : {productContext}
          </p>
        ) : null}
      </div>

      <div
        key={current.id}
        className="mt-10"
        style={{
          animation: `rise 420ms var(--ease) both`,
          ...(direction === -1 ? { animationName: "rise" } : {}),
        }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-clay">
          {sectionLabels[current.section]}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-balance font-display text-3xl font-medium leading-[1.12] outline-none lg:text-[2.6rem]"
        >
          {current.title}
        </h1>
        {current.subtitle ? <p className="mt-3 text-lg text-muted">{current.subtitle}</p> : null}

        <div className="mt-8">
          <QuestionField
            question={current}
            value={answers[current.id]}
            onChange={(v) => setAnswer(current.id, v)}
            onAdvance={canContinueAfter(current.type) ? goNext : undefined}
            userId={userId ?? null}
          />
        </div>

        {current.why ? (
          <p className="mt-6 flex items-start gap-2 rounded-[16px] border border-border bg-card px-4 py-3 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-clay" />
            <span>
              <span className="font-medium text-foreground">Pourquoi cette question ? </span>
              {current.why}
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-sm transition hover:border-clay"
        >
          <ArrowLeft className="size-4" /> Retour
        </button>
        <div className="flex items-center gap-4">
          {savedAt ? (
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:inline">
              Enregistré
            </span>
          ) : null}
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-clay px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-clay-deep hover:gap-3 disabled:opacity-40"
          >
            {returnToSummary ? "Revenir à la synthèse" : index === total - 1 ? "Voir la synthèse" : "Continuer"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Les sélections uniques font avancer automatiquement, pas les saisies libres. */
function canContinueAfter(type: string) {
  return type === "boolean" || type === "single";
}
