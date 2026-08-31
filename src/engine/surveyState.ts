import { QUESTIONS } from "@/config/survey";

export type SurveyAnswers = Record<
  string,
  string | string[] | number | { [key: string]: unknown } | undefined
>;

export type SurveyState = {
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

export function createInitialSurveyState(
  sessionId: string,
  utm: Record<string, string | null>
): SurveyState {
  const now = new Date().toISOString();
  return {
    sessionId,
    respondentId: null,
    surveySlug: "mooddly-consumer-insights",
    stage: "landing",
    currentQuestionCode: QUESTIONS[0]?.code ?? null,
    answers: {},
    startedAt: now,
    lastActivity: now,
    completionStatus: "in_progress",
    utm,
  };
}
