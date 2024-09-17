import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import DesktopHeader from "../../src/components/DesktopHeader";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

describe("DesktopHeader", () => {
  const mockNavigate = vi.fn();

  vi.mocked(useAppContext).mockImplementation(() => ({
    title: "Test Title",
  }));

  vi.mocked(useNavigate).mockImplementation(() => mockNavigate);

  const renderWithContext = () => {
    return render(
      <Router>
        <DesktopHeader />
      </Router>
    );
  };

  it("renders the title from context", () => {
    renderWithContext();

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("displays notification count when greater than 0", () => {
    // test code
  });

  it("does not display count when 0", () => {
    // test code
  });

  it("calls navigate on button click", () => {
    renderWithContext();

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/notifications");
  });
});
