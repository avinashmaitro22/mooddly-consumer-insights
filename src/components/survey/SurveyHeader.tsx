import { Progress } from "@/components/ui/Progress";

type Props = {
  current: number;
  total: number;
};

export function SurveyHeader({ current, total }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-mooddly-border/60 bg-mooddly-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="font-display text-[15px] font-semibold tracking-[0.2em] text-mooddly-white">
          MOODDLY
        </div>
        <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-mooddly-muted">
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-5 pb-4 sm:px-8">
        <Progress current={current} total={total} />
      </div>
    </header>
  );
}
