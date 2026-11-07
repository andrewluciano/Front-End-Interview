// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

import CONFIG from "@/Config/config";

const baseURL = `${CONFIG.SUPABASE_URL}`; //CONFIG.API_BASE;

export const supabase = createClient(
  baseURL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidWFwem56bnF5ZmlvdWdzdGxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMzI2MiwiZXhwIjoyMDY0ODc5MjYyfQ.8cRXg9tJaJgie2FmP-d2-Rnbgz4trONy2wlk8ywh_7I",
);
