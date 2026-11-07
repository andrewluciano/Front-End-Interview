import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges two class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind padding conflict — last value wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("resolves Tailwind text-color conflict", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("keeps non-conflicting utilities", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("handles clsx conditional object", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("ignores undefined and null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });

  it("handles array input", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles nested arrays", () => {
    expect(cn(["a", ["b", "c"]])).toBe("a b c");
  });
});
