import { describe, it, expect } from "vitest";
import {
  computeVisiblePath,
  evaluateCondition,
  getNextQuestionCode,
} from "@/engine/branching";
import type { SurveyAnswers } from "@/engine/surveyState";

describe("evaluateCondition", () => {
  it("equals", () => {
    expect(evaluateCondition("equals", "love", "love")).toBe(true);
    expect(evaluateCondition("equals", "love", "hate")).toBe(false);
  });
  it("in array", () => {
    expect(evaluateCondition("in", "love", ["love", "like"])).toBe(true);
    expect(evaluateCondition("in", "never", ["love", "like"])).toBe(false);
  });
  it("in array for multi-select answer", () => {
    expect(evaluateCondition("in", ["a", "b"], ["b", "c"])).toBe(true);
    expect(evaluateCondition("in", ["x"], ["b", "c"])).toBe(false);
  });
  it("greater_than numeric", () => {
    expect(evaluateCondition("greater_than", 7, 5)).toBe(true);
    expect(evaluateCondition("greater_than", 3, 5)).toBe(false);
  });
  it("contains string", () => {
    expect(evaluateCondition("contains", "hello world", "world")).toBe(true);
  });
});

describe("computeVisiblePath", () => {
  it("shows Q16 and hides Q17 when Q15 is positive", () => {
    const answers: SurveyAnswers = { sparkling_feeling: "love" };
    const path = computeVisiblePath(answers);
    expect(path).toContain("sparkling_like_why");
    expect(path).not.toContain("sparkling_try_why");
  });
  it("shows Q17 and hides Q16 when Q15 is negative", () => {
    const answers: SurveyAnswers = { sparkling_feeling: "dislike" };
    const path = computeVisiblePath(answers);
    expect(path).toContain("sparkling_try_why");
    expect(path).not.toContain("sparkling_like_why");
  });
  it("shows neither when Q15 is unanswered", () => {
    const path = computeVisiblePath({});
    expect(path).not.toContain("sparkling_like_why");
    expect(path).not.toContain("sparkling_try_why");
  });
});

describe("getNextQuestionCode", () => {
  it("jumps from Q15 to Q16 when positive", () => {
    const answers: SurveyAnswers = { sparkling_feeling: "neutral" };
    const next = getNextQuestionCode("sparkling_feeling", answers);
    expect(next).toBe("sparkling_like_why");
  });
  it("jumps from Q15 to Q17 when negative", () => {
    const answers: SurveyAnswers = { sparkling_feeling: "never" };
    const next = getNextQuestionCode("sparkling_feeling", answers);
    expect(next).toBe("sparkling_try_why");
  });
  it("jumps from Q16 or Q17 to Q18", () => {
    const a: SurveyAnswers = { sparkling_feeling: "love" };
    expect(getNextQuestionCode("sparkling_like_why", a)).toBe("sugar_importance");
    const b: SurveyAnswers = { sparkling_feeling: "dislike" };
    expect(getNextQuestionCode("sparkling_try_why", b)).toBe("sugar_importance");
  });
});
