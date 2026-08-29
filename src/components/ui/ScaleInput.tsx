import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  min: number;
  max: number;
  value: number | null;
  onChange: (v: number) => void;
  leftLabel?: string;
  rightLabel?: string;
};

export function ScaleInput({
  min,
  max,
  value,
  onChange,
  leftLabel,
  rightLabel,
}: Props) {
  const count = max - min + 1;
  const values = Array.from({ length: count }, (_, i) => min + i);
  return (
    <div className="w-full">
      <div
        className={cn(
          "grid gap-2",
          count <= 5 ? "grid-cols-5" : "grid-cols-5 sm:grid-cols-10"
        )}
      >
        {values.map((v) => {
          const active = value === v;
          return (
            <motion.button
              key={v}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(v)}
              className={cn(
                "relative aspect-square rounded-2xl border text-sm font-medium transition-colors duration-200",
                active
                  ? "border-mooddly-cyan bg-mooddly-cyan/10 text-mooddly-white"
                  : "border-mooddly-border text-mooddly-muted hover:border-white/30 hover:text-mooddly-white"
              )}
            >
              {v}
            </motion.button>
          );
        })}
      </div>
      {(leftLabel || rightLabel) && (
        <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-mooddly-muted">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
