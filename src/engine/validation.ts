import type { QuestionDef } from "@/config/survey";
import type { SurveyAnswers } from "./surveyState";

export type ValidationError = {
  code: string;
  message: string;
};

export function validateAnswer(
  question: QuestionDef,
  answer: SurveyAnswers[string]
): ValidationError | null {
  const { validation } = question;

  if (question.required) {
    if (answer === undefined || answer === null || answer === "") {
      return { code: "required", message: "This question is required." };
    }
    if (Array.isArray(answer) && answer.length === 0) {
      return { code: "required", message: "Please select at least one option." };
    }
  } else {
    // Optional questions with no answer are valid.
    if (
      answer === undefined ||
      answer === null ||
      answer === "" ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      return null;
    }
  }

  if (question.type === "multi_select" && Array.isArray(answer)) {
    if (
      validation.min_selections !== undefined &&
      answer.length < validation.min_selections
    ) {
      return {
        code: "min_selections",
        message: `Select at least ${validation.min_selections}.`,
      };
    }
    if (
      validation.max_selections !== undefined &&
      answer.length > validation.max_selections
    ) {
      return {
        code: "max_selections",
        message: `Select up to ${validation.max_selections}.`,
      };
    }
  }

  if (question.type === "scale" || question.type === "slider") {
    const n = typeof answer === "number" ? answer : Number(answer);
    if (!Number.isFinite(n)) {
      return { code: "invalid_number", message: "Please pick a value." };
    }
    if (validation.min !== undefined && n < validation.min) {
      return {
        code: "min",
        message: `Minimum is ${validation.min}.`,
      };
    }
    if (validation.max !== undefined && n > validation.max) {
      return {
        code: "max",
        message: `Maximum is ${validation.max}.`,
      };
    }
  }

  if (question.type === "text" && typeof answer === "string") {
    if (
      validation.max_length !== undefined &&
      answer.length > validation.max_length
    ) {
      return {
        code: "max_length",
        message: `Max ${validation.max_length} characters.`,
      };
    }
  }

  return null;
}
