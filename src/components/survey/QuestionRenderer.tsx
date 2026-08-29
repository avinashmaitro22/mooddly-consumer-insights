import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import type { QuestionDef } from "@/config/survey";
import type { SurveyAnswers } from "@/engine/surveyState";
import { OptionCard } from "@/components/ui/OptionCard";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { ScaleInput } from "@/components/ui/ScaleInput";
import { SliderInput } from "@/components/ui/SliderInput";
import { TextInput } from "@/components/ui/TextInput";

type Props = {
  question: QuestionDef;
  answer: SurveyAnswers[string] | undefined;
  onChange: (value: SurveyAnswers[string]) => void;
  followUpValue?: string;
  onFollowUpChange?: (v: string) => void;
  error: string | null;
};

export function QuestionRenderer({
  question,
  answer,
  onChange,
  followUpValue,
  onFollowUpChange,
  error,
}: Props) {
  const options = useMemo(() => question.options ?? [], [question.options]);

  const scaleMeta = useMemo(() => {
    if (question.type !== "scale") return null;
    const labels = question.metadata?.options;
    return {
      left: labels?.[0]?.text,
      right: labels?.[labels.length - 1]?.text,
    };
  }, [question]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.code}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full flex-col"
      >
        <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-mooddly-muted">
          {question.section}
        </div>
        <h2 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-mooddly-white sm:text-[32px]">
          {question.text}
        </h2>
        {question.required && (
          <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-mooddly-muted">
            Required
          </div>
        )}

        <div className="mt-8">
          {question.type === "single_select" && (
            <div className="flex flex-col gap-2.5">
              {options.map((o) => (
                <OptionCard
                  key={o.code}
                  label={o.text}
                  selected={answer === o.code}
                  onClick={() => onChange(o.code)}
                />
              ))}
            </div>
          )}

          {question.type === "multi_select" && (
            <MultiSelect
              options={options}
              value={Array.isArray(answer) ? (answer as string[]) : []}
              onChange={(v) => onChange(v)}
              maxSelections={question.validation.max_selections}
            />
          )}

          {question.type === "scale" && (
            <ScaleInput
              min={question.validation.min ?? 1}
              max={question.validation.max ?? 10}
              value={typeof answer === "number" ? answer : null}
              onChange={(v) => onChange(v)}
              leftLabel={scaleMeta?.left}
              rightLabel={scaleMeta?.right}
            />
          )}

          {question.type === "slider" && (
            <SliderInput
              min={question.validation.min ?? 0}
              max={question.validation.max ?? 10}
              step={question.validation.step ?? 1}
              value={typeof answer === "number" ? answer : (question.validation.min ?? 0)}
              onChange={(v) => onChange(v)}
              leftLabel="Not important"
              rightLabel="Critical"
            />
          )}

          {question.type === "text" && (
            <TextInput
              value={typeof answer === "string" ? answer : ""}
              onChange={(v) => onChange(v)}
              placeholder={question.metadata?.placeholder}
              maxLength={question.validation.max_length}
              multiline
            />
          )}
        </div>

        {/* Follow-up field (e.g., city after Q2). */}
        {question.metadata?.follow_up_field && onFollowUpChange && (
          <div className="mt-6">
            <TextInput
              label={question.metadata.follow_up_field.label}
              value={followUpValue ?? ""}
              onChange={onFollowUpChange}
              placeholder="Type your answer"
            />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-[13px] text-red-300"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
