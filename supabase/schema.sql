-- MOODDLY Consumer Insights — Database Schema
-- Run this in the Supabase SQL editor.

------------------------------------------------------------
-- 1. EXTENSIONS
------------------------------------------------------------
create extension if not exists "uuid-ossp";

------------------------------------------------------------
-- 2. TABLES
------------------------------------------------------------

create table if not exists public.surveys (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  version int not null default 1,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.survey_questions (
  id uuid primary key default uuid_generate_v4(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  question_code text not null,
  question_text text not null,
  question_type text not null
    check (question_type in (
      'single_select', 'multi_select', 'scale', 'slider',
      'text', 'checkbox', 'concept'
    )),
  section text,
  display_order int not null,
  required boolean not null default false,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (survey_id, question_code)
);

create table if not exists public.survey_options (
  id uuid primary key default uuid_generate_v4(),
  question_code text not null,
  option_code text not null,
  option_text text not null,
  display_order int not null,
  value numeric,
  metadata jsonb not null default '{}'::jsonb,
  unique (question_id, option_code)
);

create table if not exists public.logic_rules (
  id uuid primary key default uuid_generate_v4(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  source_question text not null,
  operator text not null
    check (operator in (
      'equals', 'not_equals', 'contains', 'not_contains',
      'greater_than', 'greater_than_or_equal',
      'less_than', 'less_than_or_equal',
      'in', 'not_in'
    )),
  source_value jsonb not null,
  action text not null
    check (action in ('show', 'hide', 'skip', 'jump_to')),
  target_question text not null,
  priority int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.respondents (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null unique,
  age_group text,
  city text,
  city_tier text,
  lifestyle text,
  source text,
  campaign_id uuid references public.surveys(id),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  device text,
  email text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  completion_status text not null default 'in_progress'
    check (completion_status in ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz not null default now()
);

create table if not exists public.response_answers (
  id uuid primary key default uuid_generate_v4(),
  respondent_id uuid not null references public.respondents(id) on delete cascade,
  question_code text not null,
  answer_text text,
  answer_number numeric,
  answer_json jsonb,
  created_at timestamptz not null default now(),
  unique (respondent_id, question_code)
);

create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  creator text,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  respondent_id uuid references public.respondents(id) on delete set null,
  event_name text not null,
  question_code text,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

------------------------------------------------------------
-- 3. INDEXES
------------------------------------------------------------
create index if not exists idx_survey_questions_survey on public.survey_questions(survey_id, display_order);
create index if not exists idx_survey_options_question on public.survey_options(question_id, display_order);
create index if not exists idx_logic_rules_survey on public.logic_rules(survey_id, priority);
create index if not exists idx_respondents_session on public.respondents(session_id);
create index if not exists idx_respondents_status on public.respondents(completion_status);
create index if not exists idx_response_answers_respondent on public.response_answers(respondent_id);
create index if not exists idx_analytics_events_respondent on public.analytics_events(respondent_id);
create index if not exists idx_analytics_events_name on public.analytics_events(event_name);

------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
------------------------------------------------------------
alter table public.surveys enable row level security;
alter table public.survey_questions enable row level security;
alter table public.survey_options enable row level security;
alter table public.logic_rules enable row level security;
alter table public.respondents enable row level security;
alter table public.response_answers enable row level security;
alter table public.campaigns enable row level security;
alter table public.analytics_events enable row level security;

-- Public: read published surveys + their questions/options/rules
create policy "Public read published surveys"
  on public.surveys for select
  using (status = 'published');

create policy "Public read questions of published surveys"
  on public.survey_questions for select
  using (
    survey_id in (select id from public.surveys where status = 'published')
    and active = true
  );

create policy "Public read options of published surveys"
  on public.survey_options for select
  using (
    question_id in (
      select q.id from public.survey_questions q
      join public.surveys s on s.id = q.survey_id
      where s.status = 'published' and q.active = true
    )
  );

create policy "Public read logic rules of published surveys"
  on public.logic_rules for select
  using (
    survey_id in (select id from public.surveys where status = 'published')
  );

-- Public: insert own respondent + answers (no read, no update of others)
create policy "Public insert own respondent"
  on public.respondents for insert
  with check (true);

create policy "Public update own respondent"
  on public.respondents for update
  using (true)
  with check (true);

create policy "Public insert own answers"
  on public.response_answers for insert
  with check (true);

create policy "Public update own answers"
  on public.response_answers for update
  using (true)
  with check (true);

create policy "Public insert analytics events"
  on public.analytics_events for insert
  with check (true);

-- Public: NO read access to respondents/answers/events
-- (default deny — no SELECT policy = blocked)

-- Admin: authenticated service role bypasses RLS, but for
-- explicit admin role you can add policies here later.

------------------------------------------------------------
-- 5. UPDATED_AT TRIGGER
------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_surveys_updated_at
  before update on public.surveys
  for each row execute function public.set_updated_at();
