import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { SurveyProvider, useSurveyContext } from "@/hooks/useSurvey";

// Stub supabase so the provider doesn't crash in test env.
vi.mock("@/lib/supabase", () => {
  const builder = () =>
    new Proxy(
      {},
      {
        get: () => () => builder(),
      }
    );
  return {
    supabase: {
      from: () => builder(),
    },
  };
});

// Stub analytics.
vi.mock("@/lib/analytics", () => ({
  track: () => undefined,
  flush: async () => undefined,
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <SurveyProvider>{children}</SurveyProvider>;
}

describe("SurveyProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("initializes with landing stage", () => {
    const { result } = renderHook(() => useSurveyContext(), { wrapper });
    expect(result.current.state.stage).toBe("landing");
    expect(result.current.currentQuestion?.code).toBe("age_group");
  });

  it("sets an answer and persists to localStorage", () => {
    const { result } = renderHook(() => useSurveyContext(), { wrapper });
    act(() => {
      result.current.setAnswer("age_group", "22_25");
    });
    expect(result.current.state.answers.age_group).toBe("22_25");
    const raw = window.localStorage.getItem("mooddly:survey:v1");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.answers.age_group).toBe("22_25");
  });

  it("goNext advances to the next visible question", () => {
    const { result } = renderHook(() => useSurveyContext(), { wrapper });
    act(() => {
      result.current.setAnswer("age_group", "22_25");
    });
    act(() => {
      const r = result.current.goNext();
      expect(r.ok).toBe(true);
    });
    expect(result.current.currentQuestion?.code).toBe("location");
  });

  it("goNext blocks on required unanswered question", () => {
    const { result } = renderHook(() => useSurveyContext(), { wrapper });
    act(() => {
      const r = result.current.goNext();
      expect(r.ok).toBe(false);
    });
    expect(result.current.validationError).toBeTruthy();
  });
});
