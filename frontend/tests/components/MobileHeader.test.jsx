import React from "react";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useAppContext } from "../../src/contexts/AppContext";
import MobileHeader from "../../src/components/common/MobileHeader";

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

// Mock FontAwesomeIcon
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: vi.fn(() => null),
}));

const renderWithContext = (title, task = 0) => {
  useAppContext.mockReturnValue({ title, task });
  return render(
    <Router>
      <MobileHeader />
    </Router>
  );
};

describe("MobileHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the title from context", () => {
    const title = "Test Title";
    renderWithContext(title);
    expect(screen.getByText(title)).toBeTruthy();
  });

  //   it("should render back button when task is 1", () => {
  //     renderWithContext("Test Title", 1);
  //     const backButton = screen.getByRole("button", { name: /back/i });
  //     expect(backButton).toBeTruthy();
  //   });

  it("should not render back button when task is not 1", () => {
    renderWithContext("Test Title", 0);
    const backButton = screen.queryByRole("button", { name: /back/i });
    expect(backButton).toBeNull();
  });

  //   it("should call navigate(-1) on back button click", () => {
  //     const mockNavigate = vi.fn();
  //     vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  //     renderWithContext("Test Title", 1);
  //     const backButton = screen.getByRole("button", { name: /back/i });
  //     fireEvent.click(backButton);
  //     expect(mockNavigate).toHaveBeenCalledWith(-1);
  //   });

  //   it("should call navigate on notification button click", () => {
  //     const mockNavigate = vi.fn();
  //     vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  //     renderWithContext("Test Title");
  //     const notificationButton = screen.getByRole("button", {
  //       name: /notifications/i,
  //     });
  //     fireEvent.click(notificationButton);
  //     expect(mockNavigate).toHaveBeenCalledWith("/notifications");
  //   });

  //   it("should render in a fixed position at the top", () => {
  //     renderWithContext("Test Title");
  //     const header = screen.getByRole("banner");
  //     expect(header.className).toContain("fixed top-0");
  //   });

  //   it("should be hidden on large screens", () => {
  //     renderWithContext("Test Title");
  //     const header = screen.getByRole("banner");
  //     expect(header.className).toContain("lg:hidden");
  //   });
});
