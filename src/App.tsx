import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import type { SurveyState } from "@/engine/surveyState";
import { SurveyProvider, useSurveyContext } from "@/hooks/useSurvey";
import { Landing } from "@/pages/Landing";
import { Intro } from "@/pages/Intro";
import { Consent } from "@/pages/Consent";
import { Survey } from "@/pages/Survey";
import { Concept } from "@/pages/Concept";
import { ThankYou } from "@/pages/ThankYou";
import { Privacy } from "@/pages/Privacy";

type Stage = SurveyState["stage"];

const STAGE_TO_PATH: Record<Stage, string> = {
  landing: "/",
  intro: "/intro",
  consent: "/consent",
  survey: "/survey",
  concept: "/concept",
  "thank-you": "/thank-you",
};

const PATH_TO_STAGE: Record<string, Stage> = {
  "/": "landing",
  "/intro": "intro",
  "/consent": "consent",
  "/survey": "survey",
  "/concept": "concept",
  "/thank-you": "thank-you",
};

const STAGE_PATHS = new Set<string>(Object.values(STAGE_TO_PATH));

function StageRouter() {
  const { state, jumpToStage } = useSurveyContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Always-current state for URL -> stage checks.
  const stateRef = useRef(state);
  stateRef.current = state;

  // Stores a path that was navigated to by our own stage -> URL effect.
  const selfNavigatedPathRef = useRef<string | null>(null);

  // ------------------------------------------------------------
  // STATE -> URL
  // Stage is the source of truth for normal survey navigation.
  // ------------------------------------------------------------
  useEffect(() => {
    if (!STAGE_PATHS.has(location.pathname)) return;

    const target = STAGE_TO_PATH[state.stage];

    if (location.pathname === target) return;

    selfNavigatedPathRef.current = target;

    navigate(target, { replace: true });

    // Intentionally only reacts to stage changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stage]);

  // ------------------------------------------------------------
  // URL -> STATE
  // Only reacts to actual location changes.
  // This handles browser back/forward and direct URLs.
  // ------------------------------------------------------------
  useEffect(() => {
    if (!STAGE_PATHS.has(location.pathname)) return;

    // Ignore navigation that was initiated by our own effect above.
    if (location.pathname === selfNavigatedPathRef.current) {
      selfNavigatedPathRef.current = null;
      return;
    }

    const current = stateRef.current;
    const desired = PATH_TO_STAGE[location.pathname];

    if (!desired) {
      selfNavigatedPathRef.current = "/";
      navigate("/", { replace: true });
      return;
    }

    if (desired === current.stage) return;

    // These stages are safe to enter directly.
    if (
      desired === "landing" ||
      desired === "intro" ||
      desired === "consent"
    ) {
      jumpToStage(desired);
      return;
    }

    // Survey requires a respondent.
    if (desired === "survey" && current.respondentId) {
      jumpToStage("survey");
      return;
    }

    // Concept can only be reached from the survey.
    if (desired === "concept" && current.stage === "survey") {
      jumpToStage("concept");
      return;
    }

    // Thank-you requires completed survey.
    if (
      desired === "thank-you" &&
      current.completionStatus === "completed"
    ) {
      jumpToStage("thank-you");
      return;
    }

    // Invalid/direct access -> landing.
    selfNavigatedPathRef.current = "/";
    navigate("/", { replace: true });

    // Intentionally only reacts to location changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/consent" element={<Consent />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/concept" element={<Concept />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SurveyProvider>
        <StageRouter />
      </SurveyProvider>
    </BrowserRouter>
  );
}