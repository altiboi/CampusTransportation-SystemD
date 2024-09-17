import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import UserBuses from "../../src/pages/UserPages/UserBuses";
import { AppProvider } from "../../src/contexts/AppContext";

vi.mock("../../contexts/AppContext", () => ({
  useAppContext: () => ({
    setTitle: vi.fn(),
    setTask: vi.fn(),
  }),
}));

describe('UserBuses Component', () => {
  it('renders the text "Get the latest Bus Schedule!"', () => {
    render(
      <AppProvider>
        <UserBuses />
      </AppProvider>
    );
    const textElement = screen.getByText(/Get the latest Bus Schedule!/i);
    expect(textElement).not.toBeNull(); // Basic check for existence
  });

  it('renders the "View" button', () => {
    render(
      <AppProvider>
        <UserBuses />
      </AppProvider>
    );
    const viewButton = screen.getByRole('button', { name: /View/i });
    expect(viewButton).not.toBeNull(); // Basic check for existence
  });

  it('renders the "Download" button', () => {
    render(
      <AppProvider>
        <UserBuses />
      </AppProvider>
    );
    const downloadButton = screen.getByRole('button', { name: /Download/i });
    expect(downloadButton).not.toBeNull(); // Basic check for existence
  });
});
