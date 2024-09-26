import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen ,fireEvent } from "@testing-library/react";
import UserWhereTo from "../../src/pages/UserPages/UserWherTo";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "../../src/contexts/AppContext";


// Mocking the firebase/auth methods and context if needed
vi.mock("../../firebase/auth", () => ({
  doSignInWithEmailAndPassword: vi.fn(),
  doSignInWithGoogle: vi.fn(),
}));

describe('UserWhereTo Component', () => {
  it('renders the map', () => {
    render(
      <Router>
        <AppProvider> {/* Wrap with AppProvider */}
          <UserWhereTo />
        </AppProvider>
      </Router>
    );
    const mapText = screen.getByText(/The Map/i);
    expect(mapText).toBeDefined(); // Basic check for existence
  });
});
describe('UserWhereTo Component', () => {
    it('renders the text whereto', () => {
      render(
        <Router>
          <AppProvider> {/* Wrap with AppProvider */}
            <UserWhereTo />
          </AppProvider>
        </Router>
      );
      const mapText = screen.getByText(/Where To/i);
      expect(mapText).toBeDefined(); // Basic check for existence
    });
});
it('updates the dropdown selection correctly', () => {
  render(
    <Router>
      <AppProvider>
        <UserWhereTo />
      </AppProvider>
    </Router>
  );
  // Select an option from the dropdown
  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'flower-hall' } });
  
  // Verify the change
  expect(select.value).toBe('flower-hall');
});  
it('updates the custom input field correctly', () => {
  render(
    <Router>
      <AppProvider>
        <UserWhereTo />
      </AppProvider>
    </Router>
  );

  const input = screen.getByPlaceholderText(/Enter custom destination/i);
  fireEvent.change(input, { target: { value: 'Custom Place' } });
  

  expect(input.value).toBe('Custom Place');
});