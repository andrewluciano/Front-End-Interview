const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === "app.faturaviva.com") {
    return "https://faturaviva-api-main-672622411438.us-central1.run.app";

    // return "https://faturaviva-api-978418000140.us-central1.run.app";
  }

  // if (hostname === "localhost:5173") {
  //   return "http://0.0.0.0:8000";
  // }

  return "https://faturaviva-api-672622411438.us-central1.run.app";
  // return "https://faturaviva-api-978418000140.us-central1.run.app";
};

const API_URL = getApiBaseUrl();

const CONFIG =
  window && window.config
    ? window.config
    : {
        API_BASE_URL: API_URL,
        API_BASE_URL_NOVO: API_URL,
        // API_BASE_URL:
        //   "http://127.0.0.1:8000",
        // API_BASE_URL_NOVO:
        //   "http://127.0.0.1:8000",

        SUPABASE_URL: "https://kbuapznznqyfiougstld.supabase.co",
        SUPABASE_PREFIX: "kbuapznznqyfiougstld",
        SUPBASE_TOKEN:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidWFwem56bnF5ZmlvdWdzdGxkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMzI2MiwiZXhwIjoyMDY0ODc5MjYyfQ.8cRXg9tJaJgie2FmP-d2-Rnbgz4trONy2wlk8ywh_7I",
      };

export default { ...CONFIG };
