// UserFrom.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from '../../src/contexts/AppContext';
import UserMap from  '../../src/pages/UserPages/UserMap';

describe('UserFrom Component', () => {
  const renderComponent = () => {
    render(
      <AppProvider>
        <Router>
          <UserMap/>
        </Router>
      </AppProvider>
    );
  };

  it('should render the title and back button', () => {
    renderComponent();
    expect(screen.getByTestId('button')).not.toBeNull(); 
  });

  it('should go back to the previous page when back button is clicked', () => {
    renderComponent();

    const backButton = screen.getByTestId('button');
    fireEvent.click(backButton);
    expect(window.history.length).toBeGreaterThan(0); 
  });
});
