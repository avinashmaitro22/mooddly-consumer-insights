import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import {
  createInitialSurveyState,
  type SurveyAnswers,
  type SurveyState,
} from "@/engine/surveyState";
import {
  computeVisiblePath,
  getNextQuestionCode,
  getPrevQuestionCode,
} from "@/engine/branching";
import { validateAnswer } from "@/engine/validation";
import {
  CONCEPT_AFTER_QUESTION,
  QUESTIONS,
  SURVEY_SLUG,
  getQuestionByCode,
} from "@/config/survey";
import {
  loadCachedUTM,
  loadPersistedSurvey,
  saveCachedUTM,
  savePersistedSurvey,
  type PersistedSurvey,
} from "@/lib/storage";
import { detectDevice } from "@/lib/utils";
import { mergeUTM, readUTM, type UTMParams } from "@/lib/utm";
import { track } from "@/lib/analytics";

type SurveyContextValue = {
  state: SurveyState;
  visiblePath: string[];
  currentQuestion: ReturnType<typeof getQuestionByCode>;
  progress: { current: number; total: number };
  setAnswer: (code: string, value: SurveyAnswers[string]) => void;
  clearAnswer: (code: string) => void;
  goNext: () => { ok: boolean; error?: string };
  goBack: () => void;
  jumpToStage: (stage: SurveyState["stage"]) => void;
  ensureRespondent: () => Promise<string>;
  submitCompletion: () => Promise<void>;
  validationError: string | null;
};

const SurveyContext = createContext<SurveyContextValue | null>(null);

export function useSurveyContext(): SurveyContextValue {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurveyContext must be used within SurveyProvider");
  return ctx;
}

type Props = { children: ReactNode };

