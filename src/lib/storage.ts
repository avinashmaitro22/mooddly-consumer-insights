import type { SurveyAnswers, SurveyState } from "@/engine/surveyState";

const SURVEY_KEY = "mooddly:survey:v1";
const UTM_KEY = "mooddly:utm:v1";

export type PersistedSurvey = {
  sessionId: string;
  respondentId: string | null;
  surveySlug: string;
  stage: "landing" | "intro" | "consent" | "survey" | "concept" | "thank-you";
  currentQuestionCode: string | null;
  answers: SurveyAnswers;
  startedAt: string;
  lastActivity: string;
  completionStatus: "in_progress" | "completed" | "abandoned";
  utm: Record<string, string | null>;
};

export function loadPersistedSurvey(): PersistedSurvey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SURVEY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSurvey;
  } catch {
    return null;
  }
}

export function savePersistedSurvey(state: PersistedSurvey): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SURVEY_KEY, JSON.stringify(state));
  } catch {
    /* storage full — ignore */
  }
}

export function clearPersistedSurvey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SURVEY_KEY);
}

export function loadCachedUTM(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string | null>) : {};
  } catch {
    return {};
  }
}

export function saveCachedUTM(utm: Record<string, string | null>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch {
    /* ignore */
  }
}

export type { SurveyAnswers, SurveyState };
