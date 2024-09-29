// UserWhereTo.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from '../../src/contexts/AppContext';
import UserWhereTo from '../../src/pages/UserPages/UserWherTo';

describe('UserWhereTo Component', () => {
  // Function to render the component with context
  const renderComponent = () => {
    render(
      <AppProvider>
        <Router>
          <UserWhereTo />
        </Router>
      </AppProvider>
    );
  };

  it('should render the title and back button', () => {
    renderComponent();

    expect(screen.getByText('Where To')).not.toBeNull();
    expect(screen.getByTestId('button')).not.toBeNull(); 
  });

  it('should allow selection of predefined destinations', () => {
    renderComponent();

    const dropdown = screen.getByRole('combobox'); 
    fireEvent.change(dropdown, { target: { value: 'the-matrix' } });

    expect(dropdown.value).toBe('the-matrix');
  });

  it('should allow custom destination input', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter custom destination');
    fireEvent.change(input, { target: { value: 'My Custom Destination' } });

    expect(input.value).toBe('My Custom Destination');
  });

  it('should update the destination when selecting "Other"', () => {
    renderComponent();

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'other' } });

    expect(screen.getByPlaceholderText('Enter custom destination').value).toBe('');
  });

  it('should go back to the previous page when back button is clicked', () => {
    renderComponent();

    const backButton = screen.getByTestId('button');
    fireEvent.click(backButton);
    expect(window.history.length).toBeGreaterThan(0); 
  });
});
