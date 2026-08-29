import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";

export function Privacy() {
  return (
    <PageLayout narrow>
      <div className="py-16">
        <Link
          to="/"
          className="text-[11px] uppercase tracking-[0.22em] text-mooddly-muted hover:text-mooddly-white"
        >
          ← Back
        </Link>
        <h1 className="mt-8 font-display text-[36px] font-semibold leading-tight tracking-tight text-mooddly-white sm:text-[44px]">
          Privacy
        </h1>
        <div className="mt-8 space-y-5 text-[14px] leading-relaxed text-mooddly-white/75">
          <p>
            This survey is anonymous by design. We do not collect your name,
            phone number, or any personally identifiable information unless you
            voluntarily provide an email at the end.
          </p>
          <p>
            Your responses are aggregated and used for consumer research and
            product development by MOODDLY. We do not sell your data.
          </p>
          <p>
            We store basic technical metadata (device type, approximate entry
            source via UTM parameters) to understand how people reach the
            survey.
          </p>
          <p>
            For any questions, reach the founders at{" "}
            <span className="text-mooddly-cyan">hello@mooddly.com</span>.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
