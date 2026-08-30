import type {
  Answers,
  AnswerValue,
  ClinicalRule,
  Condition,
  Predicate,
  Question,
  QuestionnaireDefinition,
  Signal,
  TriggeredRule,
} from "./types";

function isPredicate(c: Condition): c is Predicate {
  return (c as Predicate).questionId !== undefined;
}

function resolve(answers: Answers, p: Predicate): unknown {
  const raw = answers[p.questionId];
  if (p.path && raw && typeof raw === "object" && !Array.isArray(raw)) {
    return (raw as Record<string, unknown>)[p.path];
  }
  return raw;
}

export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    return Object.values(value).some((v) => v !== null && v !== undefined && v !== "");
  }
  return true;
}

function evalPredicate(answers: Answers, p: Predicate): boolean {
  const current = resolve(answers, p);
  switch (p.op) {
    case "answered":
      return isAnswered(current as AnswerValue);
    case "empty":
      return !isAnswered(current as AnswerValue);
    case "eq":
      return current === p.value;
    case "neq":
      return current !== p.value;
    case "includes":
      return Array.isArray(current) && current.includes(p.value as string);
    case "excludes":
      return !Array.isArray(current) || !current.includes(p.value as string);
    case "gt":
      return Number(current) > Number(p.value);
    case "gte":
      return Number(current) >= Number(p.value);
    case "lt":
      return Number(current) < Number(p.value);
    case "lte":
      return Number(current) <= Number(p.value);
    default:
      return false;
  }
}

export function evaluateCondition(answers: Answers, condition?: Condition): boolean {
  if (!condition) return true;
  if (isPredicate(condition)) return evalPredicate(answers, condition);
  if ("all" in condition) return condition.all.every((c) => evaluateCondition(answers, c));
  if ("any" in condition) return condition.any.some((c) => evaluateCondition(answers, c));
  if ("not" in condition) return !evaluateCondition(answers, condition.not);
  return true;
}

/** Liste ordonnée des questions actuellement visibles selon les réponses. */
export function visibleQuestions(
  definition: QuestionnaireDefinition,
  answers: Answers,
): Question[] {
  return definition.questions.filter((q) => evaluateCondition(answers, q.condition));
}

export function isQuestionComplete(question: Question, answers: Answers): boolean {
  const value = answers[question.id];
  if (!question.required) return true;
  if (question.type === "body") {
    const v = (value ?? {}) as Record<string, unknown>;
    return Boolean(v['height']) && Boolean(v['weight']);
  }
  return isAnswered(value);
}

const order: Record<Signal, number> = { green: 0, amber: 1, red: 2 };

export function highestSignal(signals: Signal[]): Signal {
  return signals.reduce<Signal>((acc, s) => (order[s] > order[acc] ? s : acc), "green");
}

/**
 * Évaluation des règles configurées.
 * Les règles sont fournies par la définition du questionnaire ; le moteur
 * ne contient aucune règle clinique en dur.
 */
export function evaluateRules(rules: ClinicalRule[], answers: Answers): TriggeredRule[] {
  return rules
    .filter((r) => evaluateCondition(answers, r.when))
    .map(({ id, label, signal, note }) => ({ id, label, signal, note }));
}

export function progressOf(
  definition: QuestionnaireDefinition,
  answers: Answers,
  currentIndex: number,
): { current: number; total: number; percent: number } {
  const total = visibleQuestions(definition, answers).length;
  const current = Math.min(currentIndex + 1, total);
  return { current, total, percent: total ? Math.round((current / total) * 100) : 0 };
}

export function remainingMinutes(
  definition: QuestionnaireDefinition,
  answers: Answers,
  currentIndex: number,
): number {
  const total = visibleQuestions(definition, answers).length;
  const left = Math.max(total - currentIndex, 0);
  const perQuestion = definition.estimatedMinutes / Math.max(total, 1);
  return Math.max(1, Math.round(left * perQuestion));
}

export function bmi(height?: unknown, weight?: unknown): number | null {
  const h = Number(height);
  const w = Number(weight);
  if (!h || !w) return null;
  const m = h / 100;
  return Math.round((w / (m * m)) * 10) / 10;
}
