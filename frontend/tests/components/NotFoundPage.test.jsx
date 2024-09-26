// src/pages/NotFoundPage.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import NotFoundPage from "../../src/pages/NotFoundPage";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router

describe('Not Found Component', () => {
  it('renders the 404 error', () => {
    render(
      <Router>
        <NotFoundPage />
      </Router>
    );
    const errorMessage = screen.getByText(/404 - Page Not Found/i); // Use getByText
    expect(errorMessage).toBeDefined(); // Standard Jest matcher
  });
});
