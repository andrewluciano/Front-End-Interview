import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  GLOBAL_SETTINGS_STORAGE_KEY,
  encounters,
  files,
  formatBRL,
  formatDateTimeBR,
  formatMoneyInput,
  getConveniosAtendidos,
  isPrivacyHideValuesEnabled,
  maskCnpjInput,
  maskCpfInput,
  maskCpfOrCnpjInput,
  maskCrmInput,
  maskMoneyInput,
  parseBRL,
  patients,
  safeMoney,
  statusLabels,
  users,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// statusLabels
// ---------------------------------------------------------------------------

describe("statusLabels", () => {
  it("maps every EncounterStatus to a non-empty Portuguese label", () => {
    const statuses = [
      "agendado",
      "produzido",
      "pago",
      "parcial",
      "glosado",
    ] as const;
    for (const s of statuses) {
      expect(typeof statusLabels[s]).toBe("string");
      expect(statusLabels[s].length).toBeGreaterThan(0);
    }
  });

  it("has human-readable label for each status", () => {
    expect(statusLabels.agendado).toBe("Agendado");
    expect(statusLabels.produzido).toBe("Produzido");
    expect(statusLabels.pago).toBe("Pago");
    expect(statusLabels.parcial).toBe("Pago parcial");
    expect(statusLabels.glosado).toBe("Glosado");
  });
});

// ---------------------------------------------------------------------------
// Mock data integrity
// ---------------------------------------------------------------------------

describe("mock data arrays", () => {
  it("encounters array has at least one entry with required fields", () => {
    expect(encounters.length).toBeGreaterThan(0);
    for (const e of encounters) {
      expect(typeof e.id).toBe("string");
      expect(typeof e.patient).toBe("string");
      expect(typeof e.value).toBe("number");
      expect(["agendado", "produzido", "pago", "parcial", "glosado"]).toContain(
        e.status,
      );
    }
  });

  it("patients array has required fields", () => {
    expect(patients.length).toBeGreaterThan(0);
    for (const p of patients) {
      expect(typeof p.id).toBe("string");
      expect(typeof p.name).toBe("string");
      expect(p.age).toBeGreaterThan(0);
    }
  });

  it("files array has required fields", () => {
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      expect(typeof f.id).toBe("string");
      expect(["processado", "processando", "erro"]).toContain(f.status);
    }
  });

  it("users array has required fields", () => {
    expect(users.length).toBeGreaterThan(0);
    for (const u of users) {
      expect(typeof u.email).toBe("string");
      expect(["Admin", "Médico", "Financeiro"]).toContain(u.role);
    }
  });
});

// ---------------------------------------------------------------------------
// maskMoneyInput
// ---------------------------------------------------------------------------

describe("maskMoneyInput", () => {
  it("returns empty string for empty input", () => {
    expect(maskMoneyInput("")).toBe("");
  });

  it("strips non-digits before masking", () => {
    expect(maskMoneyInput("abc")).toBe("");
  });

  it("formats single digit as centavos", () => {
    // "5" → digits "5" → padded "005" → "0,05"
    expect(maskMoneyInput("5")).toBe("0,05");
  });

  it("formats two digits as centavos", () => {
    expect(maskMoneyInput("50")).toBe("0,50");
  });

  it("formats three digits — one real", () => {
    expect(maskMoneyInput("100")).toBe("1,00");
  });

  it("formats thousands with dot separator", () => {
    expect(maskMoneyInput("100000")).toBe("1.000,00");
  });

  it("handles large amounts with grouping", () => {
    expect(maskMoneyInput("5000000")).toBe("50.000,00");
  });

  it("handles mixed string (digits extracted)", () => {
    expect(maskMoneyInput("R$ 1.500,50")).toBe("1.500,50");
  });
});

// ---------------------------------------------------------------------------
// maskCpfInput
// ---------------------------------------------------------------------------

describe("maskCpfInput", () => {
  it("returns empty for empty input", () => {
    expect(maskCpfInput("")).toBe("");
  });

  it("passes through up to 3 digits unchanged", () => {
    expect(maskCpfInput("123")).toBe("123");
  });

  it("inserts first dot after 3 digits", () => {
    expect(maskCpfInput("1234")).toBe("123.4");
    expect(maskCpfInput("123456")).toBe("123.456");
  });

  it("inserts second dot after 6 digits", () => {
    expect(maskCpfInput("1234567")).toBe("123.456.7");
    expect(maskCpfInput("123456789")).toBe("123.456.789");
  });

  it("inserts hyphen for 10-11 digits (full CPF)", () => {
    expect(maskCpfInput("12345678901")).toBe("123.456.789-01");
  });

  it("strips non-digit characters from input", () => {
    expect(maskCpfInput("123.456.789-01")).toBe("123.456.789-01");
  });

  it("caps at 11 digits", () => {
    expect(maskCpfInput("123456789012345")).toBe("123.456.789-01");
  });
});

// ---------------------------------------------------------------------------
// maskCnpjInput
// ---------------------------------------------------------------------------

