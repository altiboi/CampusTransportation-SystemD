import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "../../src/pages/Login";
import { BrowserRouter as Router } from "react-router-dom";

// Mocking the firebase/auth methods and context if needed
vi.mock("../../firebase/auth", () => ({
  doSignInWithEmailAndPassword: vi.fn(),
  doSignInWithGoogle: vi.fn(),
}));

vi.mock("../../contexts/AuthProvider", () => ({
  useAuth: () => ({ /* mock auth context if used */ }),
}));

describe('Register Component', () => {
  it('renders the email input field', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput).not.toBeNull(); // Basic check for existence
  });

  it('renders the password input field', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).not.toBeNull(); // Basic check for existence
  });

  it('renders the "Sign in with Google" button', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const googleSignInButton = screen.getByRole('button', { name: /Sign in with Google/i });
    expect(googleSignInButton).not.toBeNull(); // Basic check for existence
  });

  it('renders the "Forgot password" link', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const forgotPasswordLink = screen.getByRole('button', { name: /Forgot password/i });
    expect(forgotPasswordLink).not.toBeNull(); // Basic check for existence
  });
  it('renders the "Sign in" button', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const signInButton = screen.getByRole('button', { name: /^Sign in$/i });
    expect(signInButton).not.toBeNull(); // Ensure that the specific "Sign in" button exists
  });
  
  it('renders the logo image', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const logoImage = screen.getByAltText(/Logo/i);
    expect(logoImage).not.toBeNull(); // Basic check for existence
  });
});
