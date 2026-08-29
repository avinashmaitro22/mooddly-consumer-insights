import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export function OptionCard({ label, selected, onClick, disabled }: Props) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-[15px] transition-colors duration-200",
        selected
          ? "border-mooddly-cyan bg-mooddly-cyan/5 text-mooddly-white"
          : "border-mooddly-border bg-transparent text-mooddly-white hover:border-white/30",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <span className="pr-6">{label}</span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-mooddly-cyan bg-mooddly-cyan"
            : "border-mooddly-border group-hover:border-white/40"
        )}
      >
        {selected && (
          <svg
            viewBox="0 0 16 16"
            className="h-3 w-3 text-mooddly-bg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8l3 3 7-7" />
          </svg>
        )}
      </span>
    </motion.button>
  );
}
