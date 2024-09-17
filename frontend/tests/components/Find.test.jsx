import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Find from "../../src/pages/UserPages/Find";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "../../src/contexts/AppContext"; // Adjust the import path as needed

// Mocking the firebase/auth methods and context if needed
vi.mock("../../firebase/auth", () => ({
  doSignInWithEmailAndPassword: vi.fn(),
  doSignInWithGoogle: vi.fn(),
}));

vi.mock("../../contexts/AuthProvider", () => ({
  useAuth: () => ({ /* mock auth context if used */ }),
}));

describe('Find Component', () => {
  it('renders the email input field', () => {
    render(
      <Router>
        <AppProvider>
          <Find/>
        </AppProvider>
      </Router>
    );
    const emailInput = screen.getByText(/Select Location/i);
    expect(emailInput).not.toBeNull(); 
  });

  it('renders the location and destination cards', () => {
    render(
      <Router>
        <AppProvider>
          <Find/>
        </AppProvider>
      </Router>
    );
    const locationCard = screen.getByText(/Select Location/i);
    const destinationCard = screen.getByText(/Destination/i);
    expect(locationCard).not.toBeNull();
    expect(destinationCard).not.toBeNull();
  });

  it('renders the route options cards', () => {
    render(
      <Router>
        <AppProvider>
          <Find/>
        </AppProvider>
      </Router>
    );
    const walkCard = screen.getByText(/Walk/i);
    const viewRoutesCard = screen.getByText(/View Routes/i);
    const vehicleCard = screen.getByText(/Vehicle/i);
    expect(walkCard).not.toBeNull();
    expect(viewRoutesCard).not.toBeNull();
    expect(vehicleCard).not.toBeNull();
  });

});
