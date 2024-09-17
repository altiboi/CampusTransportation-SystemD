import React from "react";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useAppContext } from "../../src/contexts/AppContext";
import DesktopHeader from "../../src/components/common/DesktopHeader";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock useAppContext
vi.mock("../../src/contexts/AppContext", () => ({
  useAppContext: vi.fn(),
}));

const renderWithContext = (title, notificationCount = 5) => {
  useAppContext.mockReturnValue({ title, notificationCount });
  return render(
    <Router>
      <DesktopHeader />
    </Router>
  );
};

describe("DesktopHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the title from context", () => {
    const title = "Test Title";
    renderWithContext(title);
    expect(screen.getByText(title)).toBeTruthy();
  });

  //   it("should display the notification count when greater than 0", () => {
  //     renderWithContext("Test Title", 5);
  //     const notificationBadge = screen.getByText("5");
  //     expect(notificationBadge).toBeTruthy();
  //     expect(notificationBadge.className).toContain("bg-red-600");
  //   });

  it("should not display the notification count when it is 0", () => {
    renderWithContext("Test Title", 0);
    const notificationBadge = screen.queryByText("0");
    expect(notificationBadge).toBeNull();
  });

  //   it("should call navigate on notification button click", () => {
  //     const mockNavigate = vi.fn();
  //     vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  //     renderWithContext("Test Title");
  //     const notificationButton = screen.getByRole("button", { name: /bell/i });
  //     fireEvent.click(notificationButton);
  //     expect(mockNavigate).toHaveBeenCalledWith("/notifications");
  //   });
});
