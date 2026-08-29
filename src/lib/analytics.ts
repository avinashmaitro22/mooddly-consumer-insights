import { supabase } from "./supabase";
import type { AnalyticsEventInsert } from "./supabase";

export type AnalyticsEventName =
  | "survey_started"
  | "intro_viewed"
  | "consent_given"
  | "question_viewed"
  | "question_answered"
  | "back_clicked"
  | "survey_abandoned"
  | "survey_completed"
  | "concept_viewed"
  | "concept_rated"
  | "purchase_intent_selected";

export type TrackPayload = {
  respondentId?: string | null;
  eventName: AnalyticsEventName;
  questionCode?: string | null;
  properties?: Record<string, unknown>;
};

let queue: AnalyticsEventInsert[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL_MS = 2000;
const FLUSH_MAX = 25;

function enqueue(ev: AnalyticsEventInsert) {
  queue.push(ev);
  if (queue.length >= FLUSH_MAX) void flush();
  else if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flush();
    }, FLUSH_INTERVAL_MS);
  }
}

export async function flush(): Promise<void> {
  if (queue.length === 0) return;
  const batch = queue;
  queue = [];
  try {
    const { error } = await supabase
      .from("analytics_events")
      .insert(batch satisfies AnalyticsEventInsert[]);
    if (error) {
      // Re-queue on failure so we don't lose events silently.
      queue = batch.concat(queue);
      console.error("[analytics] flush failed", error);
    }
  } catch (e) {
    queue = batch.concat(queue);
    console.error("[analytics] flush exception", e);
  }
}

export function track(payload: TrackPayload): void {
  const ev: AnalyticsEventInsert = {
    respondent_id: payload.respondentId ?? null,
    event_name: payload.eventName,
    question_code: payload.questionCode ?? null,
    properties: payload.properties ?? {},
  };
  enqueue(ev);
}

// Flush on unload so we don't lose events.
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    // Best-effort synchronous flush via sendBeacon-like fallback.
    // Supabase client doesn't support beacon directly; we fire-and-forget.
    if (queue.length > 0) void flush();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && queue.length > 0) {
      void flush();
    }
  });
}
