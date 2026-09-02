import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY EXISTS:", Boolean(supabaseAnonKey));
console.log(
  "SUPABASE KEY TYPE:",
  supabaseAnonKey?.startsWith("sb_publishable_")
    ? "publishable"
    : "other"
);

if (!supabaseUrl || !supabaseAnonKey) {
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
  global: {
    fetch: async (input, init) => {
      console.log("SUPABASE REQUEST:", input);

      try {
        const response = await fetch(input, init);

        console.log(
          "SUPABASE RESPONSE:",
          response.status,
          response.statusText
        );

        return response;
      } catch (error) {
        console.error("SUPABASE NETWORK FAILURE:", error);
        throw error;
      }
    },
  },
});
