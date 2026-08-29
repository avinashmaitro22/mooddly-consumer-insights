import { useCallback } from "react";
import { track, type AnalyticsEventName } from "@/lib/analytics";
import { useSurveyContext } from "./useSurvey";

export function useAnalytics() {
  const { state } = useSurveyContext();

  const fire = useCallback(
    (
      eventName: AnalyticsEventName,
      questionCode?: string | null,
      properties?: Record<string, unknown>
    ) => {
      track({
        respondentId: state.respondentId,
        eventName,
        questionCode: questionCode ?? null,
        properties,
      });
    },
    [state.respondentId]
  );

  return { fire };
}
