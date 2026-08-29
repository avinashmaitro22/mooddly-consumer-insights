import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  label?: string;
};

export function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
  multiline,
  label,
}: Props) {
  const base =
    "w-full rounded-2xl border border-mooddly-border bg-transparent px-5 py-4 text-[15px] text-mooddly-white placeholder:text-mooddly-muted/60 focus:border-mooddly-cyan focus:outline-none transition-colors";
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-mooddly-muted">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={5}
          className={cn(base, "min-h-[140px] resize-none")}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={base}
        />
      )}
      {maxLength !== undefined && (
        <div className="mt-2 text-right text-[11px] font-mono text-mooddly-muted">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}
