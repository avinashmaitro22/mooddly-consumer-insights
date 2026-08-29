import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageLayout({ children, className, narrow }: Props) {
  return (
    <div className="min-h-screen bg-mooddly-bg text-mooddly-white">
      <div
        className={cn(
          "mx-auto flex min-h-screen w-full flex-col px-5 sm:px-8",
          narrow ? "max-w-xl" : "max-w-2xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
