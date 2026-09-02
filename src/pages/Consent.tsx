import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSurveyContext } from "@/hooks/useSurvey";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Consent() {
  const { jumpToStage, ensureRespondent } = useSurveyContext();
  const { fire } = useAnalytics();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!agreed) {
      setError("Please agree to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await ensureRespondent();
      fire("consent_given");
      fire("survey_started");
      jumpToStage("survey");
       } catch (e) {
      console.error("CONSENT / SUPABASE ERROR:", e);

      const message =
        e instanceof Error
          ? `${e.name}: ${e.message}`
          : String(e);

      setError(`Couldn't start the survey: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout className="justify-center">
      <div className="flex flex-1 flex-col justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6 text-[11px] uppercase tracking-[0.28em] text-mooddly-muted">
            Step 02 · Consent
          </div>
          <h1 className="font-display text-[36px] font-semibold leading-[1.08] tracking-tight text-mooddly-white sm:text-[52px]">
            ONE QUICK THING.
          </h1>
          <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-mooddly-white/75">
            Your responses may be used in aggregated form for consumer research
            and product development.
          </p>

          <div className="mt-10">
            <Checkbox
              checked={agreed}
              onChange={setAgreed}
              label="I agree to participate."
            />
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-[13px] text-red-300">
              {error}
            </div>
          )}

          <div className="mt-10">
            <Button onClick={handleContinue} loading={loading}>
              CONTINUE →
            </Button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
