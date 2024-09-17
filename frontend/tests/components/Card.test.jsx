import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, expect, test, describe } from "vitest";
import Card from "../../src/components/Card";

describe("Card", () => {
  test("renders children correctly", () => {
    render(<Card>Test Content</Card>);

    expect(screen.getByText("Test Content")).toBeDefined();
  });

  test("applies default styles", () => {
    const { container } = render(<Card>Test Content</Card>);
    const card = container.firstChild;

    // Check for default styles
    expect(card.classList.contains("bg-white")).toBe(true);
    expect(card.classList.contains("p-4")).toBe(true);
    expect(card.classList.contains("rounded-lg")).toBe(true);
    expect(card.classList.contains("shadow-md")).toBe(true);
  });

  test("applies additional styles from className prop", () => {
    const { container } = render(
      <Card className="custom-class">Test Content</Card>
    );
    const card = container.firstChild;

    // Check for additional styles
    expect(card.classList.contains("custom-class")).toBe(true);
  });
});
