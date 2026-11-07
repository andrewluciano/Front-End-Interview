import { describe, it, expect, beforeEach } from "vitest";
import {
  clearPendingOpenEncounter,
  requestOpenEncounter,
  takePendingOpenEncounter,
} from "@/lib/open-encounter";

const KEY = "fv:open-encontro";

beforeEach(() => {
  sessionStorage.clear();
});

// ---------------------------------------------------------------------------
// requestOpenEncounter
// ---------------------------------------------------------------------------

describe("requestOpenEncounter", () => {
  it("writes the request to sessionStorage", () => {
    requestOpenEncounter({ encontroId: "E-123" });
    const raw = sessionStorage.getItem(KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toMatchObject({ encontroId: "E-123" });
  });

  it("includes optional pendency field when provided", () => {
    requestOpenEncounter({ encontroId: "E-456", pendency: { note: "test" } });
    const raw = JSON.parse(sessionStorage.getItem(KEY)!);
    expect(raw.pendency).toEqual({ note: "test" });
  });

  it("dispatches fv:open-encontro custom event", () => {
    const handler = vi.fn();
    window.addEventListener("fv:open-encontro", handler);
    requestOpenEncounter({ encontroId: "E-789" });
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener("fv:open-encontro", handler);
  });

  it("passes encontroId in the custom event detail", () => {
    let captured: unknown = null;
    const handler = (e: Event) => {
      captured = (e as CustomEvent).detail;
    };
    window.addEventListener("fv:open-encontro", handler);
    requestOpenEncounter({ encontroId: "E-001" });
    expect((captured as { encontroId: string }).encontroId).toBe("E-001");
    window.removeEventListener("fv:open-encontro", handler);
  });

  it("overwrites previous sessionStorage entry", () => {
    requestOpenEncounter({ encontroId: "first" });
    requestOpenEncounter({ encontroId: "second" });
    const raw = JSON.parse(sessionStorage.getItem(KEY)!);
    expect(raw.encontroId).toBe("second");
  });
});

// ---------------------------------------------------------------------------
// takePendingOpenEncounter
// ---------------------------------------------------------------------------

describe("takePendingOpenEncounter", () => {
  it("returns null when nothing is stored", () => {
    expect(takePendingOpenEncounter()).toBeNull();
  });

  it("returns the stored request", () => {
    requestOpenEncounter({ encontroId: "E-100" });
    const result = takePendingOpenEncounter();
    expect(result).toMatchObject({ encontroId: "E-100" });
  });

  it("removes the entry from sessionStorage after reading", () => {
    requestOpenEncounter({ encontroId: "E-200" });
    takePendingOpenEncounter();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it("returns null when encontroId is empty string", () => {
    sessionStorage.setItem(KEY, JSON.stringify({ encontroId: "" }));
    expect(takePendingOpenEncounter()).toBeNull();
  });

  it("returns null when encontroId is missing", () => {
    sessionStorage.setItem(KEY, JSON.stringify({ other: "field" }));
    expect(takePendingOpenEncounter()).toBeNull();
  });

  it("returns null for invalid JSON in storage", () => {
    sessionStorage.setItem(KEY, "not-valid-json{{");
    expect(takePendingOpenEncounter()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// clearPendingOpenEncounter
// ---------------------------------------------------------------------------

describe("clearPendingOpenEncounter", () => {
  it("removes the entry from sessionStorage", () => {
    requestOpenEncounter({ encontroId: "E-300" });
    clearPendingOpenEncounter();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it("is a no-op when storage is already empty", () => {
    expect(() => clearPendingOpenEncounter()).not.toThrow();
  });
});
