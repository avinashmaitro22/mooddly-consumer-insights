import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  current: number;
  total: number;
  className?: string;
};

export function Progress({ current, total, className }: Props) {
  const pct = total > 0 ? Math.max(0, Math.min(100, (current / total) * 100)) : 0;
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-mooddly-muted">
        <span>Progress</span>
        <span>
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-mooddly-border">
        <motion.div
          className="h-full bg-mooddly-cyan"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