describe("maskCnpjInput", () => {
  it("returns empty for empty input", () => {
    expect(maskCnpjInput("")).toBe("");
  });

  it("passes through 1-2 digits unchanged", () => {
    expect(maskCnpjInput("12")).toBe("12");
  });

  it("inserts first dot after 2 digits", () => {
    expect(maskCnpjInput("123")).toBe("12.3");
    expect(maskCnpjInput("12345")).toBe("12.345");
  });

  it("inserts second dot after 5 digits", () => {
    expect(maskCnpjInput("123456")).toBe("12.345.6");
    expect(maskCnpjInput("12345678")).toBe("12.345.678");
  });

  it("inserts slash for 9-12 digits", () => {
    expect(maskCnpjInput("123456780001")).toBe("12.345.678/0001");
  });

  it("inserts hyphen for 13-14 digits (full CNPJ)", () => {
    expect(maskCnpjInput("12345678000195")).toBe("12.345.678/0001-95");
  });

  it("caps at 14 digits", () => {
    expect(maskCnpjInput("1234567800019500")).toBe("12.345.678/0001-95");
  });
});

// ---------------------------------------------------------------------------
// maskCpfOrCnpjInput
// ---------------------------------------------------------------------------

describe("maskCpfOrCnpjInput", () => {
  it("routes to CPF mask for 11 digits", () => {
    expect(maskCpfOrCnpjInput("12345678901")).toBe("123.456.789-01");
  });

  it("routes to CNPJ mask when more than 11 digits", () => {
    expect(maskCpfOrCnpjInput("12345678000195")).toBe("12.345.678/0001-95");
  });

  it("handles mixed input (strips non-digits first)", () => {
    expect(maskCpfOrCnpjInput("123.456.789-01")).toBe("123.456.789-01");
  });
});

// ---------------------------------------------------------------------------
// maskCrmInput
// ---------------------------------------------------------------------------

describe("maskCrmInput", () => {
  it("returns empty string for empty input", () => {
    expect(maskCrmInput("")).toBe("");
  });

  it("formats pure number (no UF)", () => {
    expect(maskCrmInput("12345")).toBe("12345");
  });

  it("formats number followed by UF letters", () => {
    expect(maskCrmInput("12345SP")).toBe("12345/SP");
  });

  it("trims UF to 2 characters", () => {
    expect(maskCrmInput("12345SPRJ")).toBe("12345/SP");
  });

  it("returns empty when no leading digits before letters", () => {
    // 'SP12345' → firstLetterIndex=0 → crmNumber='' → return ''
    expect(maskCrmInput("SP12345")).toBe("");
  });

  it("strips hyphens and special chars", () => {
    // '12345/SP' → normalized '12345SP' → '12345/SP'
    expect(maskCrmInput("12345/SP")).toBe("12345/SP");
  });

  it("uppercases letters", () => {
    expect(maskCrmInput("12345sp")).toBe("12345/SP");
  });
});

// ---------------------------------------------------------------------------
// formatMoneyInput
// ---------------------------------------------------------------------------

describe("formatMoneyInput", () => {
  it("formats zero with two decimal places", () => {
    expect(formatMoneyInput(0)).toBe("0,00");
  });

  it("formats integer with two decimal places", () => {
    expect(formatMoneyInput(1000)).toBe("1.000,00");
  });

  it("formats decimal with two decimal places", () => {
    expect(formatMoneyInput(1234.56)).toBe("1.234,56");
  });
});

// ---------------------------------------------------------------------------
// parseBRL
// ---------------------------------------------------------------------------

describe("parseBRL", () => {
  it("parses typical BRL currency string", () => {
    expect(parseBRL("R$ 1.234,56")).toBeCloseTo(1234.56);
  });

  it("parses simple decimal value", () => {
    expect(parseBRL("0,50")).toBeCloseTo(0.5);
  });

  it("returns 0 for empty string", () => {
    expect(parseBRL("")).toBe(0);
  });

  it("returns 0 for non-numeric string", () => {
    expect(parseBRL("abc")).toBe(0);
  });

  it("handles negative values", () => {
    expect(parseBRL("-100,00")).toBeCloseTo(-100);
  });
});

// ---------------------------------------------------------------------------
// formatBRL
// ---------------------------------------------------------------------------

describe("formatBRL", () => {
  beforeEach(() => localStorage.clear());

  it("returns masked value when privacy is enabled", () => {
    localStorage.setItem(
      GLOBAL_SETTINGS_STORAGE_KEY,
      JSON.stringify({ privacy_hide_values: true }),
    );
    expect(formatBRL(999)).toBe("R$ ••••");
  });

  it("formats value when privacy is disabled", () => {
    localStorage.setItem(
      GLOBAL_SETTINGS_STORAGE_KEY,
      JSON.stringify({ privacy_hide_values: false }),
    );
    const result = formatBRL(1000);
    expect(result).toContain("1.000,00");
  });

  it("formats value when no settings in storage", () => {
    const result = formatBRL(500);
    expect(result).toContain("500,00");
  });

  it("formats zero correctly", () => {
    const result = formatBRL(0);
    expect(result).toContain("0,00");
  });
});

