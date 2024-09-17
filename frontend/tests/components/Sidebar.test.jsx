import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "../../src/components/common/Sidebar";

// Mock react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(() => ({ pathname: "/" })),
  };
});

// Import after mocking
import { useNavigate } from "react-router-dom";

const renderWithContext = (role, activeMenuItem) => {
  return render(
    <Router>
      <Sidebar
        role={role}
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={vi.fn()}
      />
    </Router>
  );
};

describe("Sidebar", () => {
  it("should render menu items for staff role correctly", () => {
    renderWithContext("staff", "Home");
    expect(screen.getAllByText(/Home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Analytics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vehicles/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Create Notification/i).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText(/Update Bus Schedule/i).length).toBeGreaterThan(
      0
    );

    // Ensure the correct menu item is highlighted
    expect(screen.getAllByText(/Home/i)[0].closest("a").className).to.include(
      "bg-white text-black"
    );
    expect(
      screen.getAllByText(/Analytics/i)[0].closest("a").className
    ).not.to.include("bg-white text-black");
  });

  it("should render menu items for user role correctly", () => {
    renderWithContext("user", "Home");
    expect(screen.getAllByText(/Home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Services/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Activity/i).length).toBeGreaterThan(0);

    // Ensure the correct menu item is highlighted
    expect(screen.getAllByText(/Home/i)[0].closest("a").className).to.include(
      "bg-white text-black"
    );
    expect(
      screen.getAllByText(/Services/i)[0].closest("a").className
    ).not.to.include("bg-white text-black");
  });

  it("should call handleLogout and navigate on logout button click", () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    renderWithContext("staff", "Home");
    const logoutButtons = screen.getAllByText(/Logout/i);
    expect(logoutButtons.length).toBeGreaterThan(0);

    fireEvent.click(logoutButtons[0]);

    // Ensure navigate was called after logout
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
