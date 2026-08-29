# MOODDLY Consumer Insights

Production full-stack consumer research platform for MOODDLY — an Indian functional beverage brand.

## Stack

- React 18 + TypeScript
- Tailwind CSS
- Vite
- Supabase (Postgres + Auth + RLS)
- Recharts (available for future dashboards)
- Framer Motion
- React Router v6

## Quick start

```bash
npm install
cp .env.example .env
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Supabase setup

1. Create a project at https://supabase.com.
2. Run `supabase/schema.sql` in the SQL editor.
3. (Optional) Run `supabase/seed.sql` to publish the survey.
4. Copy the project URL + anon key into `.env`.

## Scripts

| Script          | Purpose                                  |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Local dev server                         |
| `npm run build` | TypeScript check + production build      |
| `npm run lint`  | ESLint                                   |
| `npm run test`  | Vitest                                   |
| `npm run typecheck` | TypeScript check only                |

## Architecture

- `src/config/survey.ts` — Single source of truth for all 28 questions and branching rules.
- `src/engine/branching.ts` — Generic branching engine (operators: equals, in, contains, greater_than, etc.).
- `src/engine/validation.ts` — Per-question validation.
- `src/engine/surveyState.ts` — Canonical state shape.
- `src/hooks/useSurvey.ts` — Central state + persistence + Supabase sync.
- `src/lib/analytics.ts` — Batched analytics event tracker.
- `src/lib/storage.ts` — LocalStorage persistence for recovery after refresh.
- `src/lib/utm.ts` — UTM + campaign capture.

## Data model

Answers are stored in `response_answers` (not as columns on `respondents`). This keeps the schema flexible as the survey evolves.

## Security

- Row Level Security is enabled on every table.
- Public users can only INSERT/UPDATE their own respondent + answers.
- Public users CANNOT read other respondents' data.
- Service-role key is never exposed to the client.

## Milestone 1 status

- [x] All 28 questions implemented from config (not hardcoded in UI)
- [x] Generic branching engine with operators
- [x] Validation (required, min/max selections, scale/slider ranges, text length)
- [x] Polished inline errors (no `alert()`)
- [x] Persistent state across refresh (localStorage + Supabase)
- [x] Browser back/forward preserved
- [x] UTM + campaign capture
- [x] Analytics events batched and flushed
- [x] Abandonment detection on visibility change
- [x] Concept interstitial between Q23 and Q24
- [x] Thank-you with optional email
- [x] TypeScript strict, lint clean, tests pass, production build succeeds
