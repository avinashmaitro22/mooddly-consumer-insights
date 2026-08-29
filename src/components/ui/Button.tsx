import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "ghost" | "outline";

type Props = HTMLMotionProps<"button"> & {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { variant = "primary", fullWidth, className, loading, children, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium tracking-tight transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          variant === "primary" &&
            "bg-mooddly-cyan text-mooddly-bg hover:brightness-110",
          variant === "ghost" &&
            "text-mooddly-white hover:bg-white/5 border border-transparent",
          variant === "outline" &&
            "border border-mooddly-border text-mooddly-white hover:border-white/40",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
