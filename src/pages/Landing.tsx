import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSurveyContext } from "@/hooks/useSurvey";

export function Landing() {
  const { jumpToStage } = useSurveyContext();
  return (
    <PageLayout className="justify-center">
      <div className="flex flex-1 flex-col justify-center py-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mb-6 text-[11px] uppercase tracking-[0.28em] text-mooddly-muted">MOODDLY · Consumer Insights</div>
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] tracking-tight text-mooddly-white sm:text-[60px]">HELP US BUILD<br />WHAT YOU<br /><span className="text-mooddly-cyan">ACTUALLY WANT.</span></h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-mooddly-white/70">3 minutes.<br />Your answers will influence what MOODDLY builds next.</p>
          <div className="mt-10"><Link to="/intro" onClick={() => jumpToStage("intro")}><Button>START THE SURVEY →</Button></Link></div>
          <div className="mt-6 text-[11px] uppercase tracking-[0.2em] text-mooddly-muted">100% anonymous · ~3 min</div>
        </motion.div>
      </div>
      <footer className="py-6 text-[11px] text-mooddly-muted"><Link to="/privacy" className="hover:text-mooddly-white">Privacy</Link></footer>
    </PageLayout>
  );
}
