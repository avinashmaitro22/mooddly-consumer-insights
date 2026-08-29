-- Seed: publish the MOODDLY consumer insights survey.
-- Run after schema.sql.

insert into public.surveys (id, name, slug, description, version, status)
values (
  '11111111-1111-1111-1111-111111111111',
  'MOODDLY Consumer Insights',
  'mooddly-consumer-insights',
  'Pre-launch consumer research for MOODDLY functional beverages.',
  1,
  'published'
) on conflict (slug) do nothing;