export function SurveyProvider({ children }: Props) {
  const [state, setState] = useState<SurveyState>(() => {
    const persisted = loadPersistedSurvey();
    if (persisted && persisted.surveySlug === SURVEY_SLUG) {
      return {
        sessionId: persisted.sessionId,
        respondentId: persisted.respondentId,
        surveySlug: persisted.surveySlug,
        stage: persisted.stage,
        currentQuestionCode: persisted.currentQuestionCode ?? QUESTIONS[0].code,
        answers: persisted.answers,
        startedAt: persisted.startedAt,
        lastActivity: persisted.lastActivity,
        completionStatus: persisted.completionStatus,
        utm: persisted.utm,
      };
    }
    const utmFromUrl = readUTM();
    const utmCached = loadCachedUTM();
    const merged = mergeUTM(utmCached, utmFromUrl);
    saveCachedUTM(merged);
    return createInitialSurveyState(uuidv4(), merged);
  });

  // Persist on every change (debounced by React batching).
  useEffect(() => {
    const p: PersistedSurvey = {
      sessionId: state.sessionId,
      respondentId: state.respondentId,
      surveySlug: state.surveySlug,
      stage: state.stage,
      currentQuestionCode: state.currentQuestionCode,
      answers: state.answers,
      startedAt: state.startedAt,
      lastActivity: state.lastActivity,
      completionStatus: state.completionStatus,
      utm: state.utm,
    };
    savePersistedSurvey(p);
  }, [state]);

  // If UTM appears later (e.g., user lands on /survey with params after visiting /),
  // merge them in.
  useEffect(() => {
    const fresh = readUTM();
    const hasAny = Object.values(fresh).some(Boolean);
    if (!hasAny) return;
    setState((s) => {
      const merged = mergeUTM(s.utm, fresh);
      saveCachedUTM(merged);
      return { ...s, utm: merged };
    });
  }, []);

  const visiblePath = useMemo(
    () => computeVisiblePath(state.answers),
    [state.answers]
  );

  const currentQuestion = useMemo(
    () => getQuestionByCode(state.currentQuestionCode ?? QUESTIONS[0].code),
    [state.currentQuestionCode]
  );

  const progress = useMemo(() => {
    const idx = visiblePath.indexOf(state.currentQuestionCode ?? "");
    return { current: Math.max(0, idx) + 1, total: visiblePath.length };
  }, [visiblePath, state.currentQuestionCode]);

  useEffect(() => {
    const code = state.currentQuestionCode;
    if (!code || visiblePath.includes(code)) return;
    const next =
      visiblePath.find((c) => state.answers[c] === undefined) ??
      visiblePath[visiblePath.length - 1] ??
      null;
    setState((current) =>
      current.currentQuestionCode === next
        ? current
        : { ...current, currentQuestionCode: next }
    );
  }, [visiblePath, state.currentQuestionCode, state.answers]);

  const [validationError, setValidationError] = useState<string | null>(null);

  const setAnswer = useCallback(
    (code: string, value: SurveyAnswers[string]) => {
      setValidationError(null);
      setState((s) => ({
        ...s,
        answers: { ...s.answers, [code]: value },
        lastActivity: new Date().toISOString(),
      }));
    },
    []
  );

  const clearAnswer = useCallback((code: string) => {
    setState((s) => {
      const { [code]: _removed, ...rest } = s.answers;
      void _removed;
      return { ...s, answers: rest, lastActivity: new Date().toISOString() };
    });
  }, []);

  const jumpToStage = useCallback((stage: SurveyState["stage"]) => {
  setState((s) => {
    // Leaving the concept interlude must advance past the question
    // that triggered the interlude.
    if (stage === "survey" && s.stage === "concept") {
      const next = getNextQuestionCode(
        CONCEPT_AFTER_QUESTION,
        s.answers
      );

      if (!next) {
        return {
          ...s,
          stage: "thank-you",
          completionStatus: "completed",
          lastActivity: new Date().toISOString(),
        };
      }

      return {
        ...s,
        stage: "survey",
        currentQuestionCode: next,
        lastActivity: new Date().toISOString(),
      };
    }

    return {
      ...s,
      stage,
      lastActivity: new Date().toISOString(),
    };
  });
}, []);
  const goNext = useCallback((): { ok: boolean; error?: string } => {
    const code = state.currentQuestionCode;
    if (!code) return { ok: false, error: "No current question." };
    const q = getQuestionByCode(code);
    if (!q) return { ok: false, error: "Unknown question." };

    const err = validateAnswer(q, state.answers[code]);
    if (err) {
      setValidationError(err.message);
      return { ok: false, error: err.message };
    }
    setValidationError(null);

    // Concept interstitial between Q23 and Q24.
    if (code === CONCEPT_AFTER_QUESTION) {
      setState((s) => ({
        ...s,
        stage: "concept",
        lastActivity: new Date().toISOString(),
      }));
      return { ok: true };
    }

    const next = getNextQuestionCode(code, state.answers);
    if (!next) {
  // Last question — mark the respondent completed in Supabase.
  setState((s) => ({
    ...s,
    stage: "thank-you",
    completionStatus: "completed",
    lastActivity: new Date().toISOString(),
  }));

  if (state.respondentId) {
    void submitCompletion().catch((e) => {
      console.error("[completion] failed", e);
    });
  }

  return { ok: true };
}

    setState((s) => ({
      ...s,
      currentQuestionCode: next,
      lastActivity: new Date().toISOString(),
    }));
    return { ok: true };
  }, [state]);

  const goBack = useCallback(() => {
    // If we're on the concept screen, go back to Q23.
    if (state.stage === "concept") {
      setState((s) => ({
        ...s,
        stage: "survey",
        currentQuestionCode: CONCEPT_AFTER_QUESTION,
        lastActivity: new Date().toISOString(),
      }));
      return;
    }
    const code = state.currentQuestionCode;
    if (!code) return;
    const prev = getPrevQuestionCode(code, state.answers);
    if (!prev) {
      // First question — back goes to consent.
      setState((s) => ({ ...s, stage: "consent" }));
      return;
    }
    setState((s) => ({
      ...s,
      currentQuestionCode: prev,
      lastActivity: new Date().toISOString(),
    }));
  }, [state]);

  const ensureRespondent = useCallback(async (): Promise<string> => {
    if (state.respondentId) return state.respondentId;

    const device = detectDevice();
    const utm = state.utm as UTMParams;
    const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/respondents`,
  {
    method: "POST",
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      session_id: state.sessionId,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      source: utm.utm_source ?? utm.campaign ?? null,
      device,
      started_at: state.startedAt,
      completion_status: "in_progress",
    }),
  }
);

if (!response.ok) {
  const text = await response.text();
  throw new Error(
    `Supabase HTTP ${response.status}: ${text}`
  );
}

const rows = (await response.json()) as Array<{ id: string }>;

if (!rows[0]?.id) {
  throw new Error("Supabase INSERT succeeded but no respondent ID returned.");
}

const id = rows[0].id;
    setState((s) => ({ ...s, respondentId: id }));
    return id;
  }, [state]);

  // Upsert an answer to the DB.
  const upsertAnswer = useCallback(
    async (respondentId: string, code: string, value: SurveyAnswers[string]) => {
      const q = getQuestionByCode(code);
      if (!q) return;

      let answer_text: string | null = null;
      let answer_number: number | null = null;
      let answer_json: unknown = null;

      if (typeof value === "string") answer_text = value;
      else if (typeof value === "number") answer_number = value;
      else if (Array.isArray(value)) answer_json = value;
      else answer_json = value;

      await supabase.from("response_answers").upsert(
        {
          respondent_id: respondentId,
          question_code: q.code,
          answer_text,
          answer_number,
          answer_json,
        },
        { onConflict: "respondent_id,question_code" }
      );
    },
    []
  );

  // Persist answers to DB as user progresses (non-blocking).
  const lastPersistedRef = useRef<Record<string, unknown>>({});
  useEffect(() => {
    if (!state.respondentId) return;
    const changed: Array<[string, SurveyAnswers[string]]> = [];
    for (const [k, v] of Object.entries(state.answers)) {
      const prev = lastPersistedRef.current[k];
      if (prev === v) continue;
      changed.push([k, v]);
    }
    if (changed.length === 0) return;
    for (const [k, v] of changed) {
      lastPersistedRef.current[k] = v;
      void upsertAnswer(state.respondentId, k, v).catch((e) =>
        console.error("[persist] answer failed", e)
      );
    }
  }, [state.answers, state.respondentId, upsertAnswer]);

  const submitCompletion = useCallback(async () => {
    if (!state.respondentId) return;
    const firedKey = `mooddly:completion-fired:${state.respondentId}`;
    if (typeof window !== "undefined" && localStorage.getItem(firedKey) === "true") return;

    for (const [k, v] of Object.entries(state.answers)) {
      const q = getQuestionByCode(k);
      if (!q) continue;
      const { error } = await supabase.from("response_answers").upsert(
        {
          respondent_id: state.respondentId,
          question_code: q.code,
          answer_text: typeof v === "string" ? v : null,
          answer_number: typeof v === "number" ? v : null,
          answer_json: Array.isArray(v) || typeof v === "object" ? v : null,
        },
        { onConflict: "respondent_id,question_code" }
      );
      if (error) throw error;
    }

    const { error } = await supabase
      .from("respondents")
      .update({ completion_status: "completed", completed_at: new Date().toISOString() })
      .eq("id", state.respondentId);
    if (error) throw error;

    if (typeof window !== "undefined") localStorage.setItem(firedKey, "true");
    track({
      respondentId: state.respondentId,
      eventName: "survey_completed",
      properties: { total_questions: visiblePath.length, answered: Object.keys(state.answers).length },
    });
  }, [state, visiblePath.length]);
}, [state, visiblePath.length]);

const completionStartedRef = useRef<string | null>(null);

useEffect(() => {
  if (state.stage !== "thank-you" || !state.respondentId) return;

  const respondentId = state.respondentId;

  if (completionStartedRef.current === respondentId) return;

  completionStartedRef.current = respondentId;

  void submitCompletion().catch((e) => {
    completionStartedRef.current = null;
    console.error("[completion] failed", e);
  });
}, [state.stage, state.respondentId, submitCompletion]);

  // Mark abandoned if user leaves mid-survey.
  useEffect(() => {
    const handleVisibility = () => {
      if (
        document.visibilityState === "hidden" &&
        state.respondentId &&
        state.completionStatus === "in_progress" &&
        state.stage === "survey"
      ) {
        void supabase
          .from("respondents")
          .update({ completion_status: "abandoned" })
          .eq("id", state.respondentId);
        track({
          respondentId: state.respondentId,
          eventName: "survey_abandoned",
          properties: {
            question_code: state.currentQuestionCode,
          },
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [state]);

  const value: SurveyContextValue = {
    state,
    visiblePath,
    currentQuestion,
    progress,
    setAnswer,
    clearAnswer,
    goNext,
    goBack,
    jumpToStage,
    ensureRespondent,
    submitCompletion,
    validationError,
  };

    return React.createElement(
    SurveyContext.Provider,
    { value },
    children
  );
}
