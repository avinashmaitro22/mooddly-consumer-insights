import { OptionCard } from "./OptionCard";

type Props = {
  options: { code: string; text: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  maxSelections?: number;
};

export function MultiSelect({
  options,
  value,
  onChange,
  maxSelections,
}: Props) {
  const atMax =
    maxSelections !== undefined && value.length >= maxSelections;

  const toggle = (code: string) => {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code));
    } else {
      if (atMax) return;
      onChange([...value, code]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((o) => (
        <OptionCard
          key={o.code}
          label={o.text}
          selected={value.includes(o.code)}
          onClick={() => toggle(o.code)}
          disabled={!value.includes(o.code) && atMax}
        />
      ))}
      {maxSelections !== undefined && (
        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-mooddly-muted">
          {value.length} / {maxSelections} selected
        </div>
      )}
    </div>
  );
}
