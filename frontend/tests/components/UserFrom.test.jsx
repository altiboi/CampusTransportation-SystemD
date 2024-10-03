// UserFrom.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from '../../src/contexts/AppContext';
import UserFrom from  '../../src/pages/UserPages/UserFrom';

describe('UserFrom Component', () => {

  const renderComponent = () => {
    render(
      <AppProvider>
        <Router>
          <UserFrom />
        </Router>
      </AppProvider>
    );
  };

  it('should render the title and back button', () => {
    renderComponent();

    expect(screen.getByText('Current Location')).not.toBeNull();
    expect(screen.getByTestId('button')).not.toBeNull(); 
  });

  it('should allow selection of predefined locations', () => {
    renderComponent();


    const dropdown = screen.getByRole('combobox'); 
    fireEvent.change(dropdown, { target: { value: 'the-matrix' } });

    expect(dropdown.value).toBe('the-matrix');
  });

  it('should allow custom location input', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter custom Location');
    fireEvent.change(input, { target: { value: 'My Custom Location' } });

    expect(input.value).toBe('My Custom Location');
  });

  it('should update the destination when selecting "Other"', () => {
    renderComponent();

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'other' } });


    expect(screen.getByPlaceholderText('Enter custom Location').value).toBe('');
  });

  it('should go back to the previous page when back button is clicked', () => {
    renderComponent();

    const backButton = screen.getByTestId('button');
    fireEvent.click(backButton);

    expect(window.history.length).toBeGreaterThan(0); 
  });
});
