export type UTMParams = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  campaign: string | null;
};

const ALLOWED_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "campaign",
] as const;

export function readUTM(search: string = window.location.search): UTMParams {
  const params = new URLSearchParams(search);
  const out: UTMParams = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    campaign: null,
  };
  for (const key of ALLOWED_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v;
  }
  return out;
}

export function mergeUTM(
  a: Partial<UTMParams>,
  b: Partial<UTMParams>
): UTMParams {
  const merged: UTMParams = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    campaign: null,
  };
  for (const k of Object.keys(merged) as (keyof UTMParams)[]) {
    merged[k] = b[k] ?? a[k] ?? null;
  }
  return merged;
}
