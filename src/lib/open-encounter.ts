const OPEN_ENCOUNTER_STORAGE_KEY = "fv:open-encontro";

export type OpenEncounterRequest = {
  encontroId: string;
  pendency?: unknown;
};

export function requestOpenEncounter(detail: OpenEncounterRequest) {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(OPEN_ENCOUNTER_STORAGE_KEY, JSON.stringify(detail));
  } catch {
    // Best-effort persistence for cross-page navigation.
  }

  window.dispatchEvent(new CustomEvent("fv:open-encontro", { detail }));
}

export function takePendingOpenEncounter(): OpenEncounterRequest | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(OPEN_ENCOUNTER_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(OPEN_ENCOUNTER_STORAGE_KEY);

    const parsed = JSON.parse(raw) as OpenEncounterRequest | null;
    if (!parsed || typeof parsed.encontroId !== "string" || !parsed.encontroId)
      return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingOpenEncounter() {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(OPEN_ENCOUNTER_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}
