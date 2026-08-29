import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly at startup so missing env vars don't silently break the app.
  throw new Error(
    "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      surveys: { Row: Survey; Insert: SurveyInsert; Update: SurveyUpdate };
      survey_questions: {
        Row: SurveyQuestion;
        Insert: SurveyQuestionInsert;
        Update: SurveyQuestionUpdate;
      };
      survey_options: {
        Row: SurveyOption;
        Insert: SurveyOptionInsert;
        Update: SurveyOptionUpdate;
      };
      logic_rules: {
        Row: LogicRule;
        Insert: LogicRuleInsert;
        Update: LogicRuleUpdate;
      };
      respondents: {
        Row: Respondent;
        Insert: RespondentInsert;
        Update: RespondentUpdate;
      };
      response_answers: {
        Row: ResponseAnswer;
        Insert: ResponseAnswerInsert;
        Update: ResponseAnswerUpdate;
      };
      campaigns: { Row: Campaign };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: AnalyticsEventInsert;
      };
    };
  };
};

export type Survey = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  version: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};
export type SurveyInsert = Omit<Survey, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};
export type SurveyUpdate = Partial<SurveyInsert>;

export type SurveyQuestion = {
  id: string;
  survey_id: string;
  question_code: string;
  question_text: string;
  question_type:
    | "single_select"
    | "multi_select"
    | "scale"
    | "slider"
    | "text"
    | "checkbox"
    | "concept";
  section: string | null;
  display_order: number;
  required: boolean;
  active: boolean;
  metadata: QuestionMetadata;
  created_at: string;
};
export type SurveyQuestionInsert = Omit<SurveyQuestion, "created_at"> & {
  created_at?: string;
};
export type SurveyQuestionUpdate = Partial<SurveyQuestionInsert>;

export type QuestionMetadata = {
  options?: Array<{ code: string; text: string; value?: number }>;
  min?: number;
  max?: number;
  step?: number;
  min_selections?: number;
  max_selections?: number;
  placeholder?: string;
  max_length?: number;
  follow_up_field?: { code: string; label: string; required?: boolean };
};

export type SurveyOption = {
  id: string;
  question_id: string;
  option_code: string;
  option_text: string;
  display_order: number;
  value: number | null;
  metadata: Record<string, unknown>;
};
export type SurveyOptionInsert = Omit<SurveyOption, "id">;
export type SurveyOptionUpdate = Partial<SurveyOptionInsert>;

export type LogicRule = {
  id: string;
  survey_id: string;
  source_question: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "greater_than_or_equal"
    | "less_than"
    | "less_than_or_equal"
    | "in"
    | "not_in";
  source_value: unknown;
  action: "show" | "hide" | "skip" | "jump_to";
  target_question: string;
  priority: number;
  created_at: string;
};
export type LogicRuleInsert = Omit<LogicRule, "id" | "created_at"> & {
  created_at?: string;
};
export type LogicRuleUpdate = Partial<LogicRuleInsert>;

export type Respondent = {
  id: string;
  session_id: string;
  age_group: string | null;
  city: string | null;
  city_tier: string | null;
  lifestyle: string | null;
  source: string | null;
  campaign_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  device: string | null;
  email: string | null;
  started_at: string;
  completed_at: string | null;
  completion_status: "in_progress" | "completed" | "abandoned";
  created_at: string;
};
export type RespondentInsert = Omit<Respondent, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
export type RespondentUpdate = Partial<RespondentInsert>;

export type ResponseAnswer = {
  id: string;
  respondent_id: string;
  question_code: string;
  answer_text: string | null;
  answer_number: number | null;
  answer_json: unknown;
  created_at: string;
};
export type ResponseAnswerInsert = Omit<ResponseAnswer, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
export type ResponseAnswerUpdate = Partial<ResponseAnswerInsert>;

export type Campaign = {
  id: string;
  name: string;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  creator: string | null;
  created_at: string;
};

export type AnalyticsEvent = {
  id: string;
  respondent_id: string | null;
  event_name: string;
  question_code: string | null;
  properties: Record<string, unknown>;
  created_at: string;
};
export type AnalyticsEventInsert = Omit<AnalyticsEvent, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
