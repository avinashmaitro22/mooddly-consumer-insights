import { Button } from "@/components/ui/Button";

type Props = {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  nextLabel?: string;
  loading?: boolean;
};

export function SurveyFooter({
  onBack,
  onNext,
  canGoBack,
  nextLabel = "CONTINUE →",
  loading,
}: Props) {
  return (
    <footer className="sticky bottom-0 z-20 border-t border-mooddly-border/60 bg-mooddly-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={!canGoBack}
          className="px-4"
        >
          ← BACK
        </Button>
        <Button onClick={onNext} loading={loading}>
          {nextLabel}
        </Button>
      </div>
    </footer>
  );
}