// ---------------------------------------------------------------------------
// safeMoney
// ---------------------------------------------------------------------------

describe("safeMoney", () => {
  it("returns the number for positive finite values", () => {
    expect(safeMoney(100)).toBe(100);
    expect(safeMoney(0)).toBe(0);
  });

  it("clamps negative numbers to zero", () => {
    expect(safeMoney(-50)).toBe(0);
  });

  it("converts numeric strings", () => {
    expect(safeMoney("123")).toBe(123);
  });

  it("returns 0 for NaN", () => {
    expect(safeMoney(NaN)).toBe(0);
  });

  it("returns 0 for Infinity", () => {
    expect(safeMoney(Infinity)).toBe(0);
  });

  it("returns 0 for null", () => {
    expect(safeMoney(null)).toBe(0);
  });

  it("returns 0 for undefined", () => {
    expect(safeMoney(undefined)).toBe(0);
  });

  it("returns 0 for non-numeric string", () => {
    expect(safeMoney("abc")).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// formatDateTimeBR
// ---------------------------------------------------------------------------

describe("formatDateTimeBR", () => {
  it("returns em-dash for null", () => {
    expect(formatDateTimeBR(null)).toBe("—");
  });

  it("returns em-dash for undefined", () => {
    expect(formatDateTimeBR(undefined)).toBe("—");
  });

  it("returns em-dash for empty string", () => {
    expect(formatDateTimeBR("")).toBe("—");
  });

  it("returns em-dash for invalid date string", () => {
    expect(formatDateTimeBR("not-a-date")).toBe("—");
  });

  it("returns DD/MM/YYYY HH:MM formatted string for valid ISO date", () => {
    const result = formatDateTimeBR("2024-01-15T10:30:00.000Z");
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
  });

  it("accepts a Date object", () => {
    const result = formatDateTimeBR(new Date("2024-06-01T00:00:00Z"));
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
  });

  it("accepts a numeric timestamp", () => {
    const result = formatDateTimeBR(new Date("2024-01-01").getTime());
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
  });
});

// ---------------------------------------------------------------------------
// isPrivacyHideValuesEnabled
// ---------------------------------------------------------------------------

describe("isPrivacyHideValuesEnabled", () => {
  beforeEach(() => localStorage.clear());

  it("returns false when localStorage is empty", () => {
    expect(isPrivacyHideValuesEnabled()).toBe(false);
  });

  it("returns true when privacy_hide_values is true", () => {
    localStorage.setItem(
      GLOBAL_SETTINGS_STORAGE_KEY,
      JSON.stringify({ privacy_hide_values: true }),
    );
    expect(isPrivacyHideValuesEnabled()).toBe(true);
  });

  it("returns false when privacy_hide_values is false", () => {
    localStorage.setItem(
      GLOBAL_SETTINGS_STORAGE_KEY,
      JSON.stringify({ privacy_hide_values: false }),
    );
    expect(isPrivacyHideValuesEnabled()).toBe(false);
  });

  it("returns false for invalid JSON in storage", () => {
    localStorage.setItem(GLOBAL_SETTINGS_STORAGE_KEY, "not-json{{{");
    expect(isPrivacyHideValuesEnabled()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getConveniosAtendidos
// ---------------------------------------------------------------------------

describe("getConveniosAtendidos", () => {
  beforeEach(() => localStorage.clear());

  it("returns empty array when localStorage is empty", () => {
    expect(getConveniosAtendidos()).toEqual([]);
  });

  it("returns empty array for invalid JSON", () => {
    localStorage.setItem(GLOBAL_SETTINGS_STORAGE_KEY, "bad{json");
    expect(getConveniosAtendidos()).toEqual([]);
  });

  it("returns empty array when convenios_atendidos is missing", () => {
    localStorage.setItem(GLOBAL_SETTINGS_STORAGE_KEY, JSON.stringify({}));
    expect(getConveniosAtendidos()).toEqual([]);
  });

  it("returns sorted deduplicated list (case-insensitive dedup)", () => {
    localStorage.setItem(
      GLOBAL_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        convenios_atendidos: ["Unimed", "Amil", "Unimed", "amil", "Bradesco"],
      }),
    );
    const result = getConveniosAtendidos();
    // Unimed and amil are deduped (case-insensitive key), result sorted
    expect(result).toHaveLength(3);
    // First occurrence of each is kept, then sorted
    expect(result).toContain("Unimed");
    expect(result).toContain("Amil");
    expect(result).toContain("Bradesco");
  });

  it("skips non-string and blank values", () => {
    localStorage.setItem(
      GLOBAL_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        convenios_atendidos: [null, 42, "", "  ", "Unimed"],
      }),
    );
    expect(getConveniosAtendidos()).toEqual(["Unimed"]);
  });

  it("normalises whitespace in values", () => {
    localStorage.setItem(
      GLOBAL_SETTINGS_STORAGE_KEY,
      JSON.stringify({ convenios_atendidos: ["Sul   América"] }),
    );
    expect(getConveniosAtendidos()[0]).toBe("Sul América");
  });
});
