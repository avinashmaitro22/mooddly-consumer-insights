import { describe, it, expect } from "vitest";
import { validateAnswer } from "@/engine/validation";
import { getQuestionByCode } from "@/config/survey";

describe("validateAnswer", () => {
  it("requires required single_select", () => {
    const q = getQuestionByCode("age_group")!;
    expect(validateAnswer(q, undefined)?.code).toBe("required");
    expect(validateAnswer(q, "22_25")).toBeNull();
  });

  it("enforces max_selections on multi_select", () => {
    const q = getQuestionByCode("switch_reasons")!;
    expect(
      validateAnswer(q, ["taste", "hydration", "electrolytes", "energy"])?.code
    ).toBe("max_selections");
    expect(
      validateAnswer(q, ["taste", "hydration", "electrolytes"])
    ).toBeNull();
  });

  it("enforces min_selections", () => {
    const q = getQuestionByCode("drinks_bought")!;
    expect(validateAnswer(q, [])?.code).toBe("required");
  });

  it("enforces scale range", () => {
    const q = getQuestionByCode("frustration")!;
    expect(validateAnswer(q, 0)?.code).toBe("min");
    expect(validateAnswer(q, 11)?.code).toBe("max");
    expect(validateAnswer(q, 5)).toBeNull();
  });

  it("enforces slider range", () => {
    const q = getQuestionByCode("sugar_importance")!;
    expect(validateAnswer(q, -1)?.code).toBe("min");
    expect(validateAnswer(q, 11)?.code).toBe("max");
    expect(validateAnswer(q, 7)).toBeNull();
  });

  it("enforces text max_length", () => {
    const q = getQuestionByCode("founder_message")!;
    const long = "x".repeat(501);
    expect(validateAnswer(q, long)?.code).toBe("max_length");
    expect(validateAnswer(q, "Hello")).toBeNull();
  });

  it("allows empty optional text", () => {
    const q = getQuestionByCode("founder_message")!;
    expect(validateAnswer(q, "")).toBeNull();
    expect(validateAnswer(q, undefined)).toBeNull();
  });
});
