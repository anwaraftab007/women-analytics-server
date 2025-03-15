import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY || "your-anon-key";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("¿? Supabase URL or Anon Key is missing!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
