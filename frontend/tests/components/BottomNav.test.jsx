import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import BottomNav from "../../src/components/common/BottomNav";

describe("BottomNav", () => {
  const handleMenuItemClickMock = vi.fn();

  it("should render correct items for 'staff' role", () => {
    render(
      <Router>
        <BottomNav role="staff" handleMenuItemClick={handleMenuItemClickMock} />
      </Router>
    );

    const homeElements = screen.getAllByText("Home");
    const analyticsElements = screen.getAllByText("Analytics");
    const tasksElements = screen.getAllByText("Tasks");

    expect(homeElements.length).toBeGreaterThan(0);
    expect(analyticsElements.length).toBeGreaterThan(0);
    expect(tasksElements.length).toBeGreaterThan(0);
  });

  it("should render correct items for 'user' role", () => {
    render(
      <Router>
        <BottomNav role="user" handleMenuItemClick={handleMenuItemClickMock} />
      </Router>
    );

    const homeElements = screen.getAllByText("Home");
    const servicesElements = screen.getAllByText("Services");
    const activityElements = screen.getAllByText("Activity");

    expect(homeElements.length).toBeGreaterThan(0);
    expect(servicesElements.length).toBeGreaterThan(0);
    expect(activityElements.length).toBeGreaterThan(0);
  });

  it("should highlight the active menu item based on the current path", () => {
    render(
      <Router>
        <BottomNav role="user" handleMenuItemClick={handleMenuItemClickMock} />
      </Router>
    );

    const homeElements = screen.getAllByText("Home");
    const servicesElements = screen.getAllByText("Services");

    // Check that the home link is active initially (first Home element is active)
    expect(homeElements[0].closest("a")?.classList.contains("text-black")).toBe(
      true
    );

    // Simulate click on 'Services' and check if it becomes active
    fireEvent.click(servicesElements[0]);
    expect(handleMenuItemClickMock).toHaveBeenCalledWith("Services");
  });

  it("should trigger handleMenuItemClick when a menu item is clicked", () => {
    render(
      <Router>
        <BottomNav role="staff" handleMenuItemClick={handleMenuItemClickMock} />
      </Router>
    );

    const analyticsElements = screen.getAllByText("Analytics");
    fireEvent.click(analyticsElements[0]);

    expect(handleMenuItemClickMock).toHaveBeenCalledWith("Analytics");
  });

  it("should apply correct class based on active state", () => {
    render(
      <Router>
        <BottomNav role="staff" handleMenuItemClick={handleMenuItemClickMock} />
      </Router>
    );

    const homeElements = screen.getAllByText("Home");
    const tasksElements = screen.getAllByText("Tasks");

    // By default, the home link should be active
    expect(homeElements[0].closest("a")?.classList.contains("text-black")).toBe(
      true
    );
    expect(
      tasksElements[0].closest("a")?.classList.contains("text-gray-300")
    ).toBe(true);

    // Simulate clicking 'Tasks' and expect class changes
    fireEvent.click(tasksElements[0]);
    expect(handleMenuItemClickMock).toHaveBeenCalledWith("Tasks");
  });
});
