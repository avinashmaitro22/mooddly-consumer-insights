import { BRANCH_RULES, QUESTIONS, type QuestionDef } from "@/config/survey";
import type { SurveyAnswers } from "./surveyState";

export type AnswerValue = string | string[] | number | null | undefined;

function isEqual(a: AnswerValue, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((x, i) => x === sb[i]);
  }
  return a === b;
}

function toNumber(v: AnswerValue): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function evaluateCondition(
  operator: (typeof BRANCH_RULES)[number]["operator"],
  answer: AnswerValue,
  value: unknown
): boolean {
  switch (operator) {
    case "equals":
      return isEqual(answer, value);
    case "not_equals":
      return !isEqual(answer, value);
    case "contains": {
      if (Array.isArray(answer)) return answer.includes(value as string);
      if (typeof answer === "string" && typeof value === "string")
        return answer.includes(value);
      return false;
    }
    case "not_contains": {
      if (Array.isArray(answer)) return !answer.includes(value as string);
      if (typeof answer === "string" && typeof value === "string")
        return !answer.includes(value);
      return true;
    }
    case "greater_than": {
      const n = toNumber(answer);
      return n !== null && n > (value as number);
    }
    case "greater_than_or_equal": {
      const n = toNumber(answer);
      return n !== null && n >= (value as number);
    }
    case "less_than": {
      const n = toNumber(answer);
      return n !== null && n < (value as number);
    }
    case "less_than_or_equal": {
      const n = toNumber(answer);
      return n !== null && n <= (value as number);
    }
    case "in": {
      if (!Array.isArray(value)) return false;
      if (Array.isArray(answer))
        return answer.some((a) => (value as unknown[]).includes(a));
      return (value as unknown[]).includes(answer);
    }
    case "not_in": {
      if (!Array.isArray(value)) return true;
      if (Array.isArray(answer))
        return !answer.some((a) => (value as unknown[]).includes(a));
      return !(value as unknown[]).includes(answer);
    }
    default:
      return false;
  }
}

/**
 * Compute the set of question codes that are visible given current answers.
 * Returns an ordered list of question codes in the path the user will walk.
 */
export function computeVisiblePath(answers: SurveyAnswers): string[] {
  // Start with all active questions.
  const visible = new Set<string>(QUESTIONS.map((q) => q.code));

  // Sort rules by priority (desc), then apply.
  const rules = [...BRANCH_RULES].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const rule of rules) {
    const answer = answers[rule.source] as AnswerValue | undefined;
    const matches = evaluateCondition(rule.operator, answer ?? null, rule.value);
    if (!matches) continue;

    if (rule.action === "show") visible.add(rule.target);
    else if (rule.action === "hide") visible.delete(rule.target);
    else if (rule.action === "skip") visible.delete(rule.target);
    else if (rule.action === "jump_to") {
      // jump_to hides everything between source and target.
      const srcIdx = QUESTIONS.findIndex((q) => q.code === rule.source);
      const tgtIdx = QUESTIONS.findIndex((q) => q.code === rule.target);
      if (srcIdx >= 0 && tgtIdx >= 0 && tgtIdx > srcIdx) {
        for (let i = srcIdx + 1; i < tgtIdx; i++) {
          visible.delete(QUESTIONS[i].code);
        }
      }
    }
  }

  // Preserve master order.
  return QUESTIONS.filter((q) => visible.has(q.code)).map((q) => q.code);
}

export function getVisibleQuestions(answers: SurveyAnswers): QuestionDef[] {
  const codes = computeVisiblePath(answers);
  return codes
    .map((c) => QUESTIONS.find((q) => q.code === c))
    .filter((q): q is QuestionDef => !!q);
}

export function getNextQuestionCode(
  currentCode: string,
  answers: SurveyAnswers
): string | null {
  const path = computeVisiblePath(answers);
  const idx = path.indexOf(currentCode);
  if (idx < 0 || idx === path.length - 1) return null;
  return path[idx + 1];
}

export function getPrevQuestionCode(
  currentCode: string,
  answers: SurveyAnswers
): string | null {
  const path = computeVisiblePath(answers);
  const idx = path.indexOf(currentCode);
  if (idx <= 0) return null;
  return path[idx - 1];
}

export function getProgress(
  currentCode: string,
  answers: SurveyAnswers
): { current: number; total: number } {
  const path = computeVisiblePath(answers);
  const idx = path.indexOf(currentCode);
  return { current: idx + 1, total: path.length };
}
