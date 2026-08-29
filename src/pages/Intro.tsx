import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSurveyContext } from "@/hooks/useSurvey";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Intro() {
  const { jumpToStage } = useSurveyContext();
  const { fire } = useAnalytics();

  return (
    <PageLayout className="justify-center">
      <div className="flex flex-1 flex-col justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6 text-[11px] uppercase tracking-[0.28em] text-mooddly-muted">
            Step 01 · Intro
          </div>
          <h1 className="font-display text-[36px] font-semibold leading-[1.08] tracking-tight text-mooddly-white sm:text-[52px]">
            NO MARKETING BS.
          </h1>
          <div className="mt-8 max-w-lg space-y-5 text-[15px] leading-relaxed text-mooddly-white/75">
            <p>
              We're building a new kind of beverage for the way India actually
              lives.
            </p>
            <p>
              Before we decide what goes into it, we want to know what you
              actually want.
            </p>
          </div>
          <div className="mt-10">
            <Button
              onClick={() => {
                fire("intro_viewed");
                jumpToStage("consent");
              }}
            >
              LET'S GO →
            </Button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
