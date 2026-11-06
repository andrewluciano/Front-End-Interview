import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/StatusBadge";
import type { EncounterStatus } from "@/lib/mock-data";

const statusCases: Array<[EncounterStatus, string]> = [
  ["agendado", "Agendado"],
  ["produzido", "Produzido"],
  ["pago", "Pago"],
  ["parcial", "Pago parcial"],
  ["glosado", "Glosado"],
];

describe("StatusBadge", () => {
  it.each(statusCases)(
    "renders correct label for status %s",
    (status, expectedLabel) => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    },
  );

  it("renders a single <span> element", () => {
    const { container } = render(<StatusBadge status="pago" />);
    const spans = container.querySelectorAll("span");
    expect(spans).toHaveLength(1);
  });

  it("applies rounded-full base class", () => {
    const { container } = render(<StatusBadge status="agendado" />);
    const span = container.querySelector("span")!;
    expect(span.className).toContain("rounded-full");
  });

  it("applies a status-specific CSS class for agendado (info colour)", () => {
    const { container } = render(<StatusBadge status="agendado" />);
    expect(container.querySelector("span")!.className).toContain("text-info");
  });

  it("applies a status-specific CSS class for glosado (destructive colour)", () => {
    const { container } = render(<StatusBadge status="glosado" />);
    expect(container.querySelector("span")!.className).toContain(
      "text-destructive",
    );
  });

  it("applies a status-specific CSS class for pago (success colour)", () => {
    const { container } = render(<StatusBadge status="pago" />);
    expect(container.querySelector("span")!.className).toContain(
      "text-success",
    );
  });
});
