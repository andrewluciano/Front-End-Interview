import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/Logo";

describe("Logo", () => {
  it("renders the img with correct alt text", () => {
    render(<Logo />);
    expect(screen.getByAltText("Fatura Viva")).toBeInTheDocument();
  });

  it("shows brand text by default (showText=true)", () => {
    render(<Logo />);
    expect(screen.getByText("Fatura")).toBeInTheDocument();
    expect(screen.getByText("Viva")).toBeInTheDocument();
  });

  it("hides brand text when showText is false", () => {
    render(<Logo showText={false} />);
    expect(screen.queryByText("Fatura")).not.toBeInTheDocument();
    expect(screen.queryByText("Viva")).not.toBeInTheDocument();
  });

  it("uses the provided size for img width and height", () => {
    render(<Logo size={48} />);
    const img = screen.getByAltText("Fatura Viva");
    expect(img).toHaveAttribute("width", "48");
    expect(img).toHaveAttribute("height", "48");
  });

  it("defaults to size 32", () => {
    render(<Logo />);
    const img = screen.getByAltText("Fatura Viva");
    expect(img).toHaveAttribute("width", "32");
  });

  it("applies animate class when animate=true", () => {
    render(<Logo animate={true} />);
    const img = screen.getByAltText("Fatura Viva");
    expect(img.className).toContain("animate-leaf-sway");
  });

  it("does not apply animate class when animate=false", () => {
    render(<Logo animate={false} />);
    const img = screen.getByAltText("Fatura Viva");
    expect(img.className).not.toContain("animate-leaf-sway");
  });

  it("applies custom className to wrapper div", () => {
    const { container } = render(<Logo className="my-custom-class" />);
    const div = container.firstElementChild;
    expect(div?.className).toContain("my-custom-class");
  });

  it("renders as a flex container", () => {
    const { container } = render(<Logo />);
    const div = container.firstElementChild;
    expect(div?.className).toContain("flex");
  });
});
